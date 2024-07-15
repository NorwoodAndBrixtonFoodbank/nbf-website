alter table "public"."profiles" add column "email" varchar;

alter table "public"."profiles" add column "created_at" timestamp;

alter table "public"."profiles" add column "updated_at" timestamp;

alter table "public"."profiles" add column "last_sign_in_at" timestamp;


update public.profiles
  set
    email = users.email,
    created_at = users.created_at,
    updated_at = users.updated_at,
    last_sign_in_at = users.last_sign_in_at
  from auth.users
  where users.id = profiles.user_id;


create function public.update_profile_on_auth_user_update()
  returns trigger
  language plpgsql
  security definer set search_path = ''
  as $$
  begin
    update public.profiles
      set
        email = new.email,
        created_at = new.created_at,
        updated_at = new.updated_at,
        last_sign_in_at = new.last_sign_in_at
      where new.id = profiles.user_id;
    return new;
  end;
  $$;


create trigger update_profile
  after update on auth.users
  for each row
  execute function update_profile_on_auth_user_update();
