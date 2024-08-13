drop policy "Enable access for admin/manager/staff, select for authenticated" on "public"."lists_hotel";

revoke delete on table "public"."lists_hotel" from "anon";

revoke insert on table "public"."lists_hotel" from "anon";

revoke references on table "public"."lists_hotel" from "anon";

revoke select on table "public"."lists_hotel" from "anon";

revoke trigger on table "public"."lists_hotel" from "anon";

revoke truncate on table "public"."lists_hotel" from "anon";

revoke update on table "public"."lists_hotel" from "anon";

revoke delete on table "public"."lists_hotel" from "authenticated";

revoke insert on table "public"."lists_hotel" from "authenticated";

revoke references on table "public"."lists_hotel" from "authenticated";

revoke select on table "public"."lists_hotel" from "authenticated";

revoke trigger on table "public"."lists_hotel" from "authenticated";

revoke truncate on table "public"."lists_hotel" from "authenticated";

revoke update on table "public"."lists_hotel" from "authenticated";

revoke delete on table "public"."lists_hotel" from "service_role";

revoke insert on table "public"."lists_hotel" from "service_role";

revoke references on table "public"."lists_hotel" from "service_role";

revoke select on table "public"."lists_hotel" from "service_role";

revoke trigger on table "public"."lists_hotel" from "service_role";

revoke truncate on table "public"."lists_hotel" from "service_role";

revoke update on table "public"."lists_hotel" from "service_role";

alter table "public"."audit_log" drop constraint "public_audit_log_list_hotel_id_fkey";

alter table "public"."lists_hotel" drop constraint "lists_hotel_item_name_key";

drop view if exists "public"."audit_log_plus";

alter table "public"."lists_hotel" drop constraint "lists_hotel_pkey";

drop index if exists "public"."lists_hotel_item_name_key";

drop index if exists "public"."lists_hotel_pkey";

drop table "public"."lists_hotel";

alter table "public"."audit_log" drop column "list_hotel_id";

create or replace view "public"."audit_log_plus" as  SELECT audit_log.action,
    audit_log.actor_profile_id,
    audit_log.client_id,
    audit_log.collection_centre_id,
    audit_log.content,
    audit_log.created_at,
    audit_log.event_id,
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



