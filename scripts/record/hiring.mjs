// AI Hiring Screener walkthrough: job with criteria → upload resumes → run the screener → drill in → shortlist.
// Needs the training platform running locally and the synthetic resumes (node scripts/record/make-resumes.mjs <backend>).
// node scripts/record/hiring.mjs
import fs from "node:fs";
import path from "node:path";
import { record, pause, click, zoomTo, zoomOut, wheel } from "./lib.mjs";
import { BASE, API, ADMIN, SCRUB, HIDE, login, adminToken } from "./sm.mjs";

const RESUMES = fs.readdirSync(path.resolve(".record-tmp/resumes")).filter((f) => f.endsWith(".pdf")).map((f) => path.resolve(".record-tmp/resumes", f));
if (RESUMES.length === 0) throw new Error("no resumes: run make-resumes.mjs first");

const JOB = {
  title: "Production Engineer",
  department: "Production",
  location: "Plant 2",
  description: "Own shift output on an assembly line of 14 stations. Run daily 5S audits and Kaizen huddles, maintain line documentation, and coordinate with maintenance and quality.",
  min_education: "Diploma",
  min_experience_years: 2,
  required_languages: ["Hindi", "Marathi"],
  must_have_skills: ["5S", "Kaizen"],
  good_to_have_skills: ["AutoCAD", "Lean Manufacturing"],
};

const V = {
  job: "Hiring starts with a job description whose qualifying criteria are fields, not prose.",
  criteria: "Minimum education, minimum experience, required languages, must-have skills as a hard filter, and good-to-have skills for extra weight.",
  upload: "Drop in a batch of resumes. Up to twenty-five PDFs at a time.",
  screen: "The screener reads each PDF into a structured profile, scores it with fixed weights, and writes three strengths and three gaps.",
  scored: "Every candidate now has a score out of one hundred, and a pass or fail on the hard requirements.",
  drill: "Open the top candidate: the breakdown per criterion, the rationale, and the parsed profile beside the original PDF.",
  shortlist: "Shortlist. From here, the AI phone interviewer makes the first-round call.",
};

/** Fresh job every run so the recording always starts from an empty resume list. */
async function freshJob() {
  const token = await adminToken();
  const h = { "content-type": "application/json", authorization: `Bearer ${token}` };
  const list = await (await fetch(`${API}/api/admin/jobs`, { headers: h })).json();
  for (const j of list.jobs ?? []) if (j.title === JOB.title) await fetch(`${API}/api/admin/jobs/${j.id}`, { method: "DELETE", headers: h });
  const r = await fetch(`${API}/api/admin/jobs`, { method: "POST", headers: h, body: JSON.stringify(JOB) });
  if (!r.ok) throw new Error(`create job failed: ${r.status} ${await r.text()}`);
  return (await r.json()).job.id;
}

const jobId = await freshJob();

await record({
  name: "ai-hiring",
  url: `${BASE}/login`,
  scrub: SCRUB,
  hideSelector: HIDE,
  narration: Object.values(V),
  run: async (page, say) => {
    const speak = say, settle = say.settle;

    await login(page, ADMIN);

    // The job and its criteria
    await page.goto(`${BASE}/admin/jobs`, { waitUntil: "load" });
    await speak(V.job);
    await page.waitForSelector("tr", { timeout: 60_000 });
    await pause(page, 1200);
    await click(page, page.locator("tr", { hasText: JOB.title }).first()); // rows navigate on click
    await page.waitForURL(new RegExp(`/admin/jobs/${jobId}`), { timeout: 60_000 });
    await settle(300);
    await click(page, page.locator("button", { hasText: "Resumes" }).first());
    await page.waitForSelector("text=CRITERIA", { timeout: 60_000 });
    await speak(V.criteria);
    await zoomTo(page, "text=CRITERIA", 1.5);
    await settle(400);
    await zoomOut(page);

    // Upload the batch
    await speak(V.upload);
    await click(page, page.locator("button", { hasText: "Choose files" }).first()).catch(() => {});
    await page.locator('input[type="file"]').setInputFiles(RESUMES);
    await say.skipWhile(() => page.waitForFunction((n) => document.querySelectorAll('a[href^="/admin/resumes/"]').length >= n, RESUMES.length, { timeout: 90_000 }));
    await settle(600);

    // Screen them all
    await speak(V.screen);
    await click(page, page.locator("button", { hasText: "Run AI Screener" }).first());
    await say.skipWhile(() => page.waitForFunction(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Screening…|Run AI Screener|Re-screen All/.test(x.textContent ?? ""));
      return b && /Re-screen All/.test(b.textContent ?? "");
    }, null, { timeout: 300_000 }));
    await speak(V.scored);
    await zoomTo(page, page.locator("tbody tr").first(), 1.4);
    await settle(800);
    await zoomOut(page);

    // Drill into the top candidate and shortlist
    await click(page, page.locator('a[href^="/admin/resumes/"]').first());
    await say.skipWhile(async () => {
      await page.waitForURL(/\/admin\/resumes\//, { timeout: 60_000 });
      await page.waitForSelector("text=Candidate Profile", { timeout: 90_000 }); // the detail view fetches before it renders
    }, 500);
    await pause(page, 600);
    await speak(V.drill);
    await pause(page, 1500);
    await wheel(page, 700, 10, 110);
    await settle(600);
    await wheel(page, -700, 10, 70);
    await pause(page, 500);
    await speak(V.shortlist);
    await click(page, page.locator("button", { hasText: /^Shortlist$/ }).first());
    await settle(1200);
    await say.clear();
  },
});
