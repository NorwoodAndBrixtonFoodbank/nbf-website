create table "public"."packing_slots" (
    "primary_key" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "is_hidden" boolean not null,
    "order" smallint not null
);


alter table "public"."packing_slots" enable row level security;

CREATE UNIQUE INDEX packing_slots_order_key ON public.packing_slots USING btree ("order");

CREATE UNIQUE INDEX packing_slots_pkey ON public.packing_slots USING btree (primary_key);

alter table "public"."packing_slots" add constraint "packing_slots_pkey" PRIMARY KEY using index "packing_slots_pkey";

alter table "public"."packing_slots" add constraint "packing_slots_order_key" UNIQUE using index "packing_slots_order_key";

grant delete on table "public"."packing_slots" to "anon";

grant insert on table "public"."packing_slots" to "anon";

grant references on table "public"."packing_slots" to "anon";

grant select on table "public"."packing_slots" to "anon";

grant trigger on table "public"."packing_slots" to "anon";

grant truncate on table "public"."packing_slots" to "anon";

grant update on table "public"."packing_slots" to "anon";

grant delete on table "public"."packing_slots" to "authenticated";

grant insert on table "public"."packing_slots" to "authenticated";

grant references on table "public"."packing_slots" to "authenticated";

grant select on table "public"."packing_slots" to "authenticated";

grant trigger on table "public"."packing_slots" to "authenticated";

grant truncate on table "public"."packing_slots" to "authenticated";

grant update on table "public"."packing_slots" to "authenticated";

grant delete on table "public"."packing_slots" to "service_role";

grant insert on table "public"."packing_slots" to "service_role";

grant references on table "public"."packing_slots" to "service_role";

grant select on table "public"."packing_slots" to "service_role";

grant trigger on table "public"."packing_slots" to "service_role";

grant truncate on table "public"."packing_slots" to "service_role";

grant update on table "public"."packing_slots" to "service_role";

create policy "Enable all access to admins"
on "public"."packing_slots"
as permissive
for all
to authenticated
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text));



