drop view if exists "public"."profiles_plus";

alter type "public"."role" rename to "role__old_version_to_be_dropped";

create type "public"."role" as enum ('volunteer', 'admin', 'manager', 'staff');

alter table "public"."profiles" alter column role type "public"."role" using role::text::"public"."role";

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



