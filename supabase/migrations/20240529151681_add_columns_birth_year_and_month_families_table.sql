alter table "public"."families" add column "birth_month" smallint;

alter table "public"."families" add column "birth_year" smallint;

update "public"."families" set "birth_year" = (SELECT date_part('year', (SELECT current_timestamp))) - age;

update "public"."families" set "birth_year" = date_part('year', current_timestamp) where age is null;

alter table "public"."families" drop column "age";

alter table "public"."families" alter column "birth_year" set not null;

