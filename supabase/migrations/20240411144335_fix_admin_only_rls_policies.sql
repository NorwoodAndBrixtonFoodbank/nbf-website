drop policy "Enable access for admin user, select for authenticated" on "public"."collection_centres";

drop policy "Enable access for admin user, select for authenticated" on "public"."lists";

drop policy "Enable access for admin user, select for authenticated" on "public"."lists_hotel";

drop policy "Enable access to admins, select for authenticated" on "public"."packing_slots";

drop policy "Enable access for admin user, select for authenticated" on "public"."website_data";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.user_is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
RETURN EXISTS ( 
  SELECT 1
  FROM profiles
  WHERE (
    (profiles.user_id = auth.uid()) AND 
    (profiles.role = 'admin'::role)
  )
);
END;$function$
;

create policy "Enable access for admin user, select for authenticated"
on "public"."collection_centres"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin());


create policy "Enable access for admin user, select for authenticated"
on "public"."lists"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin());


create policy "Enable access for admin user, select for authenticated"
on "public"."lists_hotel"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin());


create policy "Enable access to admins, select for authenticated"
on "public"."packing_slots"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin());


create policy "Enable access for admin user, select for authenticated"
on "public"."website_data"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin());



