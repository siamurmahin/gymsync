-- Allow any authenticated user to read a group by invite_code
-- Required so non-members can look up a group before joining
create policy "Authenticated users can find groups by invite code" on gym_groups for select
  using (auth.uid() is not null);
