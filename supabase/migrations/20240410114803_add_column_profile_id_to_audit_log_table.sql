alter table "public"."audit_log" add column "profile_id" uuid;

alter table "public"."audit_log" add constraint "audit_log_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(primary_key) not valid;

alter table "public"."audit_log" validate constraint "audit_log_profile_id_fkey";

