alter table "public"."clients" drop constraint "clients_address_postcode_check";

alter table "public"."clients" alter column "address_postcode" drop not null;


