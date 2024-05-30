create type "public"."collection_timeslot_type" as ("time" time without time zone, "is_active" boolean);

alter table "public"."collection_centres" add column "time_slots" collection_timeslot_type[];
