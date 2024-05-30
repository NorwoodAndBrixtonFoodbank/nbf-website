create type "public"."collection_timeslot_type" as ("time" time without time zone, "is_active" boolean);

alter table "public"."collection_centres" add column "time_slots" collection_timeslot_type[] default array[
     ROW('10:00:00', TRUE)::collection_timeslot_type,
     ROW('10:15:00', TRUE)::collection_timeslot_type,
     ROW('10:30:00', TRUE)::collection_timeslot_type,
     ROW('10:45:00', TRUE)::collection_timeslot_type,
     ROW('11:00:00', TRUE)::collection_timeslot_type,
     ROW('11:15:00', TRUE)::collection_timeslot_type,
     ROW('11:30:00', TRUE)::collection_timeslot_type,
     ROW('11:45:00', TRUE)::collection_timeslot_type,
     ROW('12:00:00', TRUE)::collection_timeslot_type,
     ROW('12:15:00', TRUE)::collection_timeslot_type,
     ROW('12:30:00', TRUE)::collection_timeslot_type,
     ROW('12:45:00', TRUE)::collection_timeslot_type,
     ROW('13:00:00', TRUE)::collection_timeslot_type,
     ROW('13:15:00', TRUE)::collection_timeslot_type,
     ROW('13:30:00', TRUE)::collection_timeslot_type,
     ROW('13:45:00', TRUE)::collection_timeslot_type,
     ROW('14:00:00', TRUE)::collection_timeslot_type
 ];

alter table "public"."collection_centres" alter column "time_slots" set not null;
