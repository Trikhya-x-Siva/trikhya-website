// Mechanical resume scoring. Ported from the SparkMinda hiring module, with the education ladder
// adapted to the labels the role editor offers (Diploma, Bachelor's, Master's, PhD).

export type ParsedResume = {
  name: string | null; email: string | null; phone: string | null;
  education: { degree: string; field: string | null; year: number | null; institution: string | null }[];
  experience: { company: string; role: string; years: number; summary: string }[];
  total_experience_years: number;
  skills: string[];
  languages: { name: string; read: boolean; write: boolean }[];
};

export type Criteria = { min_education: string | null; min_experience_years: number; required_languages: string[]; must_have_skills: string[]; good_to_have_skills: string[] };

const SYNONYMS: Record<string, string[]> = {
  "javascript": ["js", "java script", "ecmascript"], "typescript": ["ts"], "react": ["reactjs", "react.js", "next.js", "nextjs"], "node": ["nodejs", "node.js"],
  "machine learning": ["ml"], "llm": ["large language model", "large language models", "gpt", "claude", "openai", "anthropic", "gemini", "generative ai", "genai", "rag"],
  "postgresql": ["postgres", "psql", "pgvector"], "sql": ["postgresql", "mysql", "sql server", "t-sql", "pl/sql", "bigquery", "snowflake"], "python": ["py"],
  "apis": ["api", "rest", "rest api", "restful", "fastapi", "graphql"], "figma": ["figma design"], "user research": ["ux research", "usability testing", "user interviews"],
  "gcp": ["google cloud", "google cloud platform", "cloud run", "bigquery"], "erp": ["sap", "oracle erp", "dynamics 365", "tally"], "manufacturing": ["plant", "factory", "shop floor", "production"],
};

const norm = (s: string) => s.toLowerCase().trim().replace(/[._-]/g, " ").replace(/\s+/g, " ");
function expand(s: string) {
  const n = norm(s); const out = new Set([n]);
  for (const [canon, alts] of Object.entries(SYNONYMS)) if (n === canon || alts.includes(n)) { out.add(canon); alts.forEach((a) => out.add(a)); }
  return out;
}
export function skillMatches(want: string, have: string[]) {
  const w = expand(want);
  for (const h of have) { const c = expand(h); for (const a of w) for (const b of c) if (a === b || (a.length > 2 && b.includes(a)) || (b.length > 2 && a.includes(b))) return true; }
  return false;
}

const RANK: [RegExp, number][] = [
  [/ph\.?d|doctor/i, 5],
  [/m\.?tech|m\.?e\b|m\.?sc|mba|master|pgdm|m\.?com|m\.?a\b|mca/i, 4],
  [/b\.?tech|b\.?e\b|b\.?sc|bachelor|b\.?com|bba|b\.?a\b|bca|engineering degree/i, 3],
  [/diploma|polytechnic/i, 2],
  [/iti|12th|hsc|intermediate/i, 1],
];
export function educationRank(s: string | null) { if (!s) return 0; for (const [re, r] of RANK) if (re.test(s)) return r; return 0; }
export function topEducation(ed: ParsedResume["education"]) { let best: string | null = null, br = -1; for (const e of ed) { const r = educationRank(e.degree); if (r > br) { br = r; best = e.degree; } } return best; }

export function score(parsed: ParsedResume, c: Criteria) {
  const mustM = c.must_have_skills.filter((s) => skillMatches(s, parsed.skills)), mustX = c.must_have_skills.filter((s) => !skillMatches(s, parsed.skills));
  const mustCov = c.must_have_skills.length ? mustM.length / c.must_have_skills.length : 1;
  const goodM = c.good_to_have_skills.filter((s) => skillMatches(s, parsed.skills)), goodX = c.good_to_have_skills.filter((s) => !skillMatches(s, parsed.skills));
  const goodCov = c.good_to_have_skills.length ? goodM.length / c.good_to_have_skills.length : 0;
  const top = topEducation(parsed.education); const eduOk = educationRank(c.min_education) === 0 || educationRank(top) >= educationRank(c.min_education);
  const yrs = parsed.total_experience_years || 0, req = c.min_experience_years || 0; const expOk = yrs >= req;
  const have = parsed.languages.filter((l) => l.read && l.write).map((l) => l.name.toLowerCase());
  const langM = c.required_languages.filter((l) => have.some((h) => h.includes(l.toLowerCase()) || l.toLowerCase().includes(h)));
  const langX = c.required_languages.filter((l) => !langM.includes(l)); const langOk = !c.required_languages.length || !langX.length;
  const total = Math.round(100 * (0.4 * mustCov + 0.2 * goodCov + 0.2 * (expOk ? 1 : Math.max(0, req > 0 ? yrs / req : 1)) + 0.1 * (eduOk ? 1 : 0) + 0.1 * (c.required_languages.length ? langM.length / c.required_languages.length : 1)));
  return {
    score: total, must_have_pass: mustCov === 1 && eduOk && expOk && langOk,
    breakdown: {
      must_haves: { matched: mustM, missing: mustX, coverage: mustCov },
      good_to_haves: { matched: goodM, missing: goodX, coverage: goodCov },
      education: { matched: eduOk, candidate_top: top, required: c.min_education },
      experience: { matched: expOk, candidate_years: yrs, required_years: req },
      languages: { matched: langM, missing: langX, all_covered: langOk },
    },
  };
}

export function normaliseParsed(raw: unknown): ParsedResume {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);
  return {
    name: str(r.name), email: str(r.email), phone: str(r.phone),
    education: arr(r.education).map((e) => { const o = (e ?? {}) as Record<string, unknown>; return { degree: str(o.degree) ?? "Unknown", field: str(o.field), year: Number(o.year) || null, institution: str(o.institution) }; }),
    experience: arr(r.experience).map((e) => { const o = (e ?? {}) as Record<string, unknown>; return { company: str(o.company) ?? "", role: str(o.role) ?? "", years: num(o.years), summary: str(o.summary) ?? "" }; }),
    total_experience_years: num(r.total_experience_years),
    skills: arr(r.skills).map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean),
    languages: arr(r.languages).map((l) => { const o = (l ?? {}) as Record<string, unknown>; return { name: str(o.name) ?? "", read: o.read !== false, write: o.write !== false }; }).filter((l) => l.name),
  };
}
