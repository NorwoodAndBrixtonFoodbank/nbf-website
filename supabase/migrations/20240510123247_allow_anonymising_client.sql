drop view if exists "public"."clients_plus";

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



