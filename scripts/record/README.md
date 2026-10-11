# Solution recordings

Headless Chromium drives each product through a fixed path and records it. Output lands in `public/videos/<slug>.mp4`
plus a `.jpg` poster, which the site shows wherever that solution's `video` field points (see `content/solutions.ts`).
Client and product names are rewritten on the fly and logos hidden, so nothing proprietary is on film.

```bash
npm run record:nlq        # natural-language-query.mp4
npm run record:training   # ai-training.mp4
npm run record:hiring     # ai-hiring.mp4  (generates synthetic resumes first if missing)
```

## What has to be running

**NL-BI assistant** (repo `D:\Work\Ortholite\Ortholens-voice-toggle`), run fully local because the dev Cloud SQL
instance is stopped and the UAT one rejects the `.env` password:

```powershell
cd data_layer; docker compose up -d          # ortholite_store on 5433 (trikhya / changeme), DDL auto-loads
cd ..\app_layer; docker compose up -d        # ortholite_app on 5435
cd ..\data_layer; .\.venv-record\Scripts\python -m scripts.rebuild    # pulls Odoo + WMS + OMS into the store; slow
```

`data_layer\.env` is a copy of the one in `D:\Work\Ortholite\Ortholens\data_layer` (source-system connections).
The app database was built and seeded with `python -m app_layer.scripts.build`, then `seed_admin`, `seed_rbac`,
`seed_glossary`, `seed_joins_and_rules`, `seed_metadata`, `seed_join_edges --force` (the local DDL's check constraint
was widened to accept `concat` joins, which the authored registry uses) and `seed_few_shot` (Vertex embeddings on the
`ortholite-ai-uat` project; the dev project has billing disabled). Those scripts and the backend take the local
connection from environment variables, which win over `.env`:

```powershell
$env:PGHOST="127.0.0.1"; $env:PGPORT="5433"; $env:PGUSER="trikhya"; $env:PGPASSWORD="changeme"; $env:PGDATABASE="ortholite_store"
$env:DB_USER="trikhya"; $env:DB_PASSWORD="changeme"; $env:QUERY_DB_USER="trikhya"; $env:QUERY_DB_PASSWORD="changeme"
$env:APP_DB_HOST="127.0.0.1"; $env:APP_DB_PORT="5435"; $env:APP_DB_USER="trikhya"; $env:APP_DB_PASSWORD="changeme"; $env:APP_DB_NAME="ortholite_app"
$env:INSTANCE_CONNECTION_NAME=""; $env:VERTEXAI_PROJECT="ortholite-ai-uat"
.\.venv-record\Scripts\python -m uvicorn backend.main_local:app --port 8000
cd frontend; $env:BACKEND_API_URL="http://localhost:8000"; npx next dev -p 3100
```

Leave `NEXT_PUBLIC_API_URL` unset so API calls stay relative and go through the Next rewrite to the backend. (Setting
it to `/` from Git Bash gets rewritten to `C:/Program Files/Git/`, and the login then posts to a `file://` URL.)

The login used is `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` from that repo's `.env` (seeded as the admin).
A full-screen slate covers the sign-in, so the address never appears in the video. `.venv-record` is a local
virtualenv with the repo's pinned FastAPI; the global Python has a newer Starlette that the app cannot start on.

**Training platform + hiring module** (repo `D:\Work\Trikhya Internal\sparkminda-platform`, branch `minda_hiring_ai`):

```powershell
docker compose up -d                          # Postgres on 5434 (5433 is the NL-BI proxy)
cd backend;  npm run seed; npx ts-node src/index.ts   # API on 3001
cd frontend; npx next dev -p 3200
```

`backend/.env` points at `localhost:5434`, uses the Anthropic and Sarvam keys, and sets `FRONTEND_ORIGIN=http://localhost:3200`.
The Q&A and assessment services were switched from OpenAI to the Anthropic SDK in that checkout (uncommitted). Seeded
demo accounts: learner `rahul@…`, admin `pradnya@…`, password in `CLAUDE.md` there.

## Before pressing record

- Open each page the scenario visits once in a browser (or `curl` it). The dev servers compile a route on first
  visit, and that can take longer than the script waits, which shows up on film as a page stuck on "Loading…".
- If the NL-BI login hangs, the Google credentials behind the Cloud SQL proxy have expired:
  `gcloud auth application-default login`, then restart the proxy.
- Never pipe a dev server's output through `head`: once the line limit is reached the process blocks on its next
  write and the server hangs. Redirect to a log file instead.

## Changing a recording

Each scenario is one small file: `nlq.mjs`, `training.mjs`, `hiring.mjs`. Edit the question, the path, or the pauses and
re-run. `lib.mjs` holds the recorder and the brand scrubber; `sm.mjs` the shared training-platform login and API seeding.
Keep clips under about 60 seconds and 8 MB; anything bigger belongs in a storage bucket, with its URL in `video.src`.
