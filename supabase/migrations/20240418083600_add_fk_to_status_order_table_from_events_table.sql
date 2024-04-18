drop view if exists "public"."parcels_plus";

drop view if exists "public"."last_status";

alter table "public"."events" rename column "event_name" to "new_parcel_status";

alter table "public"."events" add constraint "events_new_parcel_status_fkey" FOREIGN KEY (new_parcel_status) REFERENCES status_order(event_name) not valid;

alter table "public"."events" validate constraint "events_new_parcel_status_fkey";

create or replace view "public"."last_status" as  WITH latest_events AS (
         SELECT e.parcel_id,
            e.new_parcel_status AS event_name,
            e."timestamp",
            e.event_data,
            o.workflow_order,
            row_number() OVER (PARTITION BY e.parcel_id ORDER BY e."timestamp" DESC, e.parcel_id) AS row_num
           FROM (events e
             LEFT JOIN status_order o ON ((o.event_name = e.new_parcel_status)))
        )
 SELECT p.primary_key AS parcel_id,
    le.event_name,
    le."timestamp",
    le.event_data,
    le.workflow_order
   FROM (parcels p
     LEFT JOIN latest_events le ON (((p.primary_key = le.parcel_id) AND (le.row_num = 1))))
  ORDER BY COALESCE(le.workflow_order, (9999)::bigint);


create or replace view "public"."parcels_plus" as  SELECT parcels.primary_key AS parcel_id,
    parcels.collection_datetime,
    parcels.packing_date,
    packing_slots.name AS packing_slot_name,
    packing_slots."order" AS packing_slot_order,
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



