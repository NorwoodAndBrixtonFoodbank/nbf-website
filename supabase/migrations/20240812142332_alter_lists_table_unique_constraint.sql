alter table "public"."lists" drop constraint "lists_item_name_key";

drop index if exists "public"."lists_item_name_key";

CREATE UNIQUE INDEX lists_list_type_item_name_key ON public.lists USING btree (list_type, item_name);

alter table "public"."lists" add constraint "lists_list_type_item_name_key" UNIQUE using index "lists_list_type_item_name_key";


