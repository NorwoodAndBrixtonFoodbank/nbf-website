drop policy "Logged in roles" on "public"."clients";

drop policy "Admin roles can edit" on "public"."collection_centres";

drop policy "Logged in roles can select" on "public"."collection_centres";

drop policy "Admin roles" on "public"."lists";

drop policy "Admin roles" on "public"."lists_hotel";

drop policy "Enable all access to admins" on "public"."packing_slots";

drop policy "Admin roles" on "public"."website_data";

create policy "Enable access for authenticated users"
on "public"."clients"
as permissive
for all
to authenticated
using (true);


create policy "Enable access for admin user, select for authenticated"
on "public"."collection_centres"
as permissive
for all
to authenticated
using (true)
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.primary_key = auth.uid()) AND (profiles.role = 'admin'::role)))));


create policy "Enable access for admin user, select for authenticated"
on "public"."lists"
as permissive
for all
to authenticated
using (true)
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.primary_key = auth.uid()) AND (profiles.role = 'admin'::role)))));


create policy "Enable access for admin user, select for authenticated"
on "public"."lists_hotel"
as permissive
for all
to authenticated
using (true)
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.primary_key = auth.uid()) AND (profiles.role = 'admin'::role)))));


create policy "Enable access to admins, select for authenticated"
on "public"."packing_slots"
as permissive
for all
to authenticated
using (true)
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.primary_key = auth.uid()) AND (profiles.role = 'admin'::role)))));


create policy "Enable access for admin user, select for authenticated"
on "public"."website_data"
as permissive
for all
to authenticated
using (true)
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.primary_key = auth.uid()) AND (profiles.role = 'admin'::role)))));



