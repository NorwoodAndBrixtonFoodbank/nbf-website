alter table "public"."audit_log" add column "wiki_id" uuid;

alter table "public"."audit_log" add constraint "public_audit_log_wiki_id_fkey" FOREIGN KEY (wiki_id) REFERENCES wiki(wiki_key) ON DELETE SET NULL not valid;

alter table "public"."audit_log" validate constraint "public_audit_log_wiki_id_fkey";