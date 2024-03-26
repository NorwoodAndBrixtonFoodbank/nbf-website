drop view if exists "public"."parcels_plus";

alter table "public"."parcels" rename column "packing_datetime" to "packing_date";

alter table "public"."parcels" alter column "packing_date" set data type date;

alter table "public"."parcels" add column "packing_slot" uuid;

alter table "public"."parcels" add constraint "parcels_packing_slot_fkey" FOREIGN KEY (packing_slot) REFERENCES packing_slots(primary_key) not valid;

alter table "public"."parcels" validate constraint "parcels_packing_slot_fkey";

create or replace view "public"."parcels_plus" as  SELECT parcels.primary_key AS parcel_id,
    parcels.collection_datetime,
    parcels.packing_date,
    packing_slots.name AS packing_slot_name,
    parcels.voucher_number,
    collection_centres.name AS collection_centre_name,
    collection_centres.acronym AS collection_centre_acronym,
    clients.primary_key AS client_id,
    clients.full_name AS client_full_name,
    clients.address_postcode AS client_address_postcode,
    clients.flagged_for_attention AS client_flagged_for_attention,
    clients.signposting_call_required AS client_signposting_call_required,
    clients.phone_number AS client_phone_number,
    family_count.family_count,
    last_status.event_name AS last_status_event_name,
    last_status.event_data AS last_status_event_data,
    last_status."timestamp" AS last_status_timestamp,
    last_status.workflow_order AS last_status_workflow_order
   FROM (((((parcels
     JOIN collection_centres ON ((parcels.collection_centre = collection_centres.primary_key)))
     JOIN clients ON ((parcels.client_id = clients.primary_key)))
     JOIN packing_slots ON ((parcels.packing_slot = packing_slots.primary_key)))
     LEFT JOIN family_count ON ((family_count.family_id = clients.family_id)))
     LEFT JOIN last_status ON ((last_status.parcel_id = parcels.primary_key)))
  ORDER BY parcels.packing_date DESC;



