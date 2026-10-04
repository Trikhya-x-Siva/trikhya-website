# Security model

How the Trikhya website, the admin dashboard and the data behind them are protected, and what still
depends on account settings outside this repository.

## Surfaces

| Surface | Where it runs | Who can reach it |
|---|---|---|
| Public website | Static files on GitHub Pages | Everyone |
| Admin dashboard (`/admin/`) | Same static build, data loaded in the browser | Anyone can load the page; nothing is shown without a signed-in admin |
| Database, file storage, auth | Supabase | Through the publishable key under row-level security, or a signed-in admin |
| Server functions | Supabase Edge Functions | Browser calls from allowed origins only |

## Keys and secrets

- The browser holds only the **publishable** Supabase key. It is designed to be public; every table it can touch is governed by row-level security (RLS).
- The **service role key**, the **Anthropic key**, the **Sarvam key** and the interview bridge secret exist only as Supabase function secrets. They are never in the repository, the build or the browser.
- `.env.local` is git-ignored. The GitHub Pages build receives only the two public values.

## What the public key can do

| Table / bucket | Anonymous visitor | Signed-in admin |
|---|---|---|
| `events` | insert only, well-formed rows, max 240 per session per minute | read |
| `jobs` | read rows with status `open` | everything |
| `applications` | insert only the candidate columns, to an open role, max 3 per email per role and 10 per email per day, resume path must match the row id; status and screening fields are forced clean by a trigger | read, update, delete |
| `resumes` bucket | upload one PDF under `applications/<job>/<id>.pdf`, 10 MB max | read via signed URL, delete |
| `admins` | nothing | read, remove (not self); adding happens only through the invite function |
| `godseye_settings`, `godseye_conversations`, `godseye_documents`, `interviews`, `godseye-docs` bucket | nothing | everything |

Admin status is decided by one function, `is_admin()`, which checks the signed-in email against the `admins` table. Every admin policy and server function uses it.

## Server functions

- `screen-application`: takes an application id, runs only on rows in `new` or `failed`, at most four attempts per application. Reads the resume with the service role and calls Claude.
- `godseye`: enforces the daily cap and the per-visitor turn limit, treats the knowledge and documents as data, and asks the model for a strict JSON verdict so an out-of-scope question always gets the fixed refusal.
- `ingest-document`, `start-interview`, `invite-admin`: verify the caller's session token is an admin before doing anything. Re-running `screen-application` on anything but a fresh application also requires an admin.
- There is no public sign-up. Admins are added by an existing admin generating a one-time invite link; the allow-list cannot be claimed from outside.
- All four reject browser requests whose `Origin` is not on the allow-list (`ALLOWED_ORIGINS` secret; defaults to the GitHub Pages site, trikhya.ai and localhost).

## Browser hardening

- A Content-Security-Policy meta tag restricts scripts to the site, styles to the site and Google Fonts, connections to Supabase, and frames to none.
- The admin page is `noindex`, hidden from the site's header, footer and tracking.
- The apply form carries a honeypot field; submissions that fill it are dropped client-side.
- Analytics are anonymous by default; a returning-visitor id is set only after consent.

## Settings to keep switched on in Supabase (dashboard, not code)

1. Authentication → Sign In / Providers: **Allow new users to sign up: OFF** (admins arrive only through invite links). Email provider: **minimum password length 10**, **leaked-password protection on**.
1a. Authentication → URL Configuration: add every site origin (`http://localhost:3000`, the Vercel URL, the GitHub Pages URL, `https://trikhya.ai`) to **Redirect URLs** so invite links can land on the admin page.
2. Authentication → Rate limits: keep the defaults.
3. Project Settings → API: rotate any key that has ever been pasted into a chat or a ticket.
4. Storage: both buckets stay **private**.

## Known limits

- GitHub Pages cannot send HTTP security headers, so the CSP is a meta tag and `frame-ancestors` cannot be enforced there. Moving the site to a host that sets headers would close that gap.
- Origin checks stop casual abuse of the functions, not a determined attacker; the caps and attempt limits bound the cost of abuse.
- Admin sign-in is email plus password. Enable MFA in Supabase Auth when the team grows.
