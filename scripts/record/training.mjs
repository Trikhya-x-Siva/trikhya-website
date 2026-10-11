// AI Induction Training Platform walkthrough: learner dashboard → module with Q&A → admin compliance view.
// Needs the training platform running locally on :3200/:3001 (see scripts/record/README.md).
// node scripts/record/training.mjs
import { spawnSync } from "node:child_process";
import { record, pause, typeInto, click, zoomTo, zoomOut, wheel } from "./lib.mjs";
import { BASE, LEARNER, ADMIN, SCRUB, HIDE, login } from "./sm.mjs";

const QUESTION = "Who should do Kaizen on the shop floor?";
const INPUT = 'input[placeholder="Ask a question about this module…"]';

const V = {
  dashboard: "A three-day induction, delivered as self-paced modules in four languages. This is the learner's dashboard: every course, its progress, and its due date.",
  module: "Each module is an avatar-led video. The learner chose Marathi once, and the video, the voice and the text all follow that choice.",
  ask: "Beside the video sits an assistant that answers only from the module's script. Nothing outside the course material.",
  answer: "The answer is grounded in the script, and can be spoken back in the learner's own language.",
  admin: "On the admin side, HR sees who has completed, who is overdue, and who never started. Comprehension on record, not attendance.",
  courses: "Each course is one script. The video, the assistant, the exam and the handout are all derived from it.",
};

// Start the module chat empty, so the first thing on film is the question being typed, not last run's answer.
spawnSync("docker", ["exec", "sparkminda-db", "psql", "-U", "sparkminda", "-q", "-c", "delete from qa_conversations"], { stdio: "ignore" });

await record({
  name: "ai-training",
  url: `${BASE}/login`,
  scrub: SCRUB,
  hideSelector: HIDE,
  narration: Object.values(V),
  run: async (page, say) => {
    const speak = say, settle = say.settle;

    // Learner: dashboard
    await login(page, LEARNER);
    await speak(V.dashboard);
    await pause(page, 800);
    await zoomTo(page, "text=Overall Progress", 1.5);
    await pause(page, 2200);
    await zoomOut(page);
    await wheel(page, 500);
    await pause(page, 1000);
    await wheel(page, -500);
    await settle();

    // Module player with the assistant beside it
    await click(page, page.locator("a", { hasText: "Continue" }).first());
    await say.skipWhile(async () => {
      await page.waitForURL(/\/module\//, { timeout: 60_000 });
      await page.waitForSelector(INPUT, { timeout: 60_000 });
    }, 500);
    await speak(V.module);
    await settle(400);

    await speak(V.ask);
    await zoomTo(page, INPUT, 1.35); // the chat panel sits around the input
    await typeInto(page, INPUT, QUESTION);
    await pause(page, 300);
    await page.keyboard.press("Enter");
    await speak(V.answer);
    // The placeholder reads "Thinking…" while the answer streams and comes back when it is done.
    await say.skipWhile(async () => { await pause(page, 2000); await page.waitForSelector(INPUT, { timeout: 180_000 }); }, 2500);
    await settle(2500);
    await zoomOut(page);
    await say.clear();

    // Admin: compliance dashboard and course library
    await login(page, ADMIN);
    await speak(V.admin);
    await pause(page, 800);
    await zoomTo(page, "text=Completion Rate", 1.5);
    await pause(page, 2200);
    await zoomOut(page);
    await wheel(page, 600);
    await settle(600);
    await page.goto(`${BASE}/admin/courses`, { waitUntil: "load" });
    await speak(V.courses);
    await settle(1000);
    await say.clear();
  },
});
