// Natural Language Query Assistant walkthrough. Needs the NL-BI stack running locally (see scripts/record/README.md).
// node scripts/record/nlq.mjs
import { record, pause, typeInto, dotenv, zoomTo, zoomOut } from "./lib.mjs";

const BASE = process.env.NLQ_URL ?? "http://localhost:3100";
const env = dotenv(process.env.NLQ_ENV ?? "D:/Work/Ortholite/Ortholens-voice-toggle/.env");
const Q1 = "How many orders are open, overdue or at risk this week?"; // comes back as a written answer
const Q2 = "Plot daily output for the last 7 days";                   // asks for a chart outright

// Each line describes exactly what is on screen at that moment.
const V = {
  ask: "Plant staff ask about orders, materials and finance in plain words. English, Tamil or Hindi, by text or voice.",
  pipeline: "Watch the stages: the question is normalised, the right tables are picked, a read-only query is written, and a second model checks the result before anything is shown.",
  answer: "The answer arrives as a plain sentence with the numbers, the SQL it ran, and a trace id, so every figure can be checked.",
  followup: "Follow-up questions keep the thread. Ask for a breakdown.",
  chart: "It comes back as a chart, built from the records it found.",
};

// Client name never appears: product name and company name are rewritten live, the logo is hidden.
const SCRUB = [
  { pattern: "ortho\\s?lens", flags: "gi", replace: "Query Assistant" },
  { pattern: "ortho\\s?lite", flags: "gi", replace: "the plant" },
  // The chat header renders the wordmark as two text nodes, "Ortho" + "Lens".
  { pattern: "^\\s*Ortho\\s*$", flags: "g", replace: "Query " },
  { pattern: "^\\s*Lens\\s*$", flags: "g", replace: "Assistant" },
  // Customer brands named in hints and placeholders, and the bootstrap admin (a real person): never on film.
  { pattern: "\\b(Nike|Adidas)\\b", flags: "g", replace: "Customer" },
  { pattern: "\\bBala\\b", flags: "g", replace: "Ops" },
];

const INPUT = 'textarea[placeholder="How can I help you today?"], input[placeholder="How can I help you today?"]';
const GAVE_UP = /not able to answer|unable to answer|cannot answer|couldn.t answer|try again later/i;

/** The chat disables its input while the pipeline runs and re-enables it when the answer is in. */
async function waitForAnswer(page) {
  await pause(page, 2500);
  await page.waitForFunction((sel) => { const el = document.querySelector(sel); return !!el && !el.disabled; }, INPUT, { timeout: 300_000 });
  await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {});
  await pause(page, 1200);
}

/** The assistant occasionally declines or answers in prose instead of a chart. Ask until it gives what the
 *  narration promises; every failed attempt is cut from the film and the thread is reset before retrying. */
async function askUntil(page, say, q, { chart = false, tries = 4, onSent } = {}) {
  for (let i = 0; i < tries; i++) {
    const from = say.now();
    const before = await page.locator(".rcard").count();
    await typeInto(page, INPUT, q);
    await pause(page, 400);
    await page.keyboard.press("Enter");
    if (onSent) await onSent(); // narration that belongs to the stages shown while the answer is computed
    await say.skipWhile(() => waitForAnswer(page), 1500);
    const gaveUp = await page.evaluate((re) => new RegExp(re, "i").test(document.body.innerText.slice(-800)), GAVE_UP.source);
    const gotChart = (await page.locator(".rcard").count()) > before;
    if (!gaveUp && (!chart || gotChart)) return;
    console.log(`attempt ${i + 1} for "${q}": ${gaveUp ? "declined" : "no chart"}; retrying in a fresh thread`);
    await page.locator('[aria-label="New session"]').first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForSelector(INPUT, { timeout: 60_000 });
    await pause(page, 800);
    say.cut(from, say.now());
  }
  throw new Error(`no usable answer for "${q}" after ${tries} attempts`);
}

await record({
  name: "natural-language-query",
  url: `${BASE}/chat`,
  // Sign in over the API before the first frame: the session cookie lands in the browser context, no login screen on film.
  prepare: async (page) => {
    const r = await page.request.post(`${BASE}/api/auth/login`, { data: { email: env.BOOTSTRAP_ADMIN_EMAIL, password: env.BOOTSTRAP_ADMIN_PASSWORD } });
    if (!r.ok()) throw new Error(`NL-BI login failed: ${r.status()}`);
  },
  scrub: SCRUB,
  hideSelector: 'img[src*="ortholite" i], img[alt*="ortholite" i]',
  narration: Object.values(V),
  captionPos: "bottom:112px", // clear of the chat input, which lives at the bottom
  run: async (page, say) => {
    const speak = say, settle = say.settle;

    await say.skipWhile(() => page.waitForSelector(INPUT, { timeout: 60_000 }), 0);
    // Hide the session history: earlier questions from real users could carry names we must not show.
    await page.locator('[aria-label="Collapse sidebar"]').first().click({ timeout: 5000 }).catch(() => {});
    await pause(page, 800);

    await speak(V.ask);
    await zoomTo(page, INPUT, 1.3);
    await askUntil(page, say, Q1, { onSent: async () => { await zoomOut(page); await speak(V.pipeline); } });
    await speak(V.answer);
    await zoomTo(page, page.locator("text=View SQL Query").last(), 1.35); // the sentence sits just above the SQL button and the trace
    await settle(2500);
    await zoomOut(page);

    await speak(V.followup);
    await askUntil(page, say, Q2, { chart: true });
    await speak(V.chart);
    await zoomTo(page, page.locator(".rcard").last(), 1.3);
    await settle(3000);
    await zoomOut(page);
    await say.clear();
  },
});
