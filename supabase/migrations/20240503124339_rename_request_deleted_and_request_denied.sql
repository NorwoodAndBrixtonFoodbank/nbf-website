alter table "public"."events" drop constraint "events_new_parcel_status_fkey";

alter table "public"."events" add constraint "public_events_new_parcel_status_fkey" FOREIGN KEY (new_parcel_status) REFERENCES status_order(event_name) ON UPDATE CASCADE not valid;

alter table "public"."events" validate constraint "public_events_new_parcel_status_fkey";

UPDATE status_order
SET event_name = 'Parcel Deleted'
WHERE event_name = 'Request Deleted';

UPDATE status_order
SET event_name = 'Parcel Denied'
WHERE event_name = 'Request Denied';
