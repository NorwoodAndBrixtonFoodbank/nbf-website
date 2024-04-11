create or replace view "public"."profiles_plus" as  SELECT users.id AS user_id,
    users.email,
    users.created_at,
    users.updated_at,
    profiles.first_name,
    profiles.last_name,
    profiles.role,
    profiles.telephone_number
   FROM (auth.users
     LEFT JOIN profiles ON ((users.id = profiles.user_id)))
  ORDER BY profiles.first_name;



