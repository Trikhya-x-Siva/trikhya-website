/** The application form catalogue. Modelled on what Naukri, LinkedIn, Indeed and Workday ask.
 *  An admin decides per role whether each field is required, optional or off. */

export type FieldMode = "required" | "optional" | "off";
export type FieldType = "text" | "email" | "tel" | "url" | "number" | "select" | "textarea" | "file" | "checkbox" | "date";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  group: "Identity" | "Location" | "Experience" | "Compensation" | "Education" | "Links" | "Documents" | "Other";
  hint?: string;
  options?: string[];
  placeholder?: string;
  locked?: boolean; // always required, cannot be switched off
};

export const FIELDS: FieldDef[] = [
  { key: "name", label: "Full name", type: "text", group: "Identity", locked: true, placeholder: "As on your official documents" },
  { key: "email", label: "Email", type: "email", group: "Identity", locked: true },
  { key: "phone", label: "Phone", type: "tel", group: "Identity", placeholder: "+91 …" },
  { key: "current_location", label: "Current location", type: "text", group: "Location", placeholder: "City, Country" },
  { key: "preferred_location", label: "Preferred location", type: "select", group: "Location", options: ["Chennai", "Remote · India", "Client site", "Flexible"] },
  { key: "relocate", label: "Willing to relocate", type: "select", group: "Location", options: ["Yes", "No", "Depends on the role"] },
  { key: "total_experience", label: "Total experience (years)", type: "number", group: "Experience" },
  { key: "relevant_experience", label: "Relevant experience (years)", type: "number", group: "Experience" },
  { key: "current_company", label: "Current or last company", type: "text", group: "Experience" },
  { key: "current_title", label: "Current or last designation", type: "text", group: "Experience" },
  { key: "notice_period", label: "Notice period", type: "select", group: "Experience", options: ["Immediate", "15 days", "30 days", "60 days", "90 days", "Serving notice"] },
  { key: "employment_type", label: "Looking for", type: "select", group: "Experience", options: ["Full-time", "Contract", "Internship", "Open to any"] },
  { key: "current_ctc", label: "Current CTC (₹ lakh per year)", type: "number", group: "Compensation" },
  { key: "expected_ctc", label: "Expected CTC (₹ lakh per year)", type: "number", group: "Compensation" },
  { key: "highest_education", label: "Highest education", type: "select", group: "Education", options: ["Diploma", "Bachelor's", "Master's", "PhD", "Other"] },
  { key: "field_of_study", label: "Field of study", type: "text", group: "Education" },
  { key: "institution", label: "Institution", type: "text", group: "Education" },
  { key: "graduation_year", label: "Graduation year", type: "number", group: "Education" },
  { key: "skills", label: "Key skills", type: "text", group: "Experience", hint: "Comma separated", placeholder: "Python, SQL, PostgreSQL" },
  { key: "languages", label: "Languages you speak", type: "text", group: "Other", hint: "Comma separated", placeholder: "English, Tamil, Hindi" },
  { key: "linkedin", label: "LinkedIn profile", type: "url", group: "Links", placeholder: "https://www.linkedin.com/in/…" },
  { key: "portfolio", label: "Portfolio or GitHub", type: "url", group: "Links" },
  { key: "resume", label: "Resume (PDF)", type: "file", group: "Documents", locked: true, hint: "PDF, up to 10 MB" },
  { key: "cover_letter", label: "Why this role?", type: "textarea", group: "Documents", hint: "A few sentences is enough" },
  { key: "work_authorisation", label: "Authorised to work in India", type: "select", group: "Other", options: ["Yes", "Need sponsorship", "Not applicable"] },
  { key: "available_from", label: "Earliest start date", type: "date", group: "Other" },
  { key: "source", label: "How did you hear about us?", type: "select", group: "Other", options: ["LinkedIn", "Naukri", "Referral", "Trikhya website", "Other"] },
  { key: "referrer", label: "Referred by (if any)", type: "text", group: "Other" },
];

export type FormConfig = Record<string, FieldMode>;

/** A sensible default: the essentials required, the usual portal fields optional, the rest off. */
export const DEFAULT_FORM: FormConfig = Object.fromEntries(FIELDS.map((f) => [f.key,
  f.locked ? "required"
    : ["phone", "current_location", "total_experience", "notice_period", "linkedin"].includes(f.key) ? "required"
    : ["current_company", "current_title", "expected_ctc", "highest_education", "skills", "cover_letter", "portfolio", "source"].includes(f.key) ? "optional"
    : "off"])) as FormConfig;

/** Extra, role-specific questions written by the admin. */
export type Question = { id: string; label: string; type: "text" | "textarea" | "select" | "yesno"; required: boolean; options?: string[] };

export type Criteria = {
  min_education: string | null;       // Diploma, Bachelor's, Master's, PhD
  min_experience_years: number;
  required_languages: string[];
  must_have_skills: string[];
  good_to_have_skills: string[];
};

export const EMPTY_CRITERIA: Criteria = { min_education: null, min_experience_years: 0, required_languages: [], must_have_skills: [], good_to_have_skills: [] };

/** Database shape of a role. content/jobs.ts remains the seed for the first four. */
export type JobRow = {
  id: string;
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  experience: string;
  level: number;
  posted: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  status: "draft" | "open" | "closed" | "archived";
  criteria: Criteria;
  form: FormConfig;
  questions: Question[];
  created_at?: string;
  updated_at?: string;
};

export type ApplicationRow = {
  id: string;
  job_id: string;
  created_at: string;
  candidate_name: string;
  email: string;
  phone: string | null;
  answers: Record<string, string | number | boolean | null>;
  resume_path: string | null;
  status: "new" | "screening" | "screened" | "shortlisted" | "rejected" | "failed";
  parsed: Record<string, unknown> | null;
  score: number | null;
  breakdown: Record<string, unknown> | null;
  rationale: string | null;
  must_have_pass: boolean | null;
  screened_at: string | null;
  screen_error: string | null;
  notes: string | null;
};
