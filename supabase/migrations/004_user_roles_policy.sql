-- Allow users to read their own roles
create policy "Users read own roles" on public.user_roles
  for select using (auth.uid() = user_id);