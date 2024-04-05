create table "public"."audit_log" (
    "primary_key" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "action" text,
    "client_id" uuid,
    "collection_centre_id" uuid,
    "event_id" uuid,
    "family_member_id" uuid,
    "list_id" uuid,
    "list_hotel_id" uuid,
    "packing_slot_id" uuid,
    "parcel_id" uuid,
    "status_order" text,
    "website_data" text,
    "content" jsonb,
    "wasSuccess" boolean not null,
    "log_id" text
);


alter table "public"."audit_log" enable row level security;

CREATE UNIQUE INDEX audit_log_pkey ON public.audit_log USING btree (primary_key);

alter table "public"."audit_log" add constraint "audit_log_pkey" PRIMARY KEY using index "audit_log_pkey";

alter table "public"."audit_log" add constraint "audit_log_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_client_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_collection_centre_id_fkey" FOREIGN KEY (collection_centre_id) REFERENCES collection_centres(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_collection_centre_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_event_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_family_member_id_fkey" FOREIGN KEY (family_member_id) REFERENCES families(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_family_member_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_list_hotel_id_fkey" FOREIGN KEY (list_hotel_id) REFERENCES lists_hotel(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_list_hotel_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_list_id_fkey" FOREIGN KEY (list_id) REFERENCES lists(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_list_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_packing_slot_id_fkey" FOREIGN KEY (packing_slot_id) REFERENCES packing_slots(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_packing_slot_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_parcel_id_fkey" FOREIGN KEY (parcel_id) REFERENCES parcels(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_parcel_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_status_order_fkey" FOREIGN KEY (status_order) REFERENCES status_order(event_name) not valid;

alter table "public"."audit_log" validate constraint "audit_log_status_order_fkey";

alter table "public"."audit_log" add constraint "audit_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."audit_log" validate constraint "audit_log_user_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_website_data_fkey" FOREIGN KEY (website_data) REFERENCES website_data(name) not valid;

alter table "public"."audit_log" validate constraint "audit_log_website_data_fkey";

grant delete on table "public"."audit_log" to "anon";

grant insert on table "public"."audit_log" to "anon";

grant references on table "public"."audit_log" to "anon";

grant select on table "public"."audit_log" to "anon";

grant trigger on table "public"."audit_log" to "anon";

grant truncate on table "public"."audit_log" to "anon";

grant update on table "public"."audit_log" to "anon";

grant delete on table "public"."audit_log" to "authenticated";

grant insert on table "public"."audit_log" to "authenticated";

grant references on table "public"."audit_log" to "authenticated";

grant select on table "public"."audit_log" to "authenticated";

grant trigger on table "public"."audit_log" to "authenticated";

grant truncate on table "public"."audit_log" to "authenticated";

grant update on table "public"."audit_log" to "authenticated";

grant delete on table "public"."audit_log" to "service_role";

grant insert on table "public"."audit_log" to "service_role";

grant references on table "public"."audit_log" to "service_role";

grant select on table "public"."audit_log" to "service_role";

grant trigger on table "public"."audit_log" to "service_role";

grant truncate on table "public"."audit_log" to "service_role";

grant update on table "public"."audit_log" to "service_role";

create policy "Enable read access for all users and edit for admins"
on "public"."audit_log"
as permissive
for all
to authenticated
using (true)
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.primary_key = auth.uid()) AND (profiles.role = 'admin'::role)))));



