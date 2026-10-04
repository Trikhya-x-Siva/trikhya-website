-- Hardening pass. Run in the Supabase SQL editor after 0005.

-- 1. The public may only set the candidate-supplied columns of an application. Screening fields,
--    status and notes are server-owned. Column grants plus a trigger that resets them on every insert.
revoke insert on public.applications from anon, authenticated;
grant insert (id, job_id, candidate_name, email, phone, answers, resume_path, session_id) on public.applications to anon, authenticated;

create or replace function public.applications_clean_insert() returns trigger language plpgsql as $$
begin
  new.status := 'new'; new.score := null; new.parsed := null; new.breakdown := null; new.rationale := null;
  new.must_have_pass := null; new.screened_at := null; new.screen_error := null; new.notes := null; new.screen_attempts := 0;
  new.created_at := now();
  new.email := lower(trim(new.email)); new.candidate_name := trim(new.candidate_name);
  if new.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Invalid email.' using errcode = 'P0001'; end if;
  return new;
end $$;
drop trigger if exists applications_clean_insert on public.applications;
create trigger applications_clean_insert before insert on public.applications for each row execute function public.applications_clean_insert();

-- 2. Events: the public sets only what the tracker sends; never the timestamp or id.
revoke insert on public.events from anon, authenticated;
grant insert (session_id, visitor_id, name, path, title, referrer, props, lang, screen_w, ua) on public.events to anon, authenticated;

-- 3. No anonymous allow-list probing. Admins are invited with a link from the dashboard instead.
revoke execute on function public.is_allowlisted(text) from anon;

-- 4. Admins may read the table only; adds happen through the invite function (service role),
--    so an admin email is always paired with a real auth user.
drop policy if exists "admins insert admins" on public.admins;

-- 5. Jobs: the public reads only the columns the careers page needs (never internal criteria/questions
--    are harmless, but keep the surface explicit).
revoke select on public.jobs from anon;
grant select (id, slug, title, team, location, type, experience, level, posted, summary, responsibilities, requirements, nice_to_have, status, form, questions) on public.jobs to anon;
