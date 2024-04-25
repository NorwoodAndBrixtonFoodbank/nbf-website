alter table "public"."audit_log" add column "actor_profile_id" uuid not null;

alter table "public"."audit_log" add constraint "audit_log_actor_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(primary_key) not valid;

update "public"."audit_log" set "actor_profile_id"="public"."profiles"."profile_id" from "public"."audit_log" inner join "public"."profiles" on "public"."audit_log"."user_id" = "public"."profiles"."user_id";

alter table "public"."audit_log" drop constraint "audit_log_profile_id_fkey";

alter table "public"."audit_log" drop column "profile_id;
