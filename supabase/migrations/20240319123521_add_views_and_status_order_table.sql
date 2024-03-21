create table "public"."status_order" (
    "event_name" text not null,
    "workflow_order" bigint not null
);


alter table "public"."status_order" enable row level security;

CREATE UNIQUE INDEX status_order_event_name_key ON public.status_order USING btree (event_name);

CREATE UNIQUE INDEX status_order_pkey ON public.status_order USING btree (event_name);

alter table "public"."status_order" add constraint "status_order_pkey" PRIMARY KEY using index "status_order_pkey";

alter table "public"."status_order" add constraint "status_order_event_name_key" UNIQUE using index "status_order_event_name_key";

create or replace view "public"."family_count" as  SELECT clients.family_id,
    count(families.primary_key) AS family_count
   FROM (clients
     LEFT JOIN families ON ((clients.family_id = families.family_id)))
  GROUP BY clients.family_id;


create or replace view "public"."last_status" as  WITH latest_events AS (
         SELECT e.parcel_id,
            e.event_name,
            e."timestamp",
            e.event_data,
            o.workflow_order,
            row_number() OVER (PARTITION BY e.parcel_id ORDER BY e."timestamp" DESC, e.parcel_id) AS row_num
           FROM (events e
             LEFT JOIN status_order o ON ((o.event_name = e.event_name)))
        )
 SELECT p.primary_key AS parcel_id,
    le.event_name,
    le."timestamp",
    le.event_data,
    le.workflow_order
   FROM (parcels p
     LEFT JOIN latest_events le ON (((p.primary_key = le.parcel_id) AND (le.row_num = 1))))
  ORDER BY COALESCE(le.workflow_order, (9999)::bigint);


create or replace view "public"."parcels_plus" as  SELECT parcels.primary_key AS parcel_id,
    parcels.collection_datetime,
    parcels.packing_datetime,
    parcels.voucher_number,
    collection_centres.name AS collection_centre_name,
    collection_centres.acronym AS collection_centre_acronym,
    clients.primary_key AS client_id,
    clients.full_name AS client_full_name,
    clients.address_postcode AS client_address_postcode,
    clients.flagged_for_attention AS client_flagged_for_attention,
    clients.signposting_call_required AS client_signposting_call_required,
    clients.phone_number AS client_phone_number,
    family_count.family_count,
    last_status.event_name AS last_status_event_name,
    last_status.event_data AS last_status_event_data,
    last_status."timestamp" AS last_status_timestamp,
    last_status.workflow_order AS last_status_workflow_order
   FROM ((((parcels
     JOIN collection_centres ON ((parcels.collection_centre = collection_centres.primary_key)))
     JOIN clients ON ((parcels.client_id = clients.primary_key)))
     LEFT JOIN family_count ON ((family_count.family_id = clients.family_id)))
     LEFT JOIN last_status ON ((last_status.parcel_id = parcels.primary_key)))
  ORDER BY parcels.packing_datetime DESC;


create or replace view "public"."clients_plus" as  SELECT clients.primary_key AS client_id,
    clients.full_name,
    clients.address_postcode,
    clients.phone_number,
    family_count.family_count
   FROM (clients
     LEFT JOIN family_count ON ((clients.family_id = family_count.family_id)))
  ORDER BY clients.full_name;


grant delete on table "public"."status_order" to "anon";

grant insert on table "public"."status_order" to "anon";

grant references on table "public"."status_order" to "anon";

grant select on table "public"."status_order" to "anon";

grant trigger on table "public"."status_order" to "anon";

grant truncate on table "public"."status_order" to "anon";

grant update on table "public"."status_order" to "anon";

grant delete on table "public"."status_order" to "authenticated";

grant insert on table "public"."status_order" to "authenticated";

grant references on table "public"."status_order" to "authenticated";

grant select on table "public"."status_order" to "authenticated";

grant trigger on table "public"."status_order" to "authenticated";

grant truncate on table "public"."status_order" to "authenticated";

grant update on table "public"."status_order" to "authenticated";

grant delete on table "public"."status_order" to "service_role";

grant insert on table "public"."status_order" to "service_role";

grant references on table "public"."status_order" to "service_role";

grant select on table "public"."status_order" to "service_role";

grant trigger on table "public"."status_order" to "service_role";

grant truncate on table "public"."status_order" to "service_role";

grant update on table "public"."status_order" to "service_role";

create policy "Enable read access for all users"
on "public"."status_order"
as permissive
for select
to public
using (true);



