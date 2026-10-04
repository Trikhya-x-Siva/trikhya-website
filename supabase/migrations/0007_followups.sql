-- Follow-ups from the live probe. Safe to run more than once. Run after 0004 and 0006.

-- The apply form depends on this column (added in 0004); repeat here so the public form never breaks on ordering.
alter table public.applications add column if not exists screen_attempts int not null default 0;

-- Postgres grants EXECUTE on new functions to PUBLIC by default, so revoking from anon alone is not enough.
-- The allow-list probe is no longer used by the site at all: remove it.
drop function if exists public.is_allowlisted(text);

-- Internal helpers: only signed-in users may call them (each also checks is_admin() inside).
revoke execute on function public.daily_stats(timestamptz) from public, anon;
revoke execute on function public.application_counts() from public, anon;
revoke execute on function public.events_rate_limit() from public, anon, authenticated;
revoke execute on function public.applications_rate_limit() from public, anon, authenticated;
revoke execute on function public.applications_clean_insert() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

-- Reads the public key must never have, repeated from 0004 in case that file was skipped.
revoke select on public.applications from anon;
revoke select on public.events from anon;
revoke all on public.godseye_settings from anon;
revoke all on public.godseye_conversations from anon;
revoke all on public.admins from anon;
