drop policy "Enable read for authenciated users" on "public"."wiki";

create policy "Enable read for authenciated users"
on "public"."wiki"
as permissive
for select
to authenticated
using (true);



