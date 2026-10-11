/** AI Hiring Screener: resume screening plus the first-round phone interview, in one hiring console.
 *  Public copy: no client, product or people names. The sector is allowed. */
import type { Solution } from "./solutions";

export const HIRING: Solution = {
  slug: "ai-hiring",
  href: "/solutions/ai-hiring/",
  tag: "03 · B-AI-B",
  status: "Prototype",
  title: "AI Hiring Screener",
  heroTitle: ["AI Hiring", "Screener."],
  tagline: "Write the criteria once. Drop in the resumes. Get a ranked, explained shortlist, then let the AI make the first-round call in the candidate’s language.",
  summary:
    "Built for the hiring team of a multi-plant automotive components group. A recruiter writes a job description with its qualifying criteria as fields and uploads a batch of resumes. The screener reads each PDF, scores it against the criteria with fixed arithmetic, and writes three strengths and three gaps. The recruiter shortlists against the original PDF. Shortlisted candidates are then rung by an AI interviewer in their own language, and the call comes back as a transcript, a summary and a score.",
  stats: [
    { value: "5", label: "criteria per job: education, experience, languages, must-haves, nice-to-haves" },
    { value: "0–100", label: "resume score from fixed weights, not from the model" },
    { value: "2", label: "model calls per resume: one to read, one to explain" },
    { value: "1", label: "AI phone interview per shortlisted candidate, transcribed and scored" },
  ],
  built: {
    lead: "Define the bar once. Let the screener hold it for every resume, and make the first call.",
    extra: "Each job lists how many resumes it holds and how many are shortlisted. One click on the shortlist starts the first-round calls, and each call shows its state as it happens: queued, ringing, in progress, completed, no answer. Resume score, breakdown, transcript and the recruiter’s notes sit on one candidate record.",
  },
  problem: {
    lead: "A hundred resumes for one plant role, a recruiter with an afternoon, and a week of phone tag after.",
    body:
      "Plant roles at an automotive components group attract large volumes of applications, many in similar formats and few that state the basics plainly: does the candidate hold the minimum qualification, do they read and write the plant’s language, have they used the tools the role needs. A recruiter opened each PDF, skimmed it and kept a spreadsheet. Then came the calls: fifteen minutes each, candidates on a shift who could not pick up, notes typed up differently by every recruiter. By the time the first round was done, the strongest candidates had taken another offer.",
    pains: [
      { title: "Criteria lived in people’s heads", body: "The job description said what the role was. The actual bar, which diploma, how many years, which languages, was applied from memory and differed by recruiter." },
      { title: "Reading does not scale", body: "Fifty resumes is an afternoon. Two hundred is a week, and the later ones get less attention than the first." },
      { title: "Phone tag", body: "Candidates on a shift cannot answer during office hours. Recruiters cannot call after theirs. A first round stretched across a week of missed calls." },
      { title: "No reason on record", body: "A rejection was a row in a spreadsheet. When a hiring manager asked why a candidate was dropped, nobody could say." },
    ],
  },
  approach: {
    lead: "The model reads and talks. The arithmetic decides. The recruiter signs off.",
    body:
      "The temptation in hiring is to hand the whole judgement to a model and ask for a score. We did not. The model does the things it is good at: reading a messy PDF into a structured profile, explaining a result in plain words, and holding a first-round conversation in the candidate’s language. The resume score comes from fixed weights over fields the recruiter defined, so the same resume gets the same number every time. The interview comes back as a transcript, so a score is never the only thing left. Who meets a human is still the recruiter’s choice.",
    principles: [
      { n: "01", title: "Criteria are fields, not prose", body: "Minimum education, minimum years, required languages with read and write, must-have skills and good-to-have skills are structured fields on every job. The screener reads them, not the paragraph." },
      { n: "02", title: "Hard filter first, fixed weights after", body: "Every must-have skill, the education rank, the years and the languages must pass. Then fixed weights set the score: must-haves 40, good-to-haves 20, experience 20, education 10, languages 10. The breakdown is shown per criterion." },
      { n: "03", title: "The PDF stays in view", body: "The parsed profile is shown beside the original document. If the model misread a degree or a date, the recruiter sees it and overrides the decision." },
      { n: "04", title: "The AI makes the first call, not the decision", body: "The interviewer is briefed on the job and nothing else, speaks the candidate’s language, and keeps every turn with a timestamp. Only admins start calls, only shortlisted candidates are called, one live call per candidate." },
    ],
  },
  pipeline: {
    lead: "From a batch of PDFs to a scored first interview.",
    body: "Nine steps in two stages. Reading and explaining are model calls. The resume score is plain arithmetic, so it is the same for every recruiter and every run. The phone call is a conversation held by the model on the job brief and kept as a transcript.",
    steps: [
      { title: "Define the job", body: "Title, department, location and description, plus the qualifying criteria as fields. Must-have skills are a hard filter. Good-to-have skills add weight." },
      { title: "Upload the batch", body: "Drag in up to twenty-five PDFs. Files are validated on both sides and stored against the job. Status pills track new, screened, shortlisted and rejected." },
      { title: "Read each resume", body: "The model receives the PDF itself and returns a fixed-shape profile: education, experience with years, total experience, skills, and languages with read and write flags." },
      { title: "Score and filter", body: "Skills are matched with a synonym table, education is ranked, years and languages are compared. Hard requirements set pass or fail. Weights set the 0 to 100 score." },
      { title: "Explain and shortlist", body: "A second call writes three strengths and three gaps in under 150 words. The recruiter reads the breakdown beside the PDF and shortlists or rejects." },
      { title: "Call the shortlist", body: "One click queues the shortlisted candidates. Numbers are normalised, candidates without a valid phone are skipped with a reason, and no candidate ever has two live calls." },
      { title: "Converse", body: "A telephony bridge joins the line to speech recognition, the interviewer model and speech synthesis. The model holds the job brief for the whole call and replies in the candidate’s language." },
      { title: "Transcribe, summarise, score", body: "Every turn lands on the interview record with speaker and timestamp. When the call ends, a summary and a score are written from the transcript. A missed call is marked and can be retried." },
      { title: "Recruiter decides", body: "Transcript, summary and score appear beside the resume breakdown on the candidate’s record. The recruiter adds notes and chooses who moves to a human interview." },
    ],
  },
  outcome: {
    lead: "What changed for the hiring team.",
    points: [
      { title: "The first screen in minutes, the first call the same day", body: "A batch that took an afternoon to read is parsed, scored and explained while the recruiter writes the next job. Calls go out the moment the shortlist exists and run in parallel." },
      { title: "The same bar for every candidate", body: "The resume score is arithmetic over declared criteria, and every call is held on the same brief. Two recruiters get the same ranking, and two candidates can be set side by side." },
      { title: "A reason for every decision", body: "Each candidate carries the breakdown, the strengths and gaps, the interview transcript and the recruiter’s final call. The answer to “why” is on the record." },
    ],
  },
  around: {
    lead: "What else is in the module.",
    items: [
      { title: "Job descriptions with status", body: "Open, closed and archived. Each lists its resume count and shortlist count. Archiving is a soft delete." },
      { title: "Drill-in review", body: "Score badge, hard-requirement banner, per-criterion bars, rationale, parsed profile and the PDF side by side. Shortlist, reject or reset." },
      { title: "Synonym-aware matching", body: "Lean and lean manufacturing, 5S and five S, kaizen and continuous improvement all match. The table is small and editable." },
      { title: "Live call status", body: "Queued, initiating, ringing, in progress, completed, failed, no answer. The recruiter watches the batch move without refreshing." },
      { title: "One candidate record", body: "Resume score, breakdown, strengths and gaps, interview transcript, summary, score and recruiter notes, all in one place." },
      { title: "Guarded calling", body: "Admin-only start, shortlisted candidates only, one live call per candidate. Until a phone line and the bridge are connected, calls wait as queued and say so plainly." },
    ],
  },
  video: { src: "/videos/ai-hiring.mp4", poster: "/videos/ai-hiring.jpg" },
  stack: ["Claude Sonnet 4.5", "Sarvam AI speech", "Telephony bridge", "PostgreSQL", "Express", "Next.js", "Google Cloud Run"],
};
