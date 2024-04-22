alter table "public"."audit_log" add column "created_at" timestamp with time zone default current_timestamp;
update "public"."audit_log" set created_at = current_timestamp;
alter table "public"."audit_log" alter column "created_at" set not null;
