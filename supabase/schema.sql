-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  weight numeric,
  weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lbs')),
  body_type text check (body_type in ('ectomorph', 'mesomorph', 'endomorph')),
  goal text check (goal in ('fat_loss', 'muscle_gain', 'strength')),
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Users manage own profile" on profiles
  using (auth.uid() = id) with check (auth.uid() = id);

-- Exercises library
create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text not null check (muscle_group in ('chest','back','legs','shoulders','arms','abs')),
  image_url text,
  created_at timestamptz not null default now()
);

alter table exercises enable row level security;
create policy "Anyone can read exercises" on exercises for select using (true);

-- Gym groups
create table gym_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table gym_groups enable row level security;
create policy "Anyone can create groups" on gym_groups for insert with check (auth.uid() = created_by);

-- Gym group membership
create table gym_group_members (
  group_id uuid references gym_groups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table gym_group_members enable row level security;

-- Security definer function breaks RLS recursion on gym_group_members self-reference
create or replace function auth_user_group_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select group_id from gym_group_members where user_id = auth.uid()
$$;

create policy "Members can read memberships" on gym_group_members for select
  using (user_id = auth.uid() or group_id in (select auth_user_group_ids()));

-- gym_groups read policies (defined after gym_group_members so the reference resolves)
create policy "Members can read their groups" on gym_groups for select
  using (exists (
    select 1 from gym_group_members where group_id = id and user_id = auth.uid()
  ));
-- Non-members need to look up a group by invite_code before they can join
create policy "Authenticated users can find groups by invite code" on gym_groups for select
  using (auth.uid() is not null);
create policy "Users join groups" on gym_group_members for insert with check (user_id = auth.uid());
create policy "Users leave groups" on gym_group_members for delete using (user_id = auth.uid());

-- Workout sessions
create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  group_id uuid references gym_groups(id) on delete set null,
  goal text not null check (goal in ('fat_loss', 'muscle_gain', 'strength')),
  muscle_groups text[] not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table workout_sessions enable row level security;
create policy "Users manage own sessions" on workout_sessions
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Group members read sessions" on workout_sessions for select
  using (group_id is not null and exists (
    select 1 from gym_group_members where group_id = workout_sessions.group_id and user_id = auth.uid()
  ));

-- Workout exercises (exercises within a session)
create table workout_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references workout_sessions(id) on delete cascade not null,
  exercise_id uuid references exercises(id) not null,
  sets_total int not null,
  reps_per_set int not null,
  order_index int not null,
  created_at timestamptz not null default now()
);

alter table workout_exercises enable row level security;
create policy "Session owner manages workout exercises" on workout_exercises
  using (exists (select 1 from workout_sessions where id = session_id and user_id = auth.uid()))
  with check (exists (select 1 from workout_sessions where id = session_id and user_id = auth.uid()));
create policy "Group members read workout exercises" on workout_exercises for select
  using (exists (
    select 1 from workout_sessions ws
    join gym_group_members ggm on ggm.group_id = ws.group_id
    where ws.id = session_id and ggm.user_id = auth.uid()
  ));

-- Set completions (individual set tracking)
create table set_completions (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid references workout_exercises(id) on delete cascade not null,
  set_number int not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'skipped')),
  completed_at timestamptz,
  unique (workout_exercise_id, set_number)
);

alter table set_completions enable row level security;
create policy "Session owner manages set completions" on set_completions
  using (exists (
    select 1 from workout_exercises we
    join workout_sessions ws on ws.id = we.session_id
    where we.id = workout_exercise_id and ws.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from workout_exercises we
    join workout_sessions ws on ws.id = we.session_id
    where we.id = workout_exercise_id and ws.user_id = auth.uid()
  ));
create policy "Group members read set completions" on set_completions for select
  using (exists (
    select 1 from workout_exercises we
    join workout_sessions ws on ws.id = we.session_id
    join gym_group_members ggm on ggm.group_id = ws.group_id
    where we.id = workout_exercise_id and ggm.user_id = auth.uid()
  ));

-- Group chat messages
create table group_messages (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid references gym_groups(id) on delete cascade not null,
  sender_id  uuid references profiles(id) on delete cascade not null,
  content    text,
  type       text not null default 'text' check (type in ('text', 'poke')),
  created_at timestamptz not null default now()
);

alter table group_messages enable row level security;

create policy "Group members can read messages" on group_messages for select
  using (
    exists (
      select 1 from gym_group_members
      where group_id = group_messages.group_id
        and user_id = auth.uid()
    )
  );

create policy "Group members can send messages" on group_messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from gym_group_members
      where group_id = group_messages.group_id
        and user_id = auth.uid()
    )
  );

-- Enable realtime for live progress syncing
alter publication supabase_realtime add table set_completions;
alter publication supabase_realtime add table workout_sessions;
alter publication supabase_realtime add table group_messages;
