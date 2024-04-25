alter table "public"."audit_log" alter column "action" set not null;

alter publication supabase_realtime add table audit_log;
