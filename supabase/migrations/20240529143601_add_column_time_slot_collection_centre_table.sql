alter table "public"."collection_centres" add column "active_time_slots" time without time zone[] default array[
    '10:00:00'::time without time zone,
    '10:15:00'::time without time zone,
    '10:30:00'::time without time zone,
    '10:45:00'::time without time zone,
    '11:00:00'::time without time zone,
    '11:15:00'::time without time zone,
    '11:30:00'::time without time zone,
    '11:45:00'::time without time zone,
    '12:00:00'::time without time zone,
    '12:15:00'::time without time zone,
    '12:30:00'::time without time zone,
    '12:45:00'::time without time zone,
    '13:00:00'::time without time zone,
    '13:15:00'::time without time zone,
    '13:30:00'::time without time zone,
    '13:45:00'::time without time zone,
    '14:00:00'::time without time zone
];

alter table "public"."collection_centres" alter column "active_time_slots" set not null;
