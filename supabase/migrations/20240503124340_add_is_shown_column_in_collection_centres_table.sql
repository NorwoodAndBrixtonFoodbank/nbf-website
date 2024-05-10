alter table "public"."collection_centres" add column "is_shown" boolean default true;
alter table "public"."collection_centres" alter "is_shown" set not null;


