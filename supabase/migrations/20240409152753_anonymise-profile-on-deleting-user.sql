alter table "public"."profiles" drop constraint "profiles_primary_key_fkey";

alter table "public"."profiles" add column "user_id" uuid;

alter table "public"."profiles" alter column "primary_key" set default gen_random_uuid();

CREATE UNIQUE INDEX profiles_user_id_key ON public.profiles USING btree (user_id);

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_key" UNIQUE using index "profiles_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.anonymise_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    if new.user_id is null then
        new.first_name = null;
        new.last_name = null;
        new.telephone_number = null;
        update public.profiles
        set first_name = new.first_name, last_name = new.last_name, telephone_number = new.telephone_number
        where primary_key = new.primary_key;
    end if;
    return new;
END;$function$
;

CREATE TRIGGER anonymise_profile_trigger AFTER UPDATE OF user_id ON public.profiles FOR EACH ROW EXECUTE FUNCTION anonymise_profile();

UPDATE profiles
SET user_id = primary_key
WHERE user_id IS NULL;
