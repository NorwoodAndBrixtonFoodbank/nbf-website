create or replace view "public"."profiles_plus" as  SELECT profiles.primary_key AS user_id,
    profiles.first_name,
    profiles.last_name,
    profiles.role,
    profiles.telephone_number,
    users.email,
    users.created_at,
    users.updated_at
   FROM (profiles
     LEFT JOIN auth.users ON ((profiles.primary_key = users.id)))
  ORDER BY profiles.first_name;



