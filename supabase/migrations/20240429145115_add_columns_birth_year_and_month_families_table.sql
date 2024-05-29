alter table "public"."families" add column "birth_month" smallint;

alter table "public"."families" add column "birth_year" smallint;

update "public"."families" set "birth_year" = (SELECT date_part('year', (SELECT current_timestamp))) - age;

alter table "public"."families" alter column "birth_year" set not null;

alter table "public"."families" drop column "age";
