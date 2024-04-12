alter table "public"."audit_log" drop constraint "audit_log_list_id_fkey";

alter table "public"."audit_log" add constraint "audit_log_list_id_fkey" FOREIGN KEY (list_id) REFERENCES lists(primary_key) ON DELETE SET NULL not valid;

alter table "public"."audit_log" validate constraint "audit_log_list_id_fkey";


