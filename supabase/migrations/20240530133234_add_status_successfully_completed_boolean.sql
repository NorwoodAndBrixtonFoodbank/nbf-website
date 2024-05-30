ALTER TABLE "public"."status_order" ADD COLUMN "is_successfully_completed_event" BOOLEAN NOT NULL DEFAULT false;
UPDATE "public"."status_order"
SET "is_successfully_completed_event" = true
WHERE "event_name" IN ('Delivered', 'Fulfilled with Trussell Trust', 'Parcel Collected');
