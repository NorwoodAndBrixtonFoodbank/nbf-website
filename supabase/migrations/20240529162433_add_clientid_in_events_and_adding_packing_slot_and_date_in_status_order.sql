alter table "public"."events" add column "client_id" uuid;

alter table "public"."events" add constraint "public_events_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."events" validate constraint "public_events_client_id_fkey";


