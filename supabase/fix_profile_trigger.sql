-- Auto-create a profiles row when a new auth.users row is created.
-- This eliminates the FK violation on gym_groups and gym_group_members
-- that happens when a new user tries to create/join a group before
-- the client-side upsert in signup.tsx has run (or if it failed silently).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop if exists so this script is safe to re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: create profiles for any existing auth users who have none
insert into public.profiles (id)
select id from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;
