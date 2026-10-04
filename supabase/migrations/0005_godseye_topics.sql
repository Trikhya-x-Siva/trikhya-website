-- Topic tag on every Godseye conversation, so the dashboard can show what visitors ask about.
alter table public.godseye_conversations add column if not exists topic text;
create index if not exists godseye_conversations_topic_idx on public.godseye_conversations (topic);
