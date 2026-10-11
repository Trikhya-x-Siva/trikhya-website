import { NLQ } from "./nlq";
import { TRAINING } from "./training";
import { HIRING } from "./hiring";
import type { VideoSpec } from "@/components/solutions/SolutionVideo";

/** Shape every solution page and card reads. Public copy: no client, product or table names. The sector is allowed. */
export type Solution = {
  slug: string;
  href: string;
  tag: string;
  status: string;
  title: string;
  /** Hero headline split in two: plain words, then the ice-coloured tail. */
  heroTitle: [string, string];
  tagline: string;
  summary: string;
  stats: { value: string; label: string }[];
  problem: { lead: string; body: string; pains: { title: string; body: string }[] };
  built: { lead: string; extra: string };
  approach: { lead: string; body: string; principles: { n: string; title: string; body: string }[] };
  pipeline: { lead: string; body: string; steps: { title: string; body: string }[] };
  data?: { lead: string; body: string };
  outcome: { lead: string; headline?: { value: string; body: string }; points: { title: string; body: string }[] };
  around?: { lead: string; items: { title: string; body: string }[] };
  stack: string[];
  /** A recording of the real product. When set, it replaces the animated demo panel on the page and the cards. */
  video?: VideoSpec;
};

export const SOLUTIONS: Solution[] = [NLQ, TRAINING, HIRING];
