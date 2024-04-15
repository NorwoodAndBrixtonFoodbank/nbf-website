alter table "public"."parcels" add column "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

update "public"."parcels" set "created_at"='2023-12-31 12:00:00+00'
