-- Hardening pass for the move to Vercel. Safe to run more than once. Run in the Supabase SQL editor after 0008.

-- ───────────────────────── 1. Admin check ─────────────────────────
-- is_admin() now reads the account itself instead of trusting claims in the token: the address must be on the
-- allow-list AND the account's email must be confirmed. (The token's user_metadata.email_verified is editable
-- by the user, so it is never consulted.) Public sign-up stays off in the dashboard as well.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from auth.users u
    join public.admins a on lower(a.email) = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;

-- Accounts already on the allow-list were created by us (dashboard or invite). Make sure none is locked out
-- because it was added before confirmation was recorded.
update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now())
where lower(email) in (select lower(email) from public.admins);

-- ───────────────────────── 2. Resume uploads ─────────────────────────
-- A PDF may only be uploaded for an application that was just submitted with that exact path.
-- The form inserts the row first, then uploads; nobody can fill the bucket without applying.
drop policy if exists "public uploads resumes" on storage.objects;
create policy "public uploads resumes" on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'resumes'
    and name ~ '^applications/[0-9a-f-]{36}/[0-9a-f-]{36}\.pdf$'
    and exists (
      select 1 from public.applications a
      where a.resume_path = name and a.created_at > now() - interval '15 minutes'
    )
  );

-- ───────────────────────── 3. Ask Trikhya ─────────────────────────
-- A hashed caller address on every exchange, so the per-visitor limit cannot be reset by choosing a new
-- session id. The hash is salted on the server and never reversible.
alter table public.godseye_conversations add column if not exists caller text;
create index if not exists godseye_conversations_caller_ts_idx on public.godseye_conversations (caller, ts desc);

-- ───────────────────────── 4. Events: bounded columns, global flood cap ─────────────────────────
-- The per-session limit is easy to sidestep with a new session id each time, and several text columns had
-- no size limit at all. Every column is now bounded and the whole table takes at most 3000 rows a minute.
drop policy if exists "site inserts events" on public.events;
create policy "site inserts events" on public.events for insert to anon, authenticated
  with check (
    length(session_id) between 8 and 64
    and length(name) between 2 and 40
    and length(path) between 1 and 300
    and coalesce(length(visitor_id), 0) <= 64
    and coalesce(length(title), 0) <= 200
    and coalesce(length(referrer), 0) <= 300
    and coalesce(length(lang), 0) <= 35
    and coalesce(length(ua), 0) <= 200
    and coalesce(screen_w, 0) between 0 and 20000
    and pg_column_size(props) < 4000
  );

create or replace function public.events_rate_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.events where session_id = new.session_id and ts > now() - interval '1 minute') >= 240 then
    raise exception 'rate limit' using errcode = 'P0001';
  end if;
  if (select count(*) from public.events where ts > now() - interval '1 minute') >= 3000 then
    raise exception 'rate limit' using errcode = 'P0001';
  end if;
  return new;
end $$;

-- ───────────────────────── 5. Applications: bounded phone, global daily cap ─────────────────────────
-- Each application costs a model call, and the per-email limit means nothing to a bot inventing addresses.
create or replace function public.applications_rate_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.applications where lower(email) = lower(new.email) and job_id = new.job_id) >= 3 then
    raise exception 'You have already applied for this role.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.applications where lower(email) = lower(new.email) and created_at > now() - interval '1 day') >= 10 then
    raise exception 'Too many applications from this email today.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.applications where created_at > now() - interval '1 day') >= 300 then
    raise exception 'Applications are paused for today. Please email your CV instead.' using errcode = 'P0001';
  end if;
  if new.resume_path is not null and new.resume_path <> ('applications/' || new.job_id::text || '/' || new.id::text || '.pdf') then
    raise exception 'Invalid resume path.' using errcode = 'P0001';
  end if;
  if coalesce(length(new.phone), 0) > 40 or coalesce(length(new.session_id), 0) > 64 then
    raise exception 'Invalid application.' using errcode = 'P0001';
  end if;
  return new;
end $$;
