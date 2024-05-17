drop policy "Enable read access for all users" on "public"."status_order";

create policy "Enable read access for all users"
on "public"."status_order"
as permissive
for select
to authenticated
using (true);



