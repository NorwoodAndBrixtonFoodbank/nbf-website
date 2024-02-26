alter table "public"."lists_hotel" drop column "1_notes";

alter table "public"."lists_hotel" drop column "1_quantity";

alter table "public"."lists_hotel" drop column "2_notes";

alter table "public"."lists_hotel" drop column "2_quantity";

alter table "public"."lists_hotel" drop column "3_notes";

alter table "public"."lists_hotel" drop column "3_quantity";

alter table "public"."lists_hotel" drop column "4_notes";

alter table "public"."lists_hotel" drop column "4_quantity";

alter table "public"."lists_hotel" drop column "5_notes";

alter table "public"."lists_hotel" drop column "5_quantity";

alter table "public"."lists_hotel" drop column "6_notes";

alter table "public"."lists_hotel" drop column "6_quantity";

alter table "public"."lists_hotel" drop column "7_notes";

alter table "public"."lists_hotel" drop column "7_quantity";

alter table "public"."lists_hotel" drop column "8_notes";

alter table "public"."lists_hotel" drop column "8_quantity";

alter table "public"."lists_hotel" drop column "9_notes";

alter table "public"."lists_hotel" drop column "9_quantity";

alter table "public"."lists_hotel" drop column "10_notes";

alter table "public"."lists_hotel" drop column "10_quantity";

alter table "public"."lists_hotel" add column "notes_for_1" text;

alter table "public"."lists_hotel" add column "notes_for_2" text;

alter table "public"."lists_hotel" add column "notes_for_3" text;

alter table "public"."lists_hotel" add column "notes_for_4" text;

alter table "public"."lists_hotel" add column "notes_for_5" text;

alter table "public"."lists_hotel" add column "notes_for_6" text;

alter table "public"."lists_hotel" add column "notes_for_7" text;

alter table "public"."lists_hotel" add column "notes_for_8" text;

alter table "public"."lists_hotel" add column "notes_for_9" text;

alter table "public"."lists_hotel" add column "notes_for_10" text;

alter table "public"."lists_hotel" add column "quantity_for_1" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_2" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_3" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_4" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_5" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_6" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_7" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_8" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_9" text not null default ''::text;

alter table "public"."lists_hotel" add column "quantity_for_10" text not null default ''::text;



