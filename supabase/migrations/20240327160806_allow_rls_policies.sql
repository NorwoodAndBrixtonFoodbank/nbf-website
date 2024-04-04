create policy "Enable access for all users"
on "public"."profiles"
as permissive
for all
to public
using (true);



