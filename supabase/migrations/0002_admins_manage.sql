-- Admins may add and remove other admins from the dashboard.
-- Run in the Supabase SQL editor after 0001.

drop policy if exists "admins insert admins" on public.admins;
create policy "admins insert admins" on public.admins for insert to authenticated with check (public.is_admin());

drop policy if exists "admins delete admins" on public.admins;
create policy "admins delete admins" on public.admins for delete to authenticated
  using (public.is_admin() and lower(email) <> lower(coalesce(auth.jwt() ->> 'email', '')));  -- cannot remove yourself

-- Lets the sign-in screen offer "Create account" only to allow-listed emails, without exposing the list.
create or replace function public.is_allowlisted(check_email text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where lower(a.email) = lower(check_email));
$$;
grant execute on function public.is_allowlisted(text) to anon, authenticated;
