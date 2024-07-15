create table "public"."wiki" (
    "title" text not null default ''::text,
    "content" text not null default ''::text,
    "order" bigint not null default '-1'::bigint
);


alter table "public"."wiki" enable row level security;

CREATE UNIQUE INDEX wiki_pkey ON public.wiki USING btree (title);

alter table "public"."wiki" add constraint "wiki_pkey" PRIMARY KEY using index "wiki_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.user_is_admin_or_manager()
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
RETURN EXISTS ( 
  SELECT 1
  FROM profiles
  WHERE (
    (profiles.user_id = auth.uid()) AND 
    ((profiles.role = 'admin'::role) OR (profiles.role = 'manager'::role))
  )
);
END;$function$
;

grant delete on table "public"."wiki" to "anon";

grant insert on table "public"."wiki" to "anon";

grant references on table "public"."wiki" to "anon";

grant select on table "public"."wiki" to "anon";

grant trigger on table "public"."wiki" to "anon";

grant truncate on table "public"."wiki" to "anon";

grant update on table "public"."wiki" to "anon";

grant delete on table "public"."wiki" to "authenticated";

grant insert on table "public"."wiki" to "authenticated";

grant references on table "public"."wiki" to "authenticated";

grant select on table "public"."wiki" to "authenticated";

grant trigger on table "public"."wiki" to "authenticated";

grant truncate on table "public"."wiki" to "authenticated";

grant update on table "public"."wiki" to "authenticated";

grant delete on table "public"."wiki" to "service_role";

grant insert on table "public"."wiki" to "service_role";

grant references on table "public"."wiki" to "service_role";

grant select on table "public"."wiki" to "service_role";

grant trigger on table "public"."wiki" to "service_role";

grant truncate on table "public"."wiki" to "service_role";

grant update on table "public"."wiki" to "service_role";

create policy "Enable all for admins/managers"
on "public"."wiki"
as permissive
for all
to authenticated
using (true)
with check (user_is_admin_or_manager());


create policy "Enable read for authenciated users"
on "public"."wiki"
as permissive
for select
to public
using (true);



