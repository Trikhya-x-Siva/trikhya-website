// Natural Language Query Assistant walkthrough. Needs the NL-BI stack running locally (see scripts/record/README.md).
// node scripts/record/nlq.mjs
import { record, pause, typeInto, curtain, uncurtain, dotenv, wheel, zoomTo, zoomOut } from "./lib.mjs";

const BASE = process.env.NLQ_URL ?? "http://localhost:3100";
const env = dotenv(process.env.NLQ_ENV ?? "D:/Work/Ortholite/Ortholens-voice-toggle/.env");
// Aggregate questions on purpose: answers show counts and lines, never customer or order lists.
const Q1 = "How many orders are open, overdue or at risk this week?"; // comes back as a written answer
const Q2 = "Plot daily output for the last 7 days";                   // asks for a chart outright

// Each line describes exactly what is on screen at that moment.
const V = {
  ask: "Plant staff ask about orders, materials and finance in plain words. English, Tamil or Hindi, by text or voice.",
  pipeline: "Watch the stages: the question is normalised, the right tables are picked, a read-only query is written, and a second model checks the result before anything is shown.",
  answer: "The answer arrives as a plain sentence with the numbers, the SQL it ran, and a trace id, so every figure can be checked.",
  followup: "Follow-up questions keep the thread. Ask for a breakdown.",
  // One of these is spoken once the answer is in; the script checks whether a chart card appeared.
  chart: "It comes back as a chart, built from the records it found.",
  breakdown: "It comes back as the figures line by line, with the outliers called out.",
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

/** The chat disables its input while the pipeline runs and re-enables it when the answer card is in. */
async function waitForAnswer(page) {
  await pause(page, 2500);
  await page.waitForFunction((sel) => { const el = document.querySelector(sel); return !!el && !el.disabled; }, INPUT, { timeout: 300_000 });
  await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {});
  await pause(page, 1200);
}

await record({
  name: "natural-language-query",
  url: `${BASE}/login`,
  scrub: SCRUB,
  hideSelector: 'img[src*="ortholite" i], img[alt*="ortholite" i]',
  narration: Object.values(V),
  captionPos: "bottom:112px", // clear of the chat input, which lives at the bottom
  run: async (page, say) => {
    const speak = say, settle = say.settle;

    // Sign-in and the chat load are dead time behind the slate: keep a second of it, cut the rest.
    await say.skipWhile(async () => {
      await curtain(page);
      await page.fill("input[type=email]", env.BOOTSTRAP_ADMIN_EMAIL);
      await page.fill("input[type=password]", env.BOOTSTRAP_ADMIN_PASSWORD);
      await page.click("button[type=submit]");
      await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 90_000 });
      await uncurtain(page); // client-side redirect: lift the slate by hand
      await page.goto(`${BASE}/chat`, { waitUntil: "load" });
      await page.waitForSelector(INPUT, { timeout: 60_000 });
    }, 1000);
    // Hide the session history: earlier questions from real users could carry names we must not show.
    await page.locator('[aria-label="Collapse sidebar"]').first().click({ timeout: 5000 }).catch(() => {});
    await pause(page, 1200);

    await speak(V.ask);
    await zoomTo(page, INPUT, 1.3);
    await typeInto(page, INPUT, Q1);
    await pause(page, 400);
    await page.keyboard.press("Enter");
    await zoomOut(page);
    await speak(V.pipeline);
    await say.skipWhile(() => waitForAnswer(page), 1500);
    await speak(V.answer);
    await zoomTo(page, page.locator('text=View SQL Query').last(), 1.35); // the sentence sits just above the SQL button and the trace
    await settle(2500);
    await zoomOut(page);

    await speak(V.followup);
    const cardsBefore = await page.locator(".rcard").count();
    await typeInto(page, INPUT, Q2);
    await pause(page, 400);
    await page.keyboard.press("Enter");
    await say.skipWhile(() => waitForAnswer(page), 1500);
    const gotChart = (await page.locator(".rcard").count()) > cardsBefore;
    await speak(gotChart ? V.chart : V.breakdown); // say what is actually on screen
    await zoomTo(page, gotChart ? page.locator(".rcard").last() : page.locator(':text("Query Assistant")').last(), 1.3);
    await settle(3000);
    await zoomOut(page);
    await say.clear();
  },
});
