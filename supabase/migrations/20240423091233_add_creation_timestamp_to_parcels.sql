alter table "public"."parcels" add column "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

update "public"."parcels" set "created_at"='2023-12-31 12:00:00+00';

drop view if exists "public"."parcels_plus";

create view
  public.parcels_plus as
select
  parcels.primary_key as parcel_id,
  parcels.collection_datetime,
  parcels.packing_date,
  parcels.created_at,
  packing_slots.name as packing_slot_name,
  packing_slots."order" as packing_slot_order,
  parcels.voucher_number,
  collection_centres.name as collection_centre_name,
  collection_centres.acronym as collection_centre_acronym,
  clients.primary_key as client_id,
  clients.full_name as client_full_name,
  clients.address_postcode as client_address_postcode,
  clients.flagged_for_attention as client_flagged_for_attention,
  clients.signposting_call_required as client_signposting_call_required,
  clients.phone_number as client_phone_number,
  family_count.family_count,
  last_status.event_name as last_status_event_name,
  last_status.event_data as last_status_event_data,
  last_status."timestamp" as last_status_timestamp,
  last_status.workflow_order as last_status_workflow_order
from
  parcels
  left join collection_centres on parcels.collection_centre = collection_centres.primary_key
  left join clients on parcels.client_id = clients.primary_key
  left join packing_slots on parcels.packing_slot = packing_slots.primary_key
  left join family_count on family_count.family_id = clients.family_id
  left join last_status on last_status.parcel_id = parcels.primary_key
order by
  parcels.packing_date desc;
