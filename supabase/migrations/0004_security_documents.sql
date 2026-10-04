-- Godseye knowledge documents + abuse limits on the public write paths.
-- Run in the Supabase SQL editor after 0003.

-- ───────────────────────── Godseye documents ─────────────────────────
create table if not exists public.godseye_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null default 'pdf' check (kind in ('pdf','text','markdown')),
  storage_path text,
  content text not null default '',
  chars int not null default 0,
  enabled boolean not null default true,
  status text not null default 'pending' check (status in ('pending','ready','failed')),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.godseye_documents enable row level security;
drop policy if exists "admins manage godseye documents" on public.godseye_documents;
create policy "admins manage godseye documents" on public.godseye_documents for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop trigger if exists godseye_documents_touch on public.godseye_documents;
create trigger godseye_documents_touch before update on public.godseye_documents for each row execute function public.touch_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('godseye-docs', 'godseye-docs', false, 15728640, array['application/pdf','text/plain','text/markdown'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "admins manage godseye docs files" on storage.objects;
create policy "admins manage godseye docs files" on storage.objects for all to authenticated
  using (bucket_id = 'godseye-docs' and public.is_admin()) with check (bucket_id = 'godseye-docs' and public.is_admin());

-- ───────────────────────── Abuse limits ─────────────────────────
-- Events: at most 240 per session per minute (a human produces a handful).
create or replace function public.events_rate_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.events where session_id = new.session_id and ts > now() - interval '1 minute') >= 240 then
    raise exception 'rate limit' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists events_rate_limit on public.events;
create trigger events_rate_limit before insert on public.events for each row execute function public.events_rate_limit();

-- Applications: one email may apply at most 3 times per role and 10 times per day overall; resume path must match the id.
alter table public.applications add column if not exists screen_attempts int not null default 0;
create or replace function public.applications_rate_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.applications where lower(email) = lower(new.email) and job_id = new.job_id) >= 3 then
    raise exception 'You have already applied for this role.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.applications where lower(email) = lower(new.email) and created_at > now() - interval '1 day') >= 10 then
    raise exception 'Too many applications from this email today.' using errcode = 'P0001';
  end if;
  if new.resume_path is not null and new.resume_path <> ('applications/' || new.job_id::text || '/' || new.id::text || '.pdf') then
    raise exception 'Invalid resume path.' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists applications_rate_limit on public.applications;
create trigger applications_rate_limit before insert on public.applications for each row execute function public.applications_rate_limit();

-- Resume uploads must follow the exact path shape.
drop policy if exists "public uploads resumes" on storage.objects;
create policy "public uploads resumes" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'resumes' and name ~ '^applications/[0-9a-f-]{36}/[0-9a-f-]{36}\.pdf$');

-- Anonymous callers never read these tables directly.
revoke select on public.applications from anon;
revoke select on public.events from anon;
revoke all on public.godseye_settings from anon;
revoke all on public.godseye_conversations from anon;
revoke all on public.godseye_documents from anon;
revoke all on public.admins from anon;

-- ───────────────────────── Phone screening interviews ─────────────────────────
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','initiating','ringing','in_progress','completed','failed','no_answer')),
  provider text not null default 'sarvam',
  call_sid text,
  transcript jsonb not null default '[]'::jsonb,   -- [{role:'ai'|'candidate', text, ts}]
  summary text,
  score numeric(5,2),
  duration_seconds int,
  error text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz
);
create index if not exists interviews_app_idx on public.interviews (application_id, created_at desc);
alter table public.interviews enable row level security;
drop policy if exists "admins read interviews" on public.interviews;
create policy "admins read interviews" on public.interviews for select to authenticated using (public.is_admin());
revoke all on public.interviews from anon;
