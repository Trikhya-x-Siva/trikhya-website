"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { JOBS } from "@/content/jobs";
import { DEFAULT_FORM, EMPTY_CRITERIA, type ApplicationRow, type JobRow } from "@/content/hiring-fields";

/** The four seed roles as database rows, used until Supabase answers or if it is not configured. */
export const SEED_JOBS: JobRow[] = JOBS.map((j) => ({
  id: j.id, slug: j.id, title: j.title, team: j.team, location: j.location, type: j.type, experience: j.experience, level: j.level, posted: j.posted,
  summary: j.summary, responsibilities: j.responsibilities, requirements: j.requirements, nice_to_have: j.niceToHave, status: "open", criteria: EMPTY_CRITERIA, form: DEFAULT_FORM, questions: [],
}));

export function effectiveForm(job: JobRow) { return { ...DEFAULT_FORM, ...(job.form ?? {}) }; }

/** Open roles for the public careers page. */
export function useOpenJobs() {
  const [jobs, setJobs] = useState<JobRow[]>(SEED_JOBS);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const sb = supabase(); if (!sb) return;
    sb.from("jobs").select("*").eq("status", "open").order("posted", { ascending: false }).then(({ data, error }) => {
      if (!error && data) { setJobs(data as JobRow[]); setLive(true); }
    });
  }, []);
  return { jobs, live };
}

export type SubmitInput = { job: JobRow; answers: Record<string, string | number | boolean | null>; resume: File | null; sessionId: string | null };

/** Upload the resume, insert the application, then ask the screener to run. Returns the application id. */
export async function submitApplication({ job, answers, resume, sessionId }: SubmitInput): Promise<string> {
  const sb = supabase(); if (!sb) throw new Error("Applications are not available right now. Please try again later.");
  const id = crypto.randomUUID();
  let resume_path: string | null = null;
  if (resume) {
    if (resume.type !== "application/pdf") throw new Error("Please upload your resume as a PDF.");
    if (resume.size > 10 * 1024 * 1024) throw new Error("The resume must be 10 MB or smaller.");
    resume_path = `applications/${job.id}/${id}.pdf`;
    const { error } = await sb.storage.from("resumes").upload(resume_path, resume, { contentType: "application/pdf", upsert: false });
    if (error) throw new Error(`Could not upload the resume: ${error.message}`);
  }
  const row = {
    id, job_id: job.id, candidate_name: String(answers.name ?? ""), email: String(answers.email ?? ""), phone: answers.phone ? String(answers.phone) : null,
    answers, resume_path, session_id: sessionId,
  };
  const { error } = await sb.from("applications").insert(row);
  if (error) throw new Error(`Could not submit the application: ${error.message}`);
  // Fire and forget: screening runs server-side. The admin sees the score when it lands.
  sb.functions.invoke("screen-application", { body: { application_id: id } }).catch(() => undefined);
  return id;
}

export type { ApplicationRow };
