alter table "public"."clients" add column "default_list" list_type not null default 'Regular'::list_type;

alter table "public"."lists" add column "list_type" list_type not null default 'Regular'::list_type;

alter table "public"."parcels" add column "list_type" list_type not null default 'Regular'::list_type;


