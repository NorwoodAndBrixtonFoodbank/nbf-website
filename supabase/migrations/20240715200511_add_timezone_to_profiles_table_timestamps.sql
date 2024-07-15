alter table "public"."profiles" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."profiles" alter column "last_sign_in_at" set data type timestamp with time zone using "last_sign_in_at"::timestamp with time zone;

alter table "public"."profiles" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;
