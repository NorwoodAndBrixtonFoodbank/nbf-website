alter table "public"."audit_log" add column "actor_profile_id" uuid;

alter table "public"."audit_log" add constraint "audit_log_actor_profile_id_fkey" FOREIGN KEY ("actor_profile_id") REFERENCES "public"."profiles"("primary_key") ON DELETE SET NULL;

update "public"."audit_log" as audit_log set "actor_profile_id" = profiles."primary_key" from "public"."profiles" as profiles where audit_log."user_id" = profiles."user_id";

alter table "public"."audit_log" drop constraint "audit_log_profile_id_fkey";

alter table "public"."audit_log" drop column "user_id";
