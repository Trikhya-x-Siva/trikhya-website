// Shared bits for the two training-platform recordings (training + hiring live in one app).
import { curtain, uncurtain } from "./lib.mjs";

export const BASE = process.env.TRAINING_URL ?? "http://localhost:3200";
export const API = process.env.TRAINING_API ?? "http://localhost:3001";
export const LEARNER = { email: "rahul@sparkminda.com", password: "SparkMinda@2026" }; // seeded demo accounts
export const ADMIN = { email: "pradnya@sparkminda.com", password: "SparkMinda@2026" };

// Client name never appears: company name is rewritten live and the logo hidden.
export const SCRUB = [
  { pattern: "spark\\s?minda\\s+group", flags: "gi", replace: "the Group" },
  { pattern: "spark\\s?minda", flags: "gi", replace: "Induction" },
  // The seeded admin persona is a real person at the client: never on film.
  { pattern: "Pradnya\\s+Murumkar", flags: "g", replace: "HR Admin" },
  { pattern: "Pradnya", flags: "g", replace: "Admin" },
  { pattern: "^\\s*PM\\s*$", flags: "g", replace: "HR" },
  { pattern: "^\\s*SM\\s*$", flags: "g", replace: "IN" },
];
export const HIDE = 'img[alt*="minda" i], img[src*="minda" i], img[alt*="logo" i]';

/** Sign in over the API and hand the session to the app through its localStorage keys (sm_token / sm_user). */
async function session(page, creds) {
  const r = await page.request.post(`${API}/api/auth/login`, { data: creds });
  if (!r.ok()) throw new Error(`login failed: ${r.status()}`);
  const { token, user } = await r.json();
  return [token, JSON.stringify(user)];
}

/** Before the first page: the next navigation already carries the session, so no login screen is ever on film. */
export async function primeLogin(page, creds) {
  const s = await session(page, creds);
  // Runs on every navigation: only seed an empty store, so a later switchUser() is not undone.
  await page.context().addInitScript(([t, u]) => { if (!localStorage.getItem("sm_token")) { localStorage.setItem("sm_token", t); localStorage.setItem("sm_user", u); } }, s);
}

/** Mid-recording: become another user and land on their home page, again without the login screen. */
export async function switchUser(page, creds, home) {
  const s = await session(page, creds);
  await page.evaluate(([t, u]) => { localStorage.setItem("sm_token", t); localStorage.setItem("sm_user", u); }, s);
  await page.goto(`${BASE}${home}`, { waitUntil: "load" });
}

// Kept for scenarios that still want the UI sign-in behind a slate.
export async function login(page, { email, password }) {
  if (!page.url().includes("/login")) {
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/login`, { waitUntil: "load" });
  }
  await curtain(page);
  await page.fill("input[type=email]", email);
  await page.fill("input[type=password]", password);
  await page.click("button[type=submit]");
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 60_000 });
  await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {});
  await uncurtain(page); // client-side redirect: no full navigation, so lift the slate by hand
}

/** Admin JWT for seeding demo data over the API before a recording. */
export async function adminToken() {
  const r = await fetch(`${API}/api/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(ADMIN) });
  if (!r.ok) throw new Error(`login failed: ${r.status}`);
  const j = await r.json();
  return j.token ?? j.accessToken ?? j.access_token;
}
