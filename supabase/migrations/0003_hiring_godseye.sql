-- Hiring (roles, applications, resumes) and Godseye management.
-- Run in the Supabase SQL editor after 0001 and 0002.

-- ───────────────────────── Roles ─────────────────────────
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  team text not null default 'Engineering',
  location text not null default '',
  type text not null default 'Full-time',
  experience text not null default '',
  level int not null default 2,
  posted date not null default current_date,
  summary text not null default '',
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  nice_to_have text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','open','closed','archived')),
  criteria jsonb not null default '{"min_education":null,"min_experience_years":0,"required_languages":[],"must_have_skills":[],"good_to_have_skills":[]}'::jsonb,
  form jsonb not null default '{}'::jsonb,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.jobs enable row level security;

drop policy if exists "public reads open jobs" on public.jobs;
create policy "public reads open jobs" on public.jobs for select to anon, authenticated using (status = 'open' or public.is_admin());
drop policy if exists "admins write jobs" on public.jobs;
create policy "admins write jobs" on public.jobs for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists jobs_touch on public.jobs;
create trigger jobs_touch before update on public.jobs for each row execute function public.touch_updated_at();

-- ───────────────────────── Applications ─────────────────────────
create table if not exists public.applications (
  id uuid primary key,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  candidate_name text not null,
  email text not null,
  phone text,
  answers jsonb not null default '{}'::jsonb,
  resume_path text,
  status text not null default 'new' check (status in ('new','screening','screened','shortlisted','rejected','failed')),
  parsed jsonb,
  score numeric(5,2),
  breakdown jsonb,
  rationale text,
  must_have_pass boolean,
  screened_at timestamptz,
  screen_error text,
  notes text,
  session_id text
);
create index if not exists applications_job_idx on public.applications (job_id, created_at desc);
alter table public.applications enable row level security;

-- The website may submit an application to an open role. Nothing else.
drop policy if exists "public applies" on public.applications;
create policy "public applies" on public.applications for insert to anon, authenticated
  with check (
    exists (select 1 from public.jobs j where j.id = job_id and j.status = 'open')
    and length(candidate_name) between 2 and 120
    and length(email) between 5 and 200
    and pg_column_size(answers) < 20000
  );
drop policy if exists "admins read applications" on public.applications;
create policy "admins read applications" on public.applications for select to authenticated using (public.is_admin());
drop policy if exists "admins update applications" on public.applications;
create policy "admins update applications" on public.applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete applications" on public.applications;
create policy "admins delete applications" on public.applications for delete to authenticated using (public.is_admin());

-- Count applications per role without exposing rows.
create or replace function public.application_counts()
returns table (job_id uuid, total bigint, shortlisted bigint, new_count bigint)
language sql stable security definer set search_path = public as $$
  select job_id, count(*), count(*) filter (where status = 'shortlisted'), count(*) filter (where status in ('new','screening','screened'))
  from public.applications where public.is_admin() group by job_id;
$$;
grant execute on function public.application_counts() to authenticated;

-- ───────────────────────── Resume storage ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 10485760, array['application/pdf'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public uploads resumes" on storage.objects;
create policy "public uploads resumes" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'resumes' and name like 'applications/%');
drop policy if exists "admins read resumes" on storage.objects;
create policy "admins read resumes" on storage.objects for select to authenticated
  using (bucket_id = 'resumes' and public.is_admin());
drop policy if exists "admins delete resumes" on storage.objects;
create policy "admins delete resumes" on storage.objects for delete to authenticated
  using (bucket_id = 'resumes' and public.is_admin());

-- ───────────────────────── Godseye ─────────────────────────
create table if not exists public.godseye_settings (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default false,
  provider text not null default 'sarvam',
  model text not null default 'sarvam-m',
  knowledge text not null default '',
  refusal text not null default 'That is outside what I cover. I only answer questions about Trikhya Intelligence Foundry. An assistant like this, scoped to your own business and data, is exactly what we build.',
  handoff text not null default 'For anything that needs a person, use the Contact page and the team will reply within two working days.',
  starter_questions text[] not null default array['What does Trikhya do?','What have you built?','How does an engagement work?','Are you hiring?'],
  daily_cap int not null default 300,
  max_turns int not null default 12,
  updated_at timestamptz not null default now()
);
alter table public.godseye_settings enable row level security;
drop policy if exists "admins manage godseye settings" on public.godseye_settings;
create policy "admins manage godseye settings" on public.godseye_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop trigger if exists godseye_settings_touch on public.godseye_settings;
create trigger godseye_settings_touch before update on public.godseye_settings for each row execute function public.touch_updated_at();

create table if not exists public.godseye_conversations (
  id bigint generated always as identity primary key,
  ts timestamptz not null default now(),
  session_id text not null,
  path text,
  question text not null,
  answer text not null,
  in_scope boolean not null default true,
  latency_ms int,
  model text,
  flagged boolean not null default false,
  flag_note text
);
create index if not exists godseye_conversations_ts_idx on public.godseye_conversations (ts desc);
alter table public.godseye_conversations enable row level security;
drop policy if exists "admins read conversations" on public.godseye_conversations;
create policy "admins read conversations" on public.godseye_conversations for select to authenticated using (public.is_admin());
drop policy if exists "admins flag conversations" on public.godseye_conversations;
create policy "admins flag conversations" on public.godseye_conversations for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public, read-only view of the bits the widget needs (no knowledge text, no caps).
create or replace function public.godseye_public()
returns table (enabled boolean, starter_questions text[], handoff text)
language sql stable security definer set search_path = public as $$
  select enabled, starter_questions, handoff from public.godseye_settings where id = 1;
$$;
grant execute on function public.godseye_public() to anon, authenticated;

-- ───────────────────────── Seed ─────────────────────────
insert into public.godseye_settings (id, knowledge) values (1, $K$
Trikhya Intelligence Foundry is an AI engineering company based in Chennai, India.

Positioning: we build AI that works inside real businesses, with a Human-AI-Human approach: a person asks, the system does the tedious, checkable middle, and a person decides. B-AI-B means AI for internal teams; B-AI-C means AI in front of customers.

Services: AI strategy and discovery; data foundations and systems integration; AI engineering (assistants, agents, natural-language analytics, computer vision, voice and multilingual AI, workflow automation, predictive models); deployment and operations with evaluation and guardrails.

Engagement model: discover (weeks 0 to 2), prototype on real data (weeks 2 to 6), deploy (weeks 6 to 18), then evolve.

In production: the Natural Language Query Assistant, built for a multi-plant insole manufacturer. Plant staff ask about orders, materials and finance in English, Tamil or Hindi, by text or voice. The assistant writes a read-only SQL query against a governed warehouse that joins three live systems (ERP, warehouse system, order management), a second model validates the result, and the answer streams back with a chart and its sources. Accuracy: 92.4% of questions answered correctly end to end. Also built for the same client: WhatsApp alerts with acknowledge and resolve, role dashboards, hourly incremental data ingest, and a tracing and evaluation harness that runs on every release. Never name the client.

Insights published: human-AI-human versus autonomous AI; getting correct answers from messy business data (definitions, not SQL, cause most errors); pilot to daily use; choosing a first AI use case; evaluating AI before users; voice and multilingual streaming.

Careers: open roles are listed on the Careers page (AI Engineer, Forward-Deployed Engineer, Data Engineer, Product Designer at the time of writing). Applications are made through the role's Apply button on the site.

Contact: the Contact page form. LinkedIn: linkedin.com/company/trikhya-intelligence-foundry.
$K$) on conflict (id) do nothing;

-- The first four roles, from content/jobs.ts, with the default form.
insert into public.jobs (slug, title, team, location, type, experience, level, posted, summary, responsibilities, requirements, nice_to_have, status, criteria, form) values
('ai-engineer','AI Engineer','Engineering','Chennai, India · Hybrid','Full-time','3–6 years',2,'2026-09-28',
 'Build the intelligence layer of production systems: retrieval, generation, validation and evaluation over real business data.',
 array['Design and ship staged LLM pipelines with predictable cost, guardrails and a validator in the loop.','Write and maintain the evaluation harness that runs on every release, and own the accuracy number it reports.','Work with the data team on glossaries, metric definitions and the join registry the models read from.','Trace, read and fix real failures from production conversations every week.'],
 array['Strong Python and SQL, with production experience behind an API.','Hands-on with at least one LLM provider in a shipped product, including prompt design and structured outputs.','Comfort reading messy enterprise data and asking the people who own it what it means.','Clear written English; you will document decisions for clients.'],
 array['Vector search (pgvector or similar)','Observability tooling such as Langfuse or OpenTelemetry','Tamil or Hindi'],
 'open', '{"min_education":"Bachelor''s","min_experience_years":3,"required_languages":["English"],"must_have_skills":["Python","SQL","LLM"],"good_to_have_skills":["pgvector","Langfuse","FastAPI","PostgreSQL"]}'::jsonb, '{}'::jsonb),
('forward-deployed-engineer','Forward-Deployed Engineer','Delivery','Chennai, India · On site with clients','Full-time','4–8 years',3,'2026-09-21',
 'Sit with the client, frame the problem, and carry a system from discovery through rollout until it is part of how they work.',
 array['Run discovery: interviews, data review and the shortlist of problems worth solving.','Prototype on the client''s real data within weeks and put it in front of the people who will use it.','Own integration with ERPs, warehouses and messaging channels, and the rollout plan behind it.','Translate between plant managers, finance and engineers without losing meaning in either direction.'],
 array['Shipped software inside at least one enterprise rollout, ideally manufacturing, logistics or finance.','Fluent with APIs, SQL and at least one backend language; you can build, not only coordinate.','Comfortable presenting to leadership and standing on a plant floor in the same week.','Willing to travel to client sites.'],
 array['ERP or WMS integration experience','Change-management or training experience','Tamil or Hindi'],
 'open', '{"min_education":"Bachelor''s","min_experience_years":4,"required_languages":["English"],"must_have_skills":["SQL","APIs","Python"],"good_to_have_skills":["ERP","Manufacturing","Change management"]}'::jsonb, '{}'::jsonb),
('data-engineer','Data Engineer','Engineering','Chennai, India · Hybrid','Full-time','2–5 years',2,'2026-09-14',
 'Build and run the governed warehouse the assistants reason over: ingest, layered models, metadata and quality checks.',
 array['Build incremental ingest from source systems such as ERPs, warehouse systems and order management.','Model bronze, silver and gold layers that are correct, documented and fast enough to query interactively.','Maintain the metadata catalogue, glossary and join registry that the AI layer depends on.','Write the deploy gates that refuse to ship when the catalogue or glossary is incomplete.'],
 array['Strong SQL and PostgreSQL in production, including performance work.','Python for pipelines, with tests.','Experience with incremental loads, watermarks and schema change in the wild.','Care for naming, documentation and definitions.'],
 array['Cloud SQL or managed Postgres on GCP','dbt or similar modelling tools','Experience with SQL Server sources'],
 'open', '{"min_education":"Bachelor''s","min_experience_years":2,"required_languages":["English"],"must_have_skills":["SQL","PostgreSQL","Python"],"good_to_have_skills":["dbt","GCP","SQL Server"]}'::jsonb, '{}'::jsonb),
('product-designer','Product Designer','Product','Remote · India','Full-time','3–7 years',2,'2026-09-07',
 'Design the surfaces people actually use: chat and voice assistants, role dashboards and alerts that land on a phone during a shift.',
 array['Design interfaces for plant supervisors, managers and country heads, each with different time and attention.','Make answers trustworthy on screen: sources, confidence, and what to do next.','Prototype quickly, test with real users on site, and ship with engineers in the same sprint.','Own the design system across web, WhatsApp and voice touch-points.'],
 array['A portfolio of shipped B2B or operational products, not only concepts.','Fluency in Figma and in handing off to React engineers.','Evidence of user research with non-technical users.','Strong typography and information design.'],
 array['Data visualisation','Conversational or voice UI','Motion design'],
 'open', '{"min_education":null,"min_experience_years":3,"required_languages":["English"],"must_have_skills":["Figma","User research"],"good_to_have_skills":["Data visualisation","Motion design","React"]}'::jsonb, '{}'::jsonb)
on conflict (slug) do nothing;
