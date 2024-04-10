alter table "public"."audit_log" drop constraint "audit_log_family_member_id_fkey";

alter table "public"."audit_log" drop column "family_member_id";


