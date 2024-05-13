drop view if exists "public"."clients_plus";
drop view if exists "public"."parcels_plus";

alter table "public"."clients" add column "is_active" boolean not null default true;

alter table "public"."clients" alter column "address_1" drop not null;

alter table "public"."clients" alter column "address_2" drop not null;

alter table "public"."clients" alter column "address_county" drop not null;

alter table "public"."clients" alter column "address_town" drop not null;

alter table "public"."clients" alter column "delivery_instructions" drop not null;

alter table "public"."clients" alter column "dietary_requirements" drop not null;

alter table "public"."clients" alter column "extra_information" drop not null;

alter table "public"."clients" alter column "feminine_products" drop not null;

alter table "public"."clients" alter column "flagged_for_attention" drop not null;

alter table "public"."clients" alter column "full_name" drop not null;

alter table "public"."clients" alter column "other_items" drop not null;

alter table "public"."clients" alter column "pet_food" drop not null;

alter table "public"."clients" alter column "phone_number" drop not null;

alter table "public"."clients" alter column "signposting_call_required" drop not null;

create or replace view "public"."clients_plus" as  SELECT clients.primary_key AS client_id,
    clients.full_name,
    clients.address_postcode,
    clients.phone_number,
    clients.is_active,
    family_count.family_count
   FROM (clients
     LEFT JOIN family_count ON ((clients.family_id = family_count.family_id)))
  ORDER BY clients.full_name;


create or replace view "public"."parcels_plus" as  SELECT parcels.primary_key AS parcel_id,
    parcels.collection_datetime,
    parcels.packing_date,
    parcels.created_at,
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
    clients.is_active AS client_is_active,
    family_count.family_count,
    last_status.event_name AS last_status_event_name,
    last_status.event_data AS last_status_event_data,
    last_status."timestamp" AS last_status_timestamp,
    last_status.workflow_order AS last_status_workflow_order
   FROM (((((parcels
     LEFT JOIN collection_centres ON ((parcels.collection_centre = collection_centres.primary_key)))
     LEFT JOIN clients ON ((parcels.client_id = clients.primary_key)))
     LEFT JOIN packing_slots ON ((parcels.packing_slot = packing_slots.primary_key)))
     LEFT JOIN family_count ON ((family_count.family_id = clients.family_id)))
     LEFT JOIN last_status ON ((last_status.parcel_id = parcels.primary_key)))
  ORDER BY parcels.packing_date DESC;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public."deactivateClient"(clientid uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    updated_family_id UUID;
BEGIN  
    UPDATE clients 
    SET 
        full_name = null,
        phone_number = null,
        address_1 = null,
        address_2 = null,
        address_town = null,
        address_county = null,
        address_postcode = null,
        delivery_instructions = null,
        dietary_requirements = null,
        feminine_products = null,
        baby_food = null,
        pet_food = null,
        other_items = null,
        extra_information = null,
        flagged_for_attention = null,
        signposting_call_required = null
    WHERE 
        primary_key = clientId;

    SELECT family_id INTO updated_family_id
    FROM clients
    WHERE primary_key = clientId;

    DELETE FROM families WHERE family_id = updated_family_id;

END;$function$
;




