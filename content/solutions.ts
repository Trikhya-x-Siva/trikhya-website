export type PillarId = "accelerators" | "workflows" | "domain";

export const pillars: { id: PillarId; title: string }[] = [
  { id: "accelerators", title: "Generalist AI Accelerators" },
  { id: "workflows", title: "Specialized AI Workflows" },
  { id: "domain", title: "Domain-Adapted Intelligence" },
];

export type Solution = {
  slug: string;
  pillar: PillarId;
  title: string;
  status: string;
  summary: string;
  chips: string[];
  metric: { value: string; label: string };
  facts: { label: string; value: string }[];
  pitch: string;
  stats: { value: string; label: string }[];
  problem: string;
  built: string;
  pipelineIntro: string;
  dataIntro: string;
  around: { title: string; body: string }[];
  stack: string[];
  demo: { intro: string; videoUrl: string; poster?: string };
};

export const solutions: Solution[] = [
  {
    slug: "natural-language-query",
    pillar: "domain",
    title: "Natural Language Query Agent",
    status: "In production",
    summary:
      "A natural-language query system built on the real operational data of a multi-plant insole manufacturer. It combines three live business systems into one governed warehouse, turns a question in plain words into a checked, read-only query, and answers with sources and a chart. Around it we built role dashboards, proactive alerts on WhatsApp, order capture from email, and voice in three languages.",
    chips: ["Text-to-SQL", "Sourced answers", "Charts and tables", "Follow-up questions", "Voice in 3 languages", "WhatsApp alerts", "Role dashboards"],
    metric: { value: "92.4%", label: "answers correct end to end" },
    facts: [
      { label: "Client", value: "Multi-plant insole manufacturer" },
      { label: "Data", value: "3 live systems, 1 warehouse" },
      { label: "Users", value: "Floor to country level" },
    ],
    pitch:
      "Built for a multi-plant insole manufacturer. Ask the business a question in plain words and get a checked, sourced answer with a chart, in seconds, from data that lives in three different systems.",
    stats: [
      { value: "92.4%", label: "answers correct end to end" },
      { value: "3", label: "live source systems in one warehouse" },
      { value: "3", label: "languages, by text and voice" },
      { value: "0", label: "write access: every query is read-only" },
    ],
    problem:
      "An insole manufacturer runs several plants, and its delivery, material and finance data sat in three separate systems. A question such as which orders will miss dispatch this week took three people most of a day, and the answer was stale by the time it arrived. Managers learned to stop asking.",
    built:
      "A governed warehouse that joins all three systems, and on top of it an agent that turns a plain-language question into a read-only SQL query, runs it, has a second model check the result, and writes the answer with its sources and a chart. Follow-ups keep the thread; vague questions get a clarifying prompt instead of a confident wrong answer.",
    pipelineIntro:
      "A fixed sequence of stages, not an open-ended agent loop, so the number of model calls per question is known before it runs. Three ways out early: out of scope, a clarifying question, or a cache hit.",
    dataIntro:
      "Three live business systems feed an hourly incremental ingest into a layered warehouse. A separate control-plane database holds everything the agent needs to be trustworthy: the table catalogue, the business glossary, the join registry, curated examples, users and feedback.",
    around: [
      { title: "Role dashboards", body: "Floor supervisors see today's priorities and line output. Plant heads see delivery, money and risk. Country heads see every plant at once. Built as light SQL over the gold layer, so numbers match the agent's." },
      { title: "Proactive alerts on WhatsApp", body: "Overdue and at-risk orders, material shortages, procedure breaches and pending approvals are detected on a schedule and sent to the right person with acknowledge and resolve actions in the message." },
      { title: "Order capture from email", body: "The orders mailbox is polled through the business day. A model extracts order lines from each email, and purchase orders that were never entered into the system are flagged before they become late deliveries." },
      { title: "Voice in three languages", body: "Speak the question in Tamil, Hindi or English and hear the answer back. Voice adds exactly two touch-points around the tested text pipeline, which stays unchanged." },
      { title: "Admin and governance console", body: "Users and roles, every conversation and its trace, thumbs-up and thumbs-down analytics, human-approved onboarding of new tables, and promotion of good answers into the example bank." },
      { title: "Regression harness", body: "A fixed set of real questions runs on every release, and the deployment refuses to ship if the catalogue or glossary falls below its minimum size. Accuracy is a number we report, not an adjective." },
    ],
    stack: ["Claude", "PostgreSQL + pgvector", "FastAPI", "Next.js", "Vega-Lite", "Google Cloud Run", "Langfuse", "Twilio WhatsApp"],
    demo: {
      intro: "A plant manager asks which orders are at risk this week. The agent resolves the question, runs the query, validates the result and answers with sources and a chart.",
      videoUrl: "",
    },
  },
];

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);
export const pillarTitle = (id: PillarId) => pillars.find((p) => p.id === id)?.title ?? "";
