"use client";

import { useMemo, useState, type FormEvent } from "react";
import { FIELDS, type FieldDef, type JobRow } from "@/content/hiring-fields";
import { effectiveForm, submitApplication } from "@/lib/hiring";
import { track } from "@/lib/analytics";
import { withBase } from "@/lib/paths";

const MONO = "'JetBrains Mono',monospace";
const input: React.CSSProperties = { font: "inherit", fontSize: 16, padding: "13px 14px", background: "#0E1116", border: "1px solid #2a313c", color: "#ffffff", outline: "none", width: "100%", boxSizing: "border-box", borderRadius: 0 };

type Answers = Record<string, string | number | boolean | null>;

/** The public application form. Fields come from the role's configuration; the admin decides what is asked. */
export function ApplyForm({ job, onDone, onBack }: { job: JobRow; onDone: (id: string) => void; onBack: () => void }) {
  const form = useMemo(() => effectiveForm(job), [job]);
  const fields = useMemo(() => FIELDS.filter((f) => form[f.key] !== "off"), [form]);
  const [answers, setAnswers] = useState<Answers>({});
  const [resume, setResume] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: Answers[string]) => setAnswers((a) => ({ ...a, [k]: v }));
  const groups = [...new Set(fields.map((f) => f.group))];

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr("");
    if (form.resume !== "off" && !resume) { setErr("Please attach your resume as a PDF."); return; }
    for (const q of job.questions ?? []) if (q.required && !String(answers[`q_${q.id}`] ?? "").trim()) { setErr(`Please answer: ${q.label}`); return; }
    if (!consent) { setErr("Please confirm you agree to our privacy policy."); return; }
    setBusy(true);
    try {
      let sessionId: string | null = null; try { sessionId = sessionStorage.getItem("trikhya-session"); } catch { /* ignore */ }
      const id = await submitApplication({ job, answers, resume, sessionId });
      track("job_applied", { job: job.slug });
      onDone(id);
    } catch (ex) { setErr((ex as Error).message); setBusy(false); }
  };

  const control = (f: FieldDef) => {
    const req = form[f.key] === "required";
    const common = { id: `f_${f.key}`, required: req, style: input, className: "apl-in" };
    if (f.type === "select") return (
      <select {...common} value={String(answers[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} style={{ ...input, appearance: "none" }}>
        <option value="">{req ? "Select…" : "Select (optional)"}</option>
        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
    if (f.type === "textarea") return <textarea {...common} rows={4} value={String(answers[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />;
    if (f.type === "file") return (
      <label style={{ ...input, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, cursor: "pointer", borderStyle: resume ? "solid" : "dashed", borderColor: resume ? "#4FB8EE" : "#2a313c" }}>
        <span style={{ color: resume ? "#ffffff" : "#8a94a1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resume ? `${resume.name} · ${(resume.size / 1024 / 1024).toFixed(1)} MB` : "Choose a PDF…"}</span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: "#4FB8EE", flex: "none" }}>{resume ? "CHANGE" : "BROWSE"}</span>
        <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files?.[0] ?? null)} style={{ display: "none" }} />
      </label>
    );
    return <input {...common} type={f.type === "number" ? "number" : f.type} min={f.type === "number" ? 0 : undefined} step={f.type === "number" ? "0.5" : undefined} value={String(answers[f.key] ?? "")} onChange={(e) => set(f.key, f.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)} placeholder={f.placeholder} />;
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <style>{`.apl-in:focus{border-color:#4FB8EE!important} .apl-in:-webkit-autofill{-webkit-text-fill-color:#fff;-webkit-box-shadow:0 0 0 1000px #0E1116 inset}`}</style>
      {groups.map((g) => (
        <section key={g} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#8a94a1" }}>{g.toUpperCase()}</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 14 }}>
            {fields.filter((f) => f.group === g).map((f) => (
              <label key={f.key} htmlFor={`f_${f.key}`} style={{ display: "flex", flexDirection: "column", gap: 7, gridColumn: f.type === "textarea" || f.type === "file" ? "1 / -1" : undefined }}>
                <span style={{ fontSize: 14, color: "#d4dae2" }}>{f.label}{form[f.key] === "required" ? <span style={{ color: "#4FB8EE" }}> *</span> : <span style={{ color: "#5b6370" }}> · optional</span>}</span>
                {control(f)}
                {f.hint ? <span style={{ fontSize: 12, color: "#5b6370" }}>{f.hint}</span> : null}
              </label>
            ))}
          </div>
        </section>
      ))}
      {job.questions?.length ? (
        <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#8a94a1" }}>A FEW QUESTIONS FROM THE TEAM</span>
          {job.questions.map((q) => (
            <label key={q.id} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontSize: 14, color: "#d4dae2" }}>{q.label}{q.required ? <span style={{ color: "#4FB8EE" }}> *</span> : null}</span>
              {q.type === "select" || q.type === "yesno" ? (
                <select required={q.required} value={String(answers[`q_${q.id}`] ?? "")} onChange={(e) => set(`q_${q.id}`, e.target.value)} className="apl-in" style={{ ...input, appearance: "none" }}>
                  <option value="">Select…</option>{(q.type === "yesno" ? ["Yes", "No"] : q.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : q.type === "textarea" ? <textarea required={q.required} rows={3} value={String(answers[`q_${q.id}`] ?? "")} onChange={(e) => set(`q_${q.id}`, e.target.value)} className="apl-in" style={{ ...input, resize: "vertical" }} />
                : <input required={q.required} value={String(answers[`q_${q.id}`] ?? "")} onChange={(e) => set(`q_${q.id}`, e.target.value)} className="apl-in" style={input} />}
            </label>
          ))}
        </section>
      ) : null}
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5, color: "#aab3bf", cursor: "pointer" }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 4, width: 16, height: 16, accentColor: "#4FB8EE" }} />
        <span>I agree that Trikhya stores my application and resume to assess me for this role, as described in the <a href={withBase("/privacy/")} target="_blank" rel="noopener" style={{ color: "#4FB8EE", borderBottom: "1px solid #4FB8EE" }}>privacy policy</a>. Applications are kept for up to 12 months after the role closes.</span>
      </label>
      {err ? <span role="alert" style={{ fontSize: 14, color: "#f0a35e" }}>{err}</span> : null}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button type="submit" disabled={busy} data-hover="background:#8fd3f7;" style={{ font: "inherit", fontWeight: 700, fontSize: 16, padding: "14px 26px", borderRadius: 999, border: "none", background: "#4FB8EE", color: "#0E1116", cursor: "pointer", opacity: busy ? .7 : 1 }}>{busy ? "Submitting…" : "Submit application →"}</button>
        <button type="button" onClick={onBack} style={{ font: "inherit", fontSize: 15, color: "#aab3bf", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Back to the role</button>
      </div>
    </form>
  );
}
