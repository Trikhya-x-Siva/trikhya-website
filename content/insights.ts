/** Insights: essays, engineering write-ups and field notes drawn from our first production build.
 *  Public copy: no client, product or table names. "A multi-plant insole manufacturer" is allowed.
 *  The only accuracy figure we publish is the achieved end-to-end number. */

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "quote"; text: string }
  | { t: "list"; items: string[] }
  | { t: "steps"; items: { title: string; body: string }[] };

export type Insight = {
  slug: string;
  kind: "ESSAY" | "ENGINEERING" | "FIELD NOTES" | "GUIDE";
  minutes: number;
  title: string;
  dek: string;
  date: string; // ISO
  cover: { from: string; to: string; glyph: string };
  body: Block[];
  related?: string[]; // slugs
};

export const insightHref = (slug: string) => `/insights/${slug}/`;

export const INSIGHTS: Insight[] = [
  {
    slug: "human-ai-human",
    kind: "ESSAY",
    minutes: 6,
    title: "Why human-AI-human beats fully autonomous AI in operations",
    dek: "The systems that survive contact with a factory floor are the ones that know when to ask, when to stop, and how to show their working.",
    date: "2026-09-30",
    cover: { from: "#1670A6", to: "#0F4A70", glyph: "H·AI·H" },
    body: [
      { t: "p", text: "Every pitch deck in this space promises an agent that runs the plant while you sleep. We have spent the last year building AI for a multi-plant insole manufacturer, and the thing that actually changed how people work there is far less dramatic. It is an assistant that answers a question, shows where the answer came from, and hands the decision back to a person." },
      { t: "p", text: "We call the shape human-AI-human. A person asks. The system does the tedious, error-prone middle: finding the right tables, writing the query, checking the result. A person reads the answer, with its sources, and decides what to do. The AI never acts on the business by itself." },
      { t: "h", text: "Autonomy fails quietly" },
      { t: "p", text: "A fully autonomous loop fails in the worst possible way: silently. A wrong join produces a plausible number. A misread date column shifts a whole month. Nobody sees the SQL, so nobody catches it, and the number ends up on a slide. In operations, one confident wrong answer costs more trust than ten honest refusals." },
      { t: "p", text: "So we designed for refusal. If a question is out of scope, the assistant says so and stops. If a metric, a time range or a reference is missing, it asks a short clarifying question instead of guessing. If a second model disagrees with the first one twice, the assistant says it does not have a reliable answer. No answer beats a bad one." },
      { t: "h", text: "What people actually wanted" },
      { t: "p", text: "When we sat with plant supervisors and finance staff, nobody asked for a robot manager. They asked for three things. Speed, because a question that took three people a day was usually stale by the time it was answered. Sources, because a number they could not trace was a number they could not defend. And honesty, because they had all been burned by dashboards that were quietly wrong." },
      { t: "quote", text: "Show me which records this came from and I will believe you. Guess, and I will never ask again." },
      { t: "h", text: "The human on each end is the feature" },
      { t: "p", text: "Keeping a person at both ends is not a limitation we tolerate. It is what makes the system deployable. The person asking brings context the data does not have. The person reading brings judgement about what the number means for the shift in front of them. The AI's job is to make the stretch between them as short and as checkable as possible." },
      { t: "p", text: "Fully autonomous AI in operations will come, in narrow places, once the measurement is good enough to trust it. Until then the question to ask of any system is simple: when it is wrong, how does anyone find out?" },
    ],
    related: ["correct-answers-messy-data", "evaluating-before-users"],
  },
  {
    slug: "correct-answers-messy-data",
    kind: "ENGINEERING",
    minutes: 9,
    title: "Getting correct answers from messy business data",
    dek: "Most wrong answers from a natural-language query system are not wrong SQL. They are a word that means two things in two departments.",
    date: "2026-09-27",
    cover: { from: "#0E1116", to: "#1f2733", glyph: "SELECT" },
    body: [
      { t: "p", text: "When our natural-language query assistant gave a wrong answer, we used to assume the model had written bad SQL. After months of reading traces from a multi-plant manufacturer, we can say that almost never happened. The syntax was fine. The definitions were not." },
      { t: "h", text: "A failure map, not a benchmark" },
      { t: "p", text: "We keep a fixed set of real questions from the floor and run it on every release. When an answer is wrong we classify why. The classes that dominate have nothing to do with language models:" },
      { t: "list", items: [
        "A state word defined by a proxy or too narrowly. Open, pending, incoming, completed and current stage each meant something slightly different to the people who used them.",
        "The right period on the wrong date column. This week against an order date when the user meant a dispatch date.",
        "Snapshot tables summed over time. A monthly performance snapshot added up across months gives a number that looks real and is not.",
        "An analytical shape asked for, a data dump produced. The user said trend or what changed; the query returned rows.",
        "A same-named column on the wrong table. Two tables carried an invoiced quantity at different grains.",
      ] },
      { t: "p", text: "Every one of these is a definitions problem. None is a syntax problem. That changed what we built." },
      { t: "h", text: "The rulebook contradicted itself" },
      { t: "p", text: "The second discovery was more embarrassing. We had written business rules into several prompts over several months. In two places open orders meant one thing and in two others it meant something stricter. The generating model followed one rule, the validating model followed the other, and a correct query was rejected for obeying the rulebook. The retry then learned the opposite rule and failed differently." },
      { t: "p", text: "Conflicting guidance is now the first thing we look for when accuracy drops. Models are remarkably obedient. If the instructions disagree, the output will too." },
      { t: "h", text: "What fixed it" },
      { t: "steps", items: [
        { title: "One glossary, rendered everywhere", body: "Business definitions live in a single governed registry. Every prompt that needs them, generator and validator alike, renders from the same source. A definition changes in one place or it does not change." },
        { title: "A join registry, not a schema dump", body: "Tables may only be joined along hand-written, validated paths. The model chooses among approved joins. It does not discover them." },
        { title: "A verified example bank", body: "Curated question-and-query pairs, retrieved per question, go into the prompt. They teach the model the house style of a correct answer better than any rule." },
        { title: "Annotated columns", body: "The handful of columns that keep getting confused carry a plain-English note on grain, units and what not to do with them." },
        { title: "A validator that reads the same book", body: "The second model judges query and result against the question using the same definitions as the first. Its feedback goes back into generation verbatim." },
      ] },
      { t: "p", text: "The result on the floor is a system that answers correctly end to end 92.4% of the time, and that says it does not know for most of the rest. We publish that number to the client on every release. It moves when the definitions move, far more than when the model does." },
      { t: "quote", text: "We did not have a SQL problem. We had a definitions problem and a rulebook problem." },
      { t: "p", text: "If you are starting a project like this, spend the first weeks with the people who answer these questions today. Write down what the words mean. The model will do what you tell it. The hard part is agreeing on what to tell it." },
    ],
    related: ["evaluating-before-users", "human-ai-human"],
  },
  {
    slug: "pilot-to-daily-use",
    kind: "FIELD NOTES",
    minutes: 5,
    title: "What we learned taking AI from pilot to daily use",
    dek: "A pilot proves the model can answer. Daily use proves the data arrives, the alert lands, and the answer comes in the language of the shift.",
    date: "2026-09-20",
    cover: { from: "#0F4A70", to: "#4FB8EE", glyph: "SHIFT 2" },
    body: [
      { t: "p", text: "The demo took a few weeks. Making the same assistant part of how a multi-plant insole manufacturer runs its day took the rest of the year. These are the notes we wish we had been given at the start." },
      { t: "h", text: "1. Fresh data is the product" },
      { t: "p", text: "The first week in production the answers were right and useless, because the warehouse was a day behind. People asking about this morning's dispatch do not care that the model is clever. We moved to hourly incremental loads from the three source systems and built deploy gates that refuse to ship when the table catalogue or glossary is incomplete. Freshness is a feature with a number on it." },
      { t: "h", text: "2. Nobody opens a dashboard during a shift" },
      { t: "p", text: "Supervisors are on their feet. What they have is a phone. So alerts about overdue and at-risk orders, material shortages and pending approvals go out over WhatsApp, each sent once, with a button to acknowledge or close. A follow-up question typed back into the same thread goes to the assistant. The dashboard still exists. The phone is where the work happens." },
      { t: "h", text: "3. English is the third language" },
      { t: "p", text: "On the floor the questions are in Tamil and Hindi, often spoken. We added voice capture that transcribes into English for the query engine, then translates the answer back and speaks it, all inside the same streamed response. The user sees the answer type out in their own language with no English flash in between. Adoption among supervisors changed the week this shipped." },
      { t: "h", text: "4. Read the traces every week" },
      { t: "p", text: "Every answer carries a trace id. Every stage records what it saw and decided. Once a week an engineer sits with the week's failures and classifies them. Most fixes are a glossary line or a new curated example, not a model change. This hour is the highest-leverage engineering time we spend." },
      { t: "h", text: "5. Say the accuracy out loud" },
      { t: "p", text: "We tell the client the current end-to-end accuracy on every release. Publishing the number made the conversation about the system honest. It also made the client part of improving it: the questions they flag go into the fixed set we test against." },
      { t: "quote", text: "A pilot is a model that can answer. Production is a system that is still right on Tuesday afternoon, in Tamil, on a phone." },
    ],
    related: ["three-languages-one-stream", "human-ai-human"],
  },
  {
    slug: "first-ai-use-case",
    kind: "GUIDE",
    minutes: 7,
    title: "Choosing the first AI use case worth funding",
    dek: "Pick the question people already ask every day, where the data already exists, and where a wrong answer is visible. Then measure it.",
    date: "2026-09-12",
    cover: { from: "#E7ECF1", to: "#BFE6FA", glyph: "01" },
    body: [
      { t: "p", text: "Most first AI projects fail before the model is chosen. They fail at the choice of problem. Having now carried a system from a whiteboard to daily use in a manufacturing group, this is the filter we apply when a leadership team asks where to start." },
      { t: "h", text: "Start with a question, not a capability" },
      { t: "p", text: "Do not start from what the technology can do. Start from the questions people in the business already ask each other every day, and the ones they have stopped asking because the answer takes too long. Which orders will miss dispatch this week. Which material is holding up the most value. Who has not paid. If a question is asked daily and answered slowly, it is a candidate." },
      { t: "h", text: "Five tests" },
      { t: "steps", items: [
        { title: "The data already exists", body: "Somebody, somewhere, can answer this today with enough time and enough spreadsheets. If the answer requires data nobody collects, that is a data project first." },
        { title: "A wrong answer is visible", body: "The best first use cases are ones where the person reading the answer can tell when it is off. That feedback loop is how the system gets better, and it is how trust is built." },
        { title: "The decision is frequent", body: "A question asked by ten people every shift pays back faster than one asked by the board every quarter, however important the latter sounds." },
        { title: "The owner is one person", body: "Someone has to decide what the words mean. If three departments own the definition of open order, find the one who will arbitrate before you write a line of code." },
        { title: "You can state the success number", body: "If you cannot say, before starting, what accuracy or time saved would count as success, you will not be able to say afterwards whether it worked." },
      ] },
      { t: "h", text: "What to avoid first time out" },
      { t: "list", items: [
        "Anything that writes to a system of record. Read first. Earn the right to write.",
        "Anything customer-facing. Internal users forgive a clarifying question. Customers do not.",
        "Anything that depends on data from a system you do not yet have access to.",
        "Anything whose value depends on being fully autonomous. Keep a person at both ends of the first system.",
      ] },
      { t: "h", text: "How we scope it" },
      { t: "p", text: "A short discovery with the people who ask and answer the question. A written glossary of the terms involved. A shortlist of the source tables and the only joins allowed between them. A fixed set of real questions with agreed correct answers. Then a working prototype on real data within weeks, in front of the people who will use it. If they ask it a second question without being prompted, you have your first use case." },
    ],
    related: ["pilot-to-daily-use", "correct-answers-messy-data"],
  },
  {
    slug: "evaluating-before-users",
    kind: "ENGINEERING",
    minutes: 8,
    title: "Evaluating AI systems before they reach users",
    dek: "A fixed question set, a stage-by-stage audit, and a validator you also measure. Accuracy is a number you publish, not an adjective.",
    date: "2026-09-05",
    cover: { from: "#161a21", to: "#1670A6", glyph: "92.4%" },
    body: [
      { t: "p", text: "The assistant we run for a multi-plant manufacturer has a number attached to it: the share of real questions it answers correctly end to end. Today that is 92.4%. This is how that number is produced, why we trust it, and what we had to learn to make it mean anything." },
      { t: "h", text: "The fixed set" },
      { t: "p", text: "We maintain a fixed set of real questions gathered from the floor, each with an agreed correct answer written down with the people who own the data. Every release runs the whole set through the full pipeline, exactly as a user would, and a judge model compares each answer to the agreed one. Disagreements are reviewed by a person. Questions users flag in production are added, so the set grows towards what people actually ask." },
      { t: "h", text: "Audit the stages, not just the end" },
      { t: "p", text: "An end-to-end score tells you something is wrong. It does not tell you where. Every stage of our pipeline writes what it saw and decided into the trace: how the question was resolved, which domain it was routed to, which tables were chosen, what SQL was generated, how the validator judged it, and whether a retry happened. We aggregate those per release. The first time we did this we discovered that our biggest source of retries was not the generator at all." },
      { t: "h", text: "Measure the validator too" },
      { t: "p", text: "A second model checks every query and result against the question. It is the reason the system can say it does not know. It is also a model, and it can be wrong in both directions. We measure wrong rejects, where a correct query is sent back for another attempt, and wrong accepts, where a bad answer gets through. For a while the validator was rejecting correct queries because its rules disagreed with the generator's. Fixing that was a documentation change, and it was worth more than any model upgrade that year." },
      { t: "steps", items: [
        { title: "First-pass accuracy", body: "How often the very first query was right. This is what the user feels as speed." },
        { title: "Served-correct-first-time", body: "How often a user got a correct answer without a retry. Lower than first-pass accuracy whenever the validator wrongly rejects." },
        { title: "End-to-end accuracy", body: "How often the final answer was correct after bounded retries. The number we publish." },
        { title: "Honest refusals", body: "How often the system said it had no reliable answer, and how often it was right to." },
      ] },
      { t: "h", text: "Gates, not reports" },
      { t: "p", text: "The evaluation does not produce a report somebody might read. It produces a gate. A release that drops below the previous number does not ship. A release in which the table catalogue or the glossary is incomplete does not build. The number moves when definitions move, which is exactly when you want to be told." },
      { t: "quote", text: "If you cannot say what accuracy means for your system, you cannot say whether a change made it better." },
      { t: "p", text: "None of this is exotic. It is a test suite with a judge in it. What made it hard was agreeing on the correct answers, and what made it valuable was running it every single time." },
    ],
    related: ["correct-answers-messy-data", "human-ai-human"],
  },
  {
    slug: "three-languages-one-stream",
    kind: "ENGINEERING",
    minutes: 6,
    title: "Three languages, one stream: adding voice to a data assistant",
    dek: "How a question spoken in Tamil becomes a checked SQL answer and comes back spoken in Tamil, inside a single server-sent event stream.",
    date: "2026-08-29",
    cover: { from: "#1670A6", to: "#161a21", glyph: "SSE" },
    body: [
      { t: "p", text: "On a plant floor the natural way to ask a question is to say it, in the language you think in. For the manufacturer we work with that is Tamil, Hindi and English. The query engine itself works in English. Bridging the two without the system feeling like a translator sitting between you and the answer took two attempts." },
      { t: "h", text: "The first design: three round trips" },
      { t: "p", text: "Our first version was the obvious one. The browser sent audio to a transcription endpoint and got English text back. It sent that text to the existing query stream, unchanged, and English answer tokens streamed in. When the stream ended the browser made two more calls: translate the answer, then synthesise speech. It worked. It also felt wrong." },
      { t: "list", items: [
        "The user saw the answer appear in English and then flip to their language. The flash undermined the feeling that the system had understood them.",
        "Two extra HTTP round trips after the stream ended added seconds at the worst possible moment.",
        "The translation and speech steps lived in separate traces, so when a voice answer went wrong nobody could find all of its parts in one place.",
      ] },
      { t: "h", text: "The second design: fold it into the stream" },
      { t: "p", text: "The query request gained one field: the language the answer should come back in. When it is set, the same streamed response does more work after the answer is ready. It translates, synthesises speech, and emits translated-text and audio events on the connection that is already open. For a voice turn the English tokens are suppressed entirely and the spoken-language answer streams token by token instead. The user watches the answer type out in Tamil." },
      { t: "steps", items: [
        { title: "Capture", body: "Audio is transcribed into English and the detected language is recorded. This is the only separate request." },
        { title: "Answer", body: "The English question runs through the normal pipeline: resolve, scope, clarify, generate, execute, validate." },
        { title: "Localise", body: "Inside the same stream the answer is translated and spoken. Both steps are recorded as stages within the question's trace." },
        { title: "Render", body: "The client shows the translated narrative, the chart and the sources, and plays the audio, with no English visible." },
      ] },
      { t: "h", text: "Why this matters beyond voice" },
      { t: "p", text: "The lesson generalised. Anything that is part of answering a question belongs inside that question's request and trace. The moment a step lives somewhere else, it becomes slower for the user and invisible to the engineer. One connection, one trace, one answer." },
    ],
    related: ["pilot-to-daily-use", "evaluating-before-users"],
  },
];

export const bySlug = (slug: string) => INSIGHTS.find((i) => i.slug === slug);
export const tagOf = (i: Insight) => `${i.kind} · ${i.minutes} MIN`;
