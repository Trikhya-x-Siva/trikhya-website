-- Trikhya website analytics + admin allow-list.
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).

create extension if not exists pgcrypto;

-- Who may open /admin/. Add teammates by email.
create table if not exists public.admins (
  email text primary key,
  added_at timestamptz not null default now()
);
insert into public.admins (email) values ('developer.siva@trikhya.ai'), ('siva.trikhya@gmail.com') on conflict do nothing;

-- One row per interaction. Written anonymously by the website, read only by admins.
create table if not exists public.events (
  id bigint generated always as identity primary key,
  ts timestamptz not null default now(),
  session_id text not null,          -- per browser tab session (sessionStorage)
  visitor_id text,                   -- only set after cookie "Accept" (localStorage)
  name text not null,                -- page_view, page_leave, click, job_open, ...
  path text not null,
  title text,
  referrer text,
  props jsonb not null default '{}'::jsonb,
  lang text,
  screen_w int,
  ua text
);
create index if not exists events_ts_idx on public.events (ts desc);
create index if not exists events_name_ts_idx on public.events (name, ts desc);
create index if not exists events_path_ts_idx on public.events (path, ts desc);
create index if not exists events_session_idx on public.events (session_id);

alter table public.admins enable row level security;
alter table public.events enable row level security;

-- Helper: is the signed-in user on the allow-list?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- Admins may read the allow-list; nobody edits it from the client.
drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins for select to authenticated using (public.is_admin());

-- The website (anon key) may only insert events, and only well-formed ones.
drop policy if exists "site inserts events" on public.events;
create policy "site inserts events" on public.events for insert to anon, authenticated
  with check (
    length(session_id) between 8 and 64
    and length(name) between 2 and 40
    and length(path) between 1 and 300
    and pg_column_size(props) < 4000
  );

-- Only admins may read events.
drop policy if exists "admins read events" on public.events;
create policy "admins read events" on public.events for select to authenticated using (public.is_admin());

-- Daily rollup used by the dashboard overview (cheap even with many rows).
create or replace function public.daily_stats(since timestamptz)
returns table (day date, sessions bigint, visitors bigint, views bigint)
language sql stable security definer set search_path = public as $$
  select date_trunc('day', ts)::date as day,
         count(distinct session_id) as sessions,
         count(distinct coalesce(visitor_id, session_id)) as visitors,
         count(*) filter (where name = 'page_view') as views
  from public.events
  where ts >= since and public.is_admin()
  group by 1 order by 1;
$$;

grant execute on function public.daily_stats(timestamptz) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
