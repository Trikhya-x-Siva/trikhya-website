/** Roles live in the database (admin → Careers → hiring management). This list is the fallback shown when it cannot be reached: empty, so no role is ever advertised by mistake. */

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

export const APPLY_EMAIL = "connect@trikhya.ai";

export const JOBS: Job[] = [];
