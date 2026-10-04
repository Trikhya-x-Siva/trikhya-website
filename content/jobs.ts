/** Open roles. Location, experience and dates are placeholders until HR confirms them. */

export type Job = {
  id: string;
  title: string;
  team: "Engineering" | "Delivery" | "Product";
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  experience: string;
  level: number; // for sorting: 1 junior … 4 lead
  posted: string; // ISO date
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

export const APPLY_EMAIL = "careers@trikhya.ai";

export const JOBS: Job[] = [
  {
    id: "ai-engineer",
    title: "AI Engineer",
    team: "Engineering",
    location: "Chennai, India · Hybrid",
    type: "Full-time",
    experience: "3–6 years",
    level: 2,
    posted: "2026-09-28",
    summary: "Build the intelligence layer of production systems: retrieval, generation, validation and evaluation over real business data.",
    responsibilities: [
      "Design and ship staged LLM pipelines with predictable cost, guardrails and a validator in the loop.",
      "Write and maintain the evaluation harness that runs on every release, and own the accuracy number it reports.",
      "Work with the data team on glossaries, metric definitions and the join registry the models read from.",
      "Trace, read and fix real failures from production conversations every week.",
    ],
    requirements: [
      "Strong Python and SQL, with production experience behind an API.",
      "Hands-on with at least one LLM provider in a shipped product, including prompt design and structured outputs.",
      "Comfort reading messy enterprise data and asking the people who own it what it means.",
      "Clear written English; you will document decisions for clients.",
    ],
    niceToHave: ["Vector search (pgvector or similar)", "Observability tooling such as Langfuse or OpenTelemetry", "Tamil or Hindi"],
  },
  {
    id: "forward-deployed-engineer",
    title: "Forward-Deployed Engineer",
    team: "Delivery",
    location: "Chennai, India · On site with clients",
    type: "Full-time",
    experience: "4–8 years",
    level: 3,
    posted: "2026-09-21",
    summary: "Sit with the client, frame the problem, and carry a system from discovery through rollout until it is part of how they work.",
    responsibilities: [
      "Run discovery: interviews, data review and the shortlist of problems worth solving.",
      "Prototype on the client's real data within weeks and put it in front of the people who will use it.",
      "Own integration with ERPs, warehouses and messaging channels, and the rollout plan behind it.",
      "Translate between plant managers, finance and engineers without losing meaning in either direction.",
    ],
    requirements: [
      "Shipped software inside at least one enterprise rollout, ideally manufacturing, logistics or finance.",
      "Fluent with APIs, SQL and at least one backend language; you can build, not only coordinate.",
      "Comfortable presenting to leadership and standing on a plant floor in the same week.",
      "Willing to travel to client sites.",
    ],
    niceToHave: ["ERP or WMS integration experience", "Change-management or training experience", "Tamil or Hindi"],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    team: "Engineering",
    location: "Chennai, India · Hybrid",
    type: "Full-time",
    experience: "2–5 years",
    level: 2,
    posted: "2026-09-14",
    summary: "Build and run the governed warehouse the assistants reason over: ingest, layered models, metadata and quality checks.",
    responsibilities: [
      "Build incremental ingest from source systems such as ERPs, warehouse systems and order management.",
      "Model bronze, silver and gold layers that are correct, documented and fast enough to query interactively.",
      "Maintain the metadata catalogue, glossary and join registry that the AI layer depends on.",
      "Write the deploy gates that refuse to ship when the catalogue or glossary is incomplete.",
    ],
    requirements: [
      "Strong SQL and PostgreSQL in production, including performance work.",
      "Python for pipelines, with tests.",
      "Experience with incremental loads, watermarks and schema change in the wild.",
      "Care for naming, documentation and definitions.",
    ],
    niceToHave: ["Cloud SQL or managed Postgres on GCP", "dbt or similar modelling tools", "Experience with SQL Server sources"],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    team: "Product",
    location: "Remote · India",
    type: "Full-time",
    experience: "3–7 years",
    level: 2,
    posted: "2026-09-07",
    summary: "Design the surfaces people actually use: chat and voice assistants, role dashboards and alerts that land on a phone during a shift.",
    responsibilities: [
      "Design interfaces for plant supervisors, managers and country heads, each with different time and attention.",
      "Make answers trustworthy on screen: sources, confidence, and what to do next.",
      "Prototype quickly, test with real users on site, and ship with engineers in the same sprint.",
      "Own the design system across web, WhatsApp and voice touch-points.",
    ],
    requirements: [
      "A portfolio of shipped B2B or operational products, not only concepts.",
      "Fluency in Figma and in handing off to React engineers.",
      "Evidence of user research with non-technical users.",
      "Strong typography and information design.",
    ],
    niceToHave: ["Data visualisation", "Conversational or voice UI", "Motion design"],
  },
];
