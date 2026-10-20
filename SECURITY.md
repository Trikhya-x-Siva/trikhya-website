# Security model

How the Trikhya website, the admin dashboard and the data behind them are protected, and what still
depends on account settings outside this repository.

## Surfaces

| Surface | Where it runs | Who can reach it |
|---|---|---|
| Public website | Static files on Vercel (`https://www.trikhya.ai`) | Everyone |
| Admin dashboard (`/admin/`) | Same static build, data loaded in the browser | Anyone can load the page; nothing is shown without a signed-in, verified admin |
| Database, file storage, auth | Supabase | Through the publishable key under row-level security, or a signed-in admin |
| Server functions | Supabase Edge Functions | Browser calls from allowed origins only |

## Keys and secrets

- The browser holds only the **publishable** Supabase key. It is designed to be public; every table it can touch is governed by row-level security (RLS).
- The **service role key**, the **Anthropic key**, the **Sarvam key**, the interview bridge secret and the `IP_HASH_SALT` exist only as Supabase function secrets. They are never in the repository, the build or the browser.
- `.env.local` is git-ignored. The Vercel build receives only the two public values (and they have safe defaults in `lib/supabase.ts`).

## What the public key can do

| Table / bucket | Anonymous visitor | Signed-in admin |
|---|---|---|
| `events` | insert only, every column bounded, max 240 per session per minute and 3000 per minute overall | read |
| `jobs` | read the public columns of rows with status `open` | everything |
| `applications` | insert only the candidate columns, to an open role, max 3 per email per role, 10 per email per day and 300 per day overall, resume path must match the row id; status and screening fields are forced clean by a trigger | read, update, delete |
| `resumes` bucket | upload one PDF under `applications/<job>/<id>.pdf`, 10 MB max, and only within 15 minutes of an application that names that path | read via signed URL, delete |
| `admins` | nothing | read, remove (not self); adding happens only through the invite function |
| `godseye_settings`, `godseye_conversations`, `godseye_documents`, `interviews`, `godseye-docs` bucket | nothing | everything |

Admin status is decided by one function, `is_admin()`, which looks up the signed-in account in `auth.users` and requires a confirmed email that is on the `admins` table. It never trusts claims inside the token. Every admin policy and server function uses it.

## Server functions

- `screen-application`: takes an application id, runs only on rows in `new` or `failed`, at most four attempts per application, and at most `SCREEN_DAILY_CAP` (default 100) automatic runs a day; beyond that, applications wait as `new` for an admin. Reads the resume with the service role and calls Claude. Provider error text is shown to admins only.
- `ask-trikhya`: enforces the daily cap, the per-session turn limit and a per-network-address daily limit (a salted hash, never the address itself), rebuilds the conversation history from its own log rather than trusting turns sent by the browser, treats the knowledge and documents as data, and asks the model for a strict JSON verdict so an out-of-scope question always gets the fixed refusal.
- `ingest-document`, `start-interview`, `invite-admin`: verify the caller's session token is an admin before doing anything. Re-running `screen-application` on anything but a fresh application also requires an admin.
- There is no public sign-up. Admins are added by an existing admin generating a one-time invite link; the allow-list cannot be claimed from outside.
- All functions reject requests whose `Origin` is missing or not on the allow-list. The default list is `https://trikhya.ai`, `https://www.trikhya.ai` and `http://localhost:3000`; set the `ALLOWED_ORIGINS` secret (comma-separated) to add the project's own `*.vercel.app` preview hostname. Never add a wildcard: anyone can deploy to `vercel.app`.

## Browser hardening

- `vercel.json` sends the security headers: a Content-Security-Policy (scripts from the site only, styles from the site and Google Fonts, connections to this project's Supabase host only, `frame-ancestors 'none'`), HSTS, `nosniff`, `X-Frame-Options`, a referrer policy and a permissions policy. `'unsafe-inline'` for scripts remains because a static Next.js export inlines its hydration data.
- The admin page is `noindex`, hidden from the site's header, footer and tracking.
- The apply form carries a honeypot field; submissions that fill it are dropped client-side. Applications are only accepted against roles loaded from the database, never the built-in fallback list.
- Analytics are anonymous by default; a returning-visitor id is set only after consent.

## Settings to keep switched on in Supabase (dashboard, not code)

1. Authentication → Sign In / Providers: **Allow new users to sign up: OFF** (admins arrive only through invite links). Email provider: **minimum password length 10**, **leaked-password protection on**, **confirm email on**.
2. Authentication → URL Configuration: Site URL `https://www.trikhya.ai`; add `https://www.trikhya.ai/admin/`, `https://trikhya.ai/admin/`, the Vercel preview URL and `http://localhost:3000/admin/` to **Redirect URLs** so invite links can land on the admin page.
3. Authentication → Rate limits: keep the defaults.
4. Edge Functions → Secrets: `ANTHROPIC_API_KEY`, `SARVAM_API_KEY`, `IP_HASH_SALT` (any long random string), optionally `ALLOWED_ORIGINS`, `INTERVIEW_BRIDGE_URL`, `INTERVIEW_SHARED_SECRET`.
5. Project Settings → API: rotate any key that has ever been pasted into a chat or a ticket.
6. Storage: both buckets stay **private**.

## Things the model can see

- Whatever is in the Ask Trikhya knowledge text and in enabled documents can be drawn out by any visitor through conversation. Upload only material that may be public.
- A CV is read by a model. Text inside it can try to steer the summary; the score is computed mechanically from the extracted profile, and a person reads both.

## Dependencies

`npm audit` is clean for everything that ships to the browser. The remaining advisories are in the lint toolchain
(`eslint-config-next` → `fast-glob` → `braces`), which never runs in production; npm's suggested "fix" is a downgrade
to Next 14 and is not one. Re-run `npm audit --omit=dev` after upgrades.

## Known limits

- Origin checks stop casual abuse of the functions, not a determined attacker; the caps, attempt limits and per-address limits bound the cost of abuse.
- Admin sign-in is email plus password. Enable MFA in Supabase Auth when the team grows.
- An application whose resume upload fails after the row is inserted stays as `new` and screening reports "resume download failed"; the candidate is told to email the CV with a short reference.
