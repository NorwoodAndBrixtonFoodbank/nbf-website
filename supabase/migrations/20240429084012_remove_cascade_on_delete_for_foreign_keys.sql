alter table "public"."audit_log" drop constraint "audit_log_collection_centre_id_fkey";

alter table "public"."audit_log" drop constraint "audit_log_list_hotel_id_fkey";

alter table "public"."audit_log" drop constraint "audit_log_packing_slot_id_fkey";

alter table "public"."audit_log" drop constraint "audit_log_parcel_id_fkey";

alter table "public"."audit_log" drop constraint "audit_log_status_order_fkey";

alter table "public"."audit_log" drop constraint "audit_log_website_data_fkey";

alter table "public"."events" drop constraint "events_new_parcel_status_fkey";

alter table "public"."events" drop constraint "events_parcel_id_fkey";

alter table "public"."families" drop constraint "families_family_id_fkey";

alter table "public"."parcels" drop constraint "parcels_client_id_fkey";

alter table "public"."parcels" drop constraint "parcels_collection_centre_fkey";

alter table "public"."parcels" drop constraint "parcels_packing_slot_fkey";

alter table "public"."audit_log" add constraint "public_audit_log_collection_centre_id_fkey" FOREIGN KEY (collection_centre_id) REFERENCES collection_centres(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_collection_centre_id_fkey";

alter table "public"."audit_log" add constraint "public_audit_log_list_hotel_id_fkey" FOREIGN KEY (list_hotel_id) REFERENCES lists_hotel(primary_key) ON DELETE SET NULL not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_list_hotel_id_fkey";

alter table "public"."audit_log" add constraint "public_audit_log_packing_slot_id_fkey" FOREIGN KEY (packing_slot_id) REFERENCES packing_slots(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_packing_slot_id_fkey";

alter table "public"."audit_log" add constraint "public_audit_log_parcel_id_fkey" FOREIGN KEY (parcel_id) REFERENCES parcels(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_parcel_id_fkey";

alter table "public"."audit_log" add constraint "public_audit_log_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(primary_key) ON DELETE SET NULL not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_profile_id_fkey";

alter table "public"."audit_log" add constraint "public_audit_log_status_order_fkey" FOREIGN KEY (status_order) REFERENCES status_order(event_name) ON DELETE RESTRICT not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_status_order_fkey";

alter table "public"."audit_log" add constraint "public_audit_log_website_data_fkey" FOREIGN KEY (website_data) REFERENCES website_data(name) ON DELETE RESTRICT not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_website_data_fkey";

alter table "public"."events" add constraint "public_events_new_parcel_status_fkey" FOREIGN KEY (new_parcel_status) REFERENCES status_order(event_name) ON DELETE RESTRICT not valid;

alter table "public"."events" validate constraint "public_events_new_parcel_status_fkey";

alter table "public"."events" add constraint "public_events_parcel_id_fkey" FOREIGN KEY (parcel_id) REFERENCES parcels(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."events" validate constraint "public_events_parcel_id_fkey";

alter table "public"."families" add constraint "public_families_family_id_fkey" FOREIGN KEY (family_id) REFERENCES clients(family_id) ON DELETE RESTRICT not valid;

alter table "public"."families" validate constraint "public_families_family_id_fkey";

alter table "public"."parcels" add constraint "public_parcels_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."parcels" validate constraint "public_parcels_client_id_fkey";

alter table "public"."parcels" add constraint "public_parcels_collection_centre_fkey" FOREIGN KEY (collection_centre) REFERENCES collection_centres(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."parcels" validate constraint "public_parcels_collection_centre_fkey";

alter table "public"."parcels" add constraint "public_parcels_packing_slot_fkey" FOREIGN KEY (packing_slot) REFERENCES packing_slots(primary_key) ON DELETE RESTRICT not valid;

alter table "public"."parcels" validate constraint "public_parcels_packing_slot_fkey";


