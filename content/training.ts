/** AI Induction Training Platform: built and demoed for a multi-plant automotive components group.
 *  Public copy: no client, product or people names. The sector is allowed. */
import type { Solution } from "./solutions";

export const TRAINING: Solution = {
  slug: "ai-training",
  href: "/solutions/ai-training/",
  tag: "02 · B-AI-B",
  status: "Prototype",
  title: "AI Induction Training Platform",
  heroTitle: ["AI Induction", "Training Platform."],
  tagline: "New joiners watch, ask and get tested in their own language. HR sees who has understood the material without chasing anyone.",
  summary:
    "Built for a multi-plant automotive components group. A three-day induction runs as avatar-led video modules in four Indian languages, with an assistant that answers only from the module script, quizzes that interrupt the video, a timed course exam and a certificate issued on passing. Admins generate the exam from the course material and refine it in chat.",
  stats: [
    { value: "4", label: "languages: English, Hindi, Marathi, Tamil" },
    { value: "1", label: "script per course drives video, chat, exam and handout" },
    { value: "20", label: "exam questions drafted from the script, edited by HR" },
    { value: "70%", label: "pass mark, certificate issued on passing" },
  ],
  built: {
    lead: "Watch in your language. Ask the module. Prove you understood.",
    extra: "The learner’s dashboard shows every assigned course, its progress and its due date. The admin’s dashboard shows every learner, who is overdue and who has passed.",
  },
  problem: {
    lead: "Induction was a classroom, a trainer, and a language the new joiner did not always speak.",
    body:
      "Every new joiner at a multi-plant automotive components group sat through the same three days: safety, fire procedures, culture, quality systems, continuous improvement. It needed a trainer in the room, it ran in whichever language the trainer spoke, and the only record was an attendance sheet. HR could not say who had actually understood the material, and a joiner who missed a session waited for the next batch.",
    pains: [
      { title: "One language for everyone", body: "Plants hire across Hindi, Marathi and Tamil speaking regions. A session in the wrong language was attended, not absorbed." },
      { title: "No record of understanding", body: "Attendance was tracked. Comprehension was not. Nobody could show an auditor that a worker knew the fire assembly point." },
      { title: "Questions had nowhere to go", body: "A joiner who did not follow a slide had no one to ask once the trainer left the room." },
    ],
  },
  approach: {
    lead: "One script per course. Everything else is derived from it.",
    body:
      "We did not build a content management system. Each course is a single written script approved by HR. The avatar video is produced from it in each language, the assistant answers only from it, the exam is generated from it, and the offline handout is rendered from it. When HR changes the script, everything downstream follows. The model never has a source the trainer has not seen.",
    principles: [
      { n: "01", title: "Grounded in the module", body: "The assistant is given the script of the module being watched and nothing else. Off-topic questions are redirected. It will not invent a procedure that is not in the material." },
      { n: "02", title: "Language chosen once", body: "A learner picks English, Hindi, Marathi or Tamil at the start of a module. Video, voice and text all follow that choice. Progress is tracked by module, not by language." },
      { n: "03", title: "Humans publish the exam", body: "The model drafts twenty questions from the script. An admin edits, removes and refines in chat, sets the pass mark and the time limit, and only then publishes." },
      { n: "04", title: "A prototype that behaves like a product", body: "Every learner-facing screen works end to end: login, video, quiz, exam, certificate, profile. The demo was the real thing, not a slide deck." },
    ],
  },
  pipeline: {
    lead: "A new joiner’s path through a module.",
    body: "Six steps from assignment to certificate. The video, the assistant, the quiz and the exam all read the same script, so the learner is tested on exactly what they were shown.",
    steps: [
      { title: "Assign", body: "HR uploads a CSV of joiners. Each gets every published course with a due date set from the course’s service level, and a welcome notification." },
      { title: "Choose a language", body: "On first open the learner picks one of four languages. The avatar video and the voice assistant switch to it. On return, the module resumes where they left off." },
      { title: "Watch and ask", body: "The video plays with the assistant beside it. Questions go by text or voice. Speech is transcribed, answered from the script, and read back in the same language." },
      { title: "Mid-module quiz", body: "At a point set per language the video pauses for five questions. A perfect score earns points. The video resumes either way." },
      { title: "Course exam", body: "A timed exam of mixed multiple-choice, true/false and scenario questions. 70 percent passes. A first-attempt pass earns more points." },
      { title: "Certificate and record", body: "A PDF certificate is issued, a badge is awarded, and the training record on the learner’s profile updates. HR’s compliance dashboard reflects it immediately." },
    ],
  },
  outcome: {
    lead: "What the client saw in the demo.",
    points: [
      { title: "Induction without a trainer in the room", body: "A joiner in any plant completes the same three days alone, in their own language, at their own pace. HR knows the moment they finish." },
      { title: "Comprehension, not attendance", body: "Every quiz and exam attempt is scored and stored. The compliance dashboard shows who passed, who is overdue and who never started." },
      { title: "Exams in minutes, not days", body: "An admin uploads the course script, generates the question bank, trims it in chat and publishes. An existing question paper is parsed the same way." },
    ],
  },
  around: {
    lead: "What the admin side looks like.",
    items: [
      { title: "Compliance dashboard", body: "Completion, overdue and pass rates across every learner, with search, expand and pagination." },
      { title: "CSV onboarding", body: "A ten-column template. Upload, preview, import. Every new learner is auto-assigned the published courses with due dates." },
      { title: "Course library", body: "Create a course, upload the avatar video per language, the script and any handouts, then assign learners." },
      { title: "AI assessment engine", body: "Generate from the script or parse an existing paper. Review, edit, refine in chat, set pass mark and time limit, publish." },
      { title: "Voice in four languages", body: "Indian-language speech-to-text and text-to-speech wrap the same text assistant, so a worker can ask aloud and hear the answer." },
      { title: "Points, badges, certificates", body: "Points for modules, quizzes and exams. Badges for the first module and for finishing a category. A downloadable certificate per course." },
    ],
  },
  video: { src: "/videos/ai-training.mp4", poster: "/videos/ai-training.jpg" },
  stack: ["OpenAI GPT-4o", "Sarvam AI speech", "PostgreSQL + pgvector", "Express", "Next.js", "PDFKit", "Google Cloud Run"],
};
