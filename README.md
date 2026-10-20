# Trikhya Intelligence Foundry — website

The public site at [www.trikhya.ai](https://www.trikhya.ai), the admin dashboard at `/admin/`, and the Supabase schema and
functions behind them.

## Stack

- **Next.js 16** (App Router) exported as static files (`output: "export"`), hosted on **Vercel**.
- Pages are thin wrappers in `app/`; the UI lives in `components/`; copy and data in `content/`.
- **Supabase** for analytics events, roles and applications, resume storage, the Ask Trikhya assistant and admin auth.
  Schema in `supabase/migrations/`, server code in `supabase/functions/`.
- `vercel.json` sends the security headers. `SECURITY.md` explains the permission model.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The Supabase project URL and publishable key have defaults in `lib/supabase.ts`; set
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` to point at another project.

## Deploy

Every push to `main` deploys to Vercel. A production build is `npm run build`; the output is the `out/` folder.

Database changes are SQL files in `supabase/migrations/`, run in order in the Supabase SQL editor. Server functions deploy
with `supabase functions deploy <name>`.

## Demo recordings

The Playwright scripts that produce the walkthrough videos in `public/videos/` live outside this repository
(`D:\Work\Website-recordings`), because they drive client systems and must never be published with the site.
