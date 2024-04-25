drop view if exists "public"."profiles_plus";

alter type "public"."role" rename to "role__old_version_to_be_dropped";

create type "public"."role" as enum ('volunteer', 'admin', 'manager', 'staff');

alter table "public"."profiles" alter column role type "public"."role" using (
      CASE role::text
        WHEN 'caller' THEN 'volunteer'
        ELSE role::text
      END
    )::"public"."role";

drop type "public"."role__old_version_to_be_dropped";

create or replace view "public"."profiles_plus" as  SELECT users.id AS user_id,
    users.email,
    users.created_at,
    users.updated_at,
    profiles.first_name,
    profiles.last_name,
    profiles.role,
    profiles.telephone_number
   FROM (auth.users
     LEFT JOIN profiles ON ((users.id = profiles.user_id)))
  ORDER BY profiles.first_name;

drop policy "Enable access for admin user, select for authenticated" on "public"."lists";

drop policy "Enable access for admin user, select for authenticated" on "public"."lists_hotel";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.user_is_admin_or_manager_or_staff()
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
RETURN EXISTS ( 
  SELECT 1
  FROM profiles
  WHERE (
    (profiles.user_id = auth.uid()) AND 
    ((profiles.role = 'admin'::role) OR (profiles.role = 'manager'::role) OR (profiles.role = 'staff'::role))
  )
);
END;$function$
;

create policy "Enable access for admin/manager/staff, select for authenticated"
on "public"."lists"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin_or_manager_or_staff());


create policy "Enable access for admin/manager/staff, select for authenticated"
on "public"."lists_hotel"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin_or_manager_or_staff());

