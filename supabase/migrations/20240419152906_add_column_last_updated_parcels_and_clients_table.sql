alter table "public"."clients" add column "last_updated" timestamp with time zone default current_timestamp;
update "public"."clients" set last_updated = current_timestamp;
alter table "public"."clients" alter column "last_updated" set not null;
alter table "public"."parcels" add column "last_updated" timestamp with time zone default current_timestamp;
update "public"."parcels" set last_updated = current_timestamp;
alter table "public"."parcels" alter column "last_updated" set not null;

