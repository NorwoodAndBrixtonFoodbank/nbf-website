drop policy "Enable read for authenciated users" on "public"."wiki";

drop function if exists "public"."update_profile_on_auth_user_update"();

drop view if exists "public"."audit_log_plus";

alter table "public"."profiles" drop column "created_at";

alter table "public"."profiles" drop column "email";

alter table "public"."profiles" drop column "last_sign_in_at";

alter table "public"."profiles" drop column "updated_at";

drop type "public"."list_type";

create or replace view "public"."users_plus" as  SELECT users.id AS user_id,
    users.email,
    users.created_at,
    users.updated_at,
    profiles.primary_key AS profile_id,
    profiles.first_name,
    profiles.last_name,
    profiles.role,
    profiles.telephone_number
   FROM (auth.users
     LEFT JOIN profiles ON ((users.id = profiles.user_id)))
  ORDER BY profiles.first_name;


create or replace view "public"."audit_log_plus" as  SELECT audit_log.action,
    audit_log.actor_profile_id,
    audit_log.client_id,
    audit_log.collection_centre_id,
    audit_log.content,
    audit_log.created_at,
    audit_log.event_id,
    audit_log.list_hotel_id,
    audit_log.list_id,
    audit_log.log_id,
    audit_log.packing_slot_id,
    audit_log.parcel_id,
    audit_log.primary_key,
    audit_log.profile_id,
    audit_log.status_order,
    audit_log."wasSuccess",
    audit_log.website_data,
    concat(profiles.first_name, ' ', profiles.last_name) AS actor_name,
    profiles.user_id AS actor_user_id,
    profiles.role AS actor_role
   FROM (audit_log
     LEFT JOIN profiles ON ((audit_log.actor_profile_id = profiles.primary_key)))
  ORDER BY audit_log.created_at;


create policy "Enable read for authenciated users"
on "public"."wiki"
as permissive
for select
to authenticated
using (true);



