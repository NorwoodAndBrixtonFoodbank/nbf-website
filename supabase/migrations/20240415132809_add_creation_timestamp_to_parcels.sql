alter table "public"."parcels" add column "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);


