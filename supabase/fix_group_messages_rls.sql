-- Create group_messages table if it doesn't exist
create table if not exists group_messages (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid references gym_groups(id) on delete cascade not null,
  sender_id  uuid references profiles(id) on delete cascade not null,
  content    text,
  type       text not null default 'text' check (type in ('text', 'poke')),
  created_at timestamptz not null default now()
);

alter table group_messages enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Group members can read messages"  on group_messages;
drop policy if exists "Group members can send messages"  on group_messages;

-- Members can read messages in their groups
create policy "Group members can read messages" on group_messages for select
  using (
    exists (
      select 1 from gym_group_members
      where group_id = group_messages.group_id
        and user_id = auth.uid()
    )
  );

-- Members can insert messages as themselves
create policy "Group members can send messages" on group_messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from gym_group_members
      where group_id = group_messages.group_id
        and user_id = auth.uid()
    )
  );

-- Enable realtime for chat
alter publication supabase_realtime add table group_messages;
