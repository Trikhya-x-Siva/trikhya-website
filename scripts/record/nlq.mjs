// Natural Language Query Assistant walkthrough. Needs the NL-BI stack running locally (see scripts/record/README.md).
// node scripts/record/nlq.mjs
import { record, pause, typeInto, curtain, uncurtain, dotenv, wheel, zoomTo, zoomOut } from "./lib.mjs";

const BASE = process.env.NLQ_URL ?? "http://localhost:3100";
const env = dotenv(process.env.NLQ_ENV ?? "D:/Work/Ortholite/Ortholens-voice-toggle/.env");
// Aggregate questions on purpose: answers show counts and lines, never customer or order lists.
const Q1 = "How many orders are open, overdue or at risk this week?";
const Q2 = "Which production lines produced the most last week?";

const V = {
  ask: "Plant staff ask about orders, materials and finance in plain words. English, Tamil or Hindi, by text or voice.",
  pipeline: "The assistant writes a read-only query against a governed warehouse. A second model checks the query and the result before anything is shown.",
  answer: "The answer comes back with a chart, the records it came from, and a trace. If it cannot verify an answer, it says so.",
  followup: "Follow-up questions keep the thread, and a vague question gets a clarifying prompt instead of a confident guess.",
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
    await zoomTo(page, page.locator('.rcard, :text("Query Assistant")').last(), 1.3); // card when there is one, else the answer header
    await settle(2500);
    await zoomOut(page);

    await speak(V.followup);
    await typeInto(page, INPUT, Q2);
    await pause(page, 400);
    await page.keyboard.press("Enter");
    await say.skipWhile(() => waitForAnswer(page), 1500);
    await zoomTo(page, page.locator('.rcard, :text("Query Assistant")').last(), 1.3); // card when there is one, else the answer header
    await settle(3000);
    await zoomOut(page);
    await say.clear();
  },
});
