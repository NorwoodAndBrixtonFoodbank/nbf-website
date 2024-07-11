alter table "public"."events" drop constraint "public_events_client_id_fkey";

alter table "public"."events" drop column "client_id";
