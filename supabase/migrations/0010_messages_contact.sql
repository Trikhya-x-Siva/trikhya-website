-- Contact messages are stored, not dropped. Roles closed. Contact address is connect@trikhya.ai.
-- Safe to run more than once. Run after 0009.

-- ───────────────────────── Messages from the Contact page ─────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  session_id text,
  status text not null default 'new' check (status in ('new','replied','archived')),
  notes text
);
create index if not exists messages_ts_idx on public.messages (ts desc);
alter table public.messages enable row level security;

-- The website may insert a well-formed message. It can never read, change or delete one.
drop policy if exists "site sends messages" on public.messages;
create policy "site sends messages" on public.messages for insert to anon, authenticated
  with check (
    length(name) between 2 and 120
    and length(email) between 5 and 200
    and coalesce(length(company), 0) <= 200
    and length(message) between 10 and 4000
    and coalesce(length(session_id), 0) <= 64
  );
revoke all on public.messages from anon, authenticated;
grant insert (name, email, company, message, session_id) on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;

drop policy if exists "admins read messages" on public.messages;
create policy "admins read messages" on public.messages for select to authenticated using (public.is_admin());
drop policy if exists "admins update messages" on public.messages;
create policy "admins update messages" on public.messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete messages" on public.messages;
create policy "admins delete messages" on public.messages for delete to authenticated using (public.is_admin());

-- Server-owned columns are forced clean; the address is normalised and must look like one.
create or replace function public.messages_clean_insert() returns trigger language plpgsql as $$
begin
  new.status := 'new'; new.notes := null; new.ts := now();
  new.email := lower(trim(new.email)); new.name := trim(new.name); new.message := trim(new.message);
  if new.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Invalid email.' using errcode = 'P0001'; end if;
  if (select count(*) from public.messages where email = new.email and ts > now() - interval '1 day') >= 5 then
    raise exception 'Too many messages from this address today.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.messages where ts > now() - interval '1 day') >= 200 then
    raise exception 'The form is paused for today. Please email us instead.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function public.messages_clean_insert() from public, anon, authenticated;
drop trigger if exists messages_clean_insert on public.messages;
create trigger messages_clean_insert before insert on public.messages for each row execute function public.messages_clean_insert();

-- ───────────────────────── Roles ─────────────────────────
-- Nothing is open at the moment. Rows are kept (closed), so applications and history stay readable.
update public.jobs set status = 'closed' where status = 'open';

-- ───────────────────────── Assistant knowledge ─────────────────────────
update public.godseye_settings set
  knowledge = replace(replace(knowledge,
    'Careers: open roles are listed on the Careers page (AI Engineer, Forward-Deployed Engineer, Data Engineer, Product Designer at the time of writing). Applications are made through the role''s Apply button on the site.',
    'Careers: there are no open roles at the moment. Anyone interested in working at Trikhya can write to connect@trikhya.ai.'),
    'Contact: the Contact page form.',
    'Contact: the Contact page form, or connect@trikhya.ai.'),
  handoff = 'For anything that needs a person, use the Contact page or write to connect@trikhya.ai; the team replies within two working days.'
where id = 1;
