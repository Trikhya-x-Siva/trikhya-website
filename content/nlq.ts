/** Natural Language Query Assistant: the first solution in production.
 *  Public copy: no client, product or table names. The sector is allowed. */

export const NLQ = {
  slug: "natural-language-query",
  href: "/solutions/natural-language-query/",
  tag: "01 · B-AI-B",
  status: "In production",
  title: "Natural Language Query Assistant",
  tagline: "Ask the business a question in plain words. Get a checked, sourced answer with a chart, in seconds.",
  summary:
    "Built for a multi-plant insole manufacturer. Plant staff ask about orders, materials and finance in English, Tamil or Hindi. The assistant writes a read-only query against a governed warehouse, has a second model check the result, and answers with its sources and a chart.",
  stats: [
    { value: "92.4%", label: "answers correct end to end" },
    { value: "3", label: "live systems joined in one warehouse" },
    { value: "3", label: "languages, by text and voice" },
    { value: "0", label: "write access: every query is read-only" },
  ],
  problem: {
    lead: "A multi-plant manufacturer could not get a straight answer out of its own data.",
    body:
      "Delivery, material and finance data lived in three separate systems across several plants: an ERP, a warehouse system and an order-management system. A simple question such as which orders will miss dispatch this week took three people most of a day, passed through spreadsheets, and was stale by the time it reached the manager who asked. People learned to stop asking.",
    pains: [
      { title: "Three systems, one question", body: "Every operational question needed someone to join data by hand across the ERP, the warehouse and order management." },
      { title: "Answers arrived late", body: "By the time a report was ready the shift had changed and the at-risk order had already slipped." },
      { title: "No trust without the source", body: "A number on a slide could not be checked. Managers wanted to see which records an answer came from." },
    ],
  },
  approach: {
    lead: "Definitions first. Then a system that can be measured.",
    body:
      "Most failures we had seen in this space were not wrong SQL. They were a word that meant two things in two departments, or a join that looked valid and was not. So before any model was chosen we sat with the people who answer these questions today and wrote the rulebook down: the business glossary, the metrics, and the only joins that are allowed. The assistant reads that rulebook. It does not invent one.",
    principles: [
      { n: "01", title: "Governed, not open-ended", body: "A fixed sequence of stages rather than a free-form agent loop, so the number of model calls per question is known before it runs." },
      { n: "02", title: "Read-only by design", body: "Queries run under a database role that cannot write, against approved tables, along approved join paths, with a time budget." },
      { n: "03", title: "Checked before it is shown", body: "A second model reviews every query and result against the question. If it disagrees twice, the assistant says it has no answer." },
      { n: "04", title: "Measured on every release", body: "A fixed set of real questions runs each time we ship. Accuracy is a number we publish to the client, not an adjective." },
    ],
  },
  pipeline: {
    lead: "How a question becomes an answer.",
    body: "Nine stages, three early exits. Out of scope stops. A vague question gets a clarifying prompt instead of a confident guess. A close match in the semantic cache replays a known-good query, still executed fresh and still validated.",
    steps: [
      { title: "Normalise and resolve", body: "The wording is cleaned deterministically. A follow-up such as “and last month?” becomes a standalone question using the earlier turns." },
      { title: "Scope and route", body: "The question is scored for scope and assigned a business domain. Out-of-scope questions are answered honestly and stopped." },
      { title: "Clarity check", body: "If a metric, a time range or a reference is missing, the assistant asks “did you mean…?” before anything runs." },
      { title: "Semantic cache", body: "Curated past answers are embedded and searched. A close match replays its query, which is still executed and validated." },
      { title: "Select tables and generate", body: "At most eight approved tables, joined only along hand-written join paths, with curated examples in the prompt." },
      { title: "Execute read-only", body: "Under a role that cannot write, with a per-question time budget." },
      { title: "Validate", body: "A second model judges query and result against the question. A rejection sends the exact failure and the previous query back into generation." },
      { title: "Retry, bounded", body: "Two attempts, with a third only if the table set changed. The same rejection twice stops the loop. No answer beats a bad one." },
      { title: "Insight and chart", body: "The narrative streams word by word while the chart or table is planned. The answer carries its sources and a trace id." },
    ],
  },
  data: {
    lead: "Where the data comes from and where answers go.",
    body: "Three live business systems feed an hourly incremental ingest into a layered warehouse. A separate control-plane database holds what makes the assistant trustworthy: the table catalogue, the business glossary, the join registry, curated examples, users and feedback.",
  },
  outcome: {
    lead: "What changed on the floor.",
    points: [
      { title: "A sourced answer in seconds", body: "Plant heads open the day with a live picture of delivery and risk instead of a spreadsheet request." },
      { title: "The system says no", body: "When it cannot verify an answer it says so, rather than serving a plausible wrong one. That is why people trust the ones it does give." },
      { title: "Three languages, one pipeline", body: "Tamil, Hindi and English, by voice or text, on top of the same tested query path." },
    ],
  },
  around: [
    { title: "Role dashboards", body: "Floor supervisors see today’s priorities and line output. Plant heads see delivery, money and risk. Country heads see every plant at once." },
    { title: "Proactive alerts on WhatsApp", body: "Overdue and at-risk orders, material shortages and pending approvals reach the right person with acknowledge and resolve actions in the message." },
    { title: "Order capture from email", body: "The orders mailbox is read continuously. Purchase orders that were emailed but never entered are flagged before they become late deliveries." },
    { title: "Voice in three languages", body: "Speak the question, hear the answer. Voice adds two touch-points around the tested text pipeline, which stays unchanged." },
    { title: "Admin and governance console", body: "Users and roles, every conversation traced, feedback analytics, human-approved onboarding of new tables and example answers." },
    { title: "Regression harness", body: "A fixed question set runs on every release, and deployment refuses to ship if the catalogue or glossary falls below its minimum size." },
  ],
  stack: ["Claude", "PostgreSQL + pgvector", "FastAPI", "Next.js", "Vega-Lite", "Google Cloud Run", "Langfuse", "Twilio WhatsApp"],
};
