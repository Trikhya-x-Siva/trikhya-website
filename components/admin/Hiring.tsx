"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FIELDS, DEFAULT_FORM, EMPTY_CRITERIA, type ApplicationRow, type Criteria, type FieldMode, type FormConfig, type JobRow, type Question } from "@/content/hiring-fields";
import { C, Empty, fmt, Kpi, Label, MONO, Panel, Pill, Table } from "./ui";

const input: React.CSSProperties = { font: "inherit", fontSize: 15, padding: "11px 13px", background: C.bg, border: `1px solid ${C.line}`, color: C.ink, outline: "none", width: "100%", boxSizing: "border-box", borderRadius: 0 };
const btn: React.CSSProperties = { font: "inherit", fontWeight: 700, fontSize: 15, padding: "11px 20px", borderRadius: 999, border: "none", background: C.sky, color: C.bg, cursor: "pointer" };
const grid = (min: number): React.CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 20 });
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const STATUS_COLOR: Record<string, string> = { draft: C.dim, open: C.green, closed: C.amber, archived: "#5b6370" };
type Interview = { id: string; application_id: string; status: string; transcript: { role: string; text: string; ts?: string }[]; summary: string | null; score: number | null; duration_seconds: number | null; error: string | null; created_at: string; started_at: string | null; ended_at: string | null };
const IV_COLOR: Record<string, string> = { queued: C.dim, initiating: C.sky, ringing: C.sky, in_progress: C.sky, completed: C.green, failed: "#ef6b6b", no_answer: C.amber };
async function startInterviews(ids: string[]) {
  const { data, error } = await supabase()!.functions.invoke("start-interview", { body: { application_ids: ids } });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as { configured: boolean; results: { application_id: string; status: string; error?: string }[] };
}
const APP_COLOR: Record<string, string> = { new: C.ice, screening: C.sky, screened: C.ink, shortlisted: C.green, rejected: C.amber, failed: "#ef6b6b" };

type Counts = Record<string, { total: number; shortlisted: number; new_count: number; failed: number }>;

/** Hiring management: roles, their application forms and criteria, and every application with its screening. */
export function Hiring({ onBack }: { onBack: () => void }) {
  const [jobs, setJobs] = useState<JobRow[] | null>(null);
  const [counts, setCounts] = useState<Counts>({});
  const [editing, setEditing] = useState<JobRow | "new" | null>(null);
  const [viewing, setViewing] = useState<JobRow | null>(null);
  const [err, setErr] = useState("");

  const load = () => {
    const sb = supabase()!;
    sb.from("jobs").select("*").order("posted", { ascending: false }).then(({ data, error }) => { if (error) setErr(error.message); else setJobs(data as JobRow[]); });
    sb.from("applications").select("job_id, status").then(({ data }) => {
      const m: Counts = {};
      (data ?? []).forEach((r: { job_id: string; status: string }) => {
        const c = m[r.job_id] ?? (m[r.job_id] = { total: 0, shortlisted: 0, new_count: 0, failed: 0 });
        c.total++; if (r.status === "shortlisted") c.shortlisted++; if (r.status === "failed") c.failed++; if (!["shortlisted", "rejected"].includes(r.status)) c.new_count++;
      });
      setCounts(m);
    });
  };
  useEffect(load, []);

  if (editing) return <RoleEditor job={editing === "new" ? null : editing} onDone={() => { setEditing(null); load(); }} />;
  if (viewing) return <Applications job={viewing} onBack={() => { setViewing(null); load(); }} />;

  const totals = Object.values(counts).reduce((t, c) => ({ total: t.total + c.total, shortlisted: t.shortlisted + c.shortlisted, new_count: t.new_count + c.new_count, failed: t.failed + c.failed }), { total: 0, shortlisted: 0, new_count: 0, failed: 0 });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Pill onClick={onBack}>← Analytics</Pill>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>Hiring management</span>
        </div>
        <button type="button" onClick={() => setEditing("new")} style={btn}>+ New role</button>
      </div>
      <div style={grid(200)}>
        <Kpi label="Open roles" value={fmt((jobs ?? []).filter((j) => j.status === "open").length)} sub={`${(jobs ?? []).length} roles in total`} />
        <Kpi label="Applications" value={fmt(totals.total)} />
        <Kpi label="Awaiting review" value={fmt(totals.new_count)} accent={totals.new_count ? C.sky : undefined} sub={totals.failed ? `${totals.failed} with a screening error` : "not yet shortlisted or rejected"} />
        <Kpi label="Shortlisted" value={fmt(totals.shortlisted)} accent={C.green} />
      </div>
      {err ? <Panel><Empty text={`Could not load roles: ${err}. Has migration 0003 been run?`} /></Panel> : null}
      <style>{`.adm-row-card:hover{background:rgba(255,255,255,.03)}`}</style>
      <Panel title="Roles" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>OPEN A ROLE TO REVIEW ITS CANDIDATES</span>}>
        {!jobs ? <Empty text="Loading…" /> : !jobs.length ? <Empty text="No roles yet. Create the first one." /> : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {jobs.map((j) => {
              const c = counts[j.id];
              return (
                <div key={j.id} onClick={() => setViewing(j)} className="adm-row-card" style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1.4fr) repeat(3, 90px) auto", alignItems: "center", gap: 16, padding: "14px 10px", borderBottom: `1px solid ${C.line}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                    <span style={{ fontSize: 17, fontWeight: 700 }}>{j.title}</span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{j.team.toUpperCase()} · {j.type.toUpperCase()} · POSTED {j.posted}</span>
                  </div>
                  <span style={{ fontSize: 14, color: C.mid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.location} · {j.experience}</span>
                  <Stat n={c?.total ?? 0} label="applied" />
                  <Stat n={c?.new_count ?? 0} label={c?.failed ? "to review · !" : "to review"} color={c?.new_count ? (c?.failed ? C.amber : C.sky) : undefined} />
                  <Stat n={c?.shortlisted ?? 0} label="shortlist" color={C.green} />
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: STATUS_COLOR[j.status], border: `1px solid ${STATUS_COLOR[j.status]}`, padding: "4px 10px", borderRadius: 999 }}>{j.status.toUpperCase()}</span>
                    <Pill on onClick={() => setViewing(j)}>Candidates{c?.total ? ` · ${c.total}` : ""}</Pill>
                    <Pill onClick={() => setEditing(j)}>Edit</Pill>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </>
  );
}

function Stat({ n, label, color }: { n: number; label: string; color?: string }) {
  return <span style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontFamily: MONO, fontSize: 18, color: color ?? C.ink }}>{n}</span><span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".1em", color: C.dim }}>{label.toUpperCase()}</span></span>;
}

// ───────────────────────── Role editor ─────────────────────────

const BLANK: JobRow = { id: "", slug: "", title: "", team: "Engineering", location: "Chennai, India · Hybrid", type: "Full-time", experience: "", level: 2, posted: new Date().toISOString().slice(0, 10), summary: "", responsibilities: [], requirements: [], nice_to_have: [], status: "draft", criteria: EMPTY_CRITERIA, form: {}, questions: [] };

function RoleEditor({ job, onDone }: { job: JobRow | null; onDone: () => void }) {
  const [j, setJ] = useState<JobRow>(job ?? BLANK);
  const [tab, setTab] = useState<"Details" | "Criteria" | "Application form" | "Questions">("Details");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const form: FormConfig = useMemo(() => ({ ...DEFAULT_FORM, ...(j.form ?? {}) }), [j.form]);
  const set = <K extends keyof JobRow>(k: K, v: JobRow[K]) => setJ((x) => ({ ...x, [k]: v }));
  const setC = <K extends keyof Criteria>(k: K, v: Criteria[K]) => setJ((x) => ({ ...x, criteria: { ...EMPTY_CRITERIA, ...x.criteria, [k]: v } }));

  const save = async (status?: JobRow["status"]) => {
    setBusy(true); setMsg("");
    const row = { ...j, status: status ?? j.status, slug: j.slug || slugify(j.title), form, criteria: { ...EMPTY_CRITERIA, ...j.criteria } };
    const { id, created_at, updated_at, ...data } = row; void created_at; void updated_at;
    const sb = supabase()!;
    const res = id ? await sb.from("jobs").update(data).eq("id", id) : await sb.from("jobs").insert(data);
    setBusy(false);
    if (res.error) setMsg(res.error.message.includes("duplicate") ? "A role with that URL slug already exists." : res.error.message); else onDone();
  };
  const remove = async () => {
    if (!j.id || !confirm(`Archive "${j.title}"? It disappears from the site; applications are kept.`)) return;
    await save("archived");
  };

  const lines = (label: string, key: "responsibilities" | "requirements" | "nice_to_have") => (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, color: C.mid }}>{label} <span style={{ color: C.dim }}>· one per line</span></span>
      <textarea rows={5} value={j[key].join("\n")} onChange={(e) => set(key, e.target.value.split("\n"))} onBlur={(e) => set(key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} className="adm-in" style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />
    </label>
  );
  const chips = (label: string, key: "required_languages" | "must_have_skills" | "good_to_have_skills", hint: string) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, color: C.mid }}>{label} <span style={{ color: C.dim }}>· {hint}</span></span>
      <input value={(j.criteria?.[key] ?? []).join(", ")} onChange={(e) => setC(key, e.target.value.split(","))} onBlur={(e) => setC(key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="adm-in" style={input} />
    </label>
  );
  const text = (label: string, key: "title" | "team" | "location" | "type" | "experience" | "slug" | "posted", hint?: string) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, color: C.mid }}>{label}{hint ? <span style={{ color: C.dim }}> · {hint}</span> : null}</span>
      <input value={String(j[key] ?? "")} onChange={(e) => set(key, e.target.value as never)} className="adm-in" style={input} type={key === "posted" ? "date" : "text"} />
    </label>
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Pill onClick={onDone}>← Roles</Pill>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>{job ? `Edit · ${job.title}` : "New role"}</span>
          {job ? <span style={{ fontFamily: MONO, fontSize: 11, color: STATUS_COLOR[j.status], border: `1px solid ${STATUS_COLOR[j.status]}`, padding: "4px 10px", borderRadius: 999 }}>{j.status.toUpperCase()}</span> : null}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {j.status !== "open" ? <button type="button" disabled={busy || !j.title} onClick={() => save("open")} style={btn}>Save and publish</button> : <button type="button" disabled={busy} onClick={() => save("closed")} style={{ ...btn, background: C.amber }}>Close role</button>}
          <button type="button" disabled={busy || !j.title} onClick={() => save()} style={{ ...btn, background: "transparent", color: C.ink, border: `1px solid ${C.line}` }}>{busy ? "Saving…" : j.status === "open" ? "Save changes" : "Save as draft"}</button>
          {job && j.status !== "archived" ? <Pill onClick={remove}>Archive</Pill> : null}
        </div>
      </div>
      {msg ? <span style={{ fontSize: 14, color: C.amber }}>{msg}</span> : null}
      <nav style={{ display: "flex", gap: 24, borderBottom: `1px solid ${C.line}` }}>
        {(["Details", "Criteria", "Application form", "Questions"] as const).map((t) => <button key={t} className="adm-tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>)}
      </nav>

      {tab === "Details" ? (
        <div style={grid(420)}>
          <Panel title="The role">
            {text("Title", "title")}
            <div style={grid(180)}>{text("Team", "team")}{text("Type", "type", "Full-time, Contract, Internship")}</div>
            <div style={grid(180)}>{text("Location", "location")}{text("Experience", "experience", "e.g. 3–6 years")}</div>
            <div style={grid(180)}>{text("Posted on", "posted")}{text("URL slug", "slug", j.slug ? "" : `auto: ${slugify(j.title) || "…"}`)}</div>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: C.mid }}>Seniority for sorting <span style={{ color: C.dim }}>· 1 junior, 4 lead</span></span>
              <select value={j.level} onChange={(e) => set("level", Number(e.target.value))} className="adm-in" style={{ ...input, appearance: "none" }}>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}</select>
            </label>
          </Panel>
          <Panel title="What candidates read">
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: C.mid }}>Summary <span style={{ color: C.dim }}>· one or two sentences</span></span>
              <textarea rows={3} value={j.summary} onChange={(e) => set("summary", e.target.value)} className="adm-in" style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />
            </label>
            {lines("What you will do", "responsibilities")}
            {lines("What we are looking for", "requirements")}
            {lines("Nice to have", "nice_to_have")}
          </Panel>
        </div>
      ) : null}

      {tab === "Criteria" ? (
        <div style={grid(420)}>
          <Panel title="Qualifying criteria">
            <span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>The screener reads each resume and checks it against these. Must-have skills, minimum experience, minimum education and required languages are hard filters. Good-to-have skills add to the score.</span>
            <div style={grid(180)}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.mid }}>Minimum education</span>
                <select value={j.criteria?.min_education ?? ""} onChange={(e) => setC("min_education", e.target.value || null)} className="adm-in" style={{ ...input, appearance: "none" }}>
                  <option value="">Any</option>{["Diploma", "Bachelor's", "Master's", "PhD"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.mid }}>Minimum experience (years)</span>
                <input type="number" min={0} step={0.5} value={j.criteria?.min_experience_years ?? 0} onChange={(e) => setC("min_experience_years", Number(e.target.value))} className="adm-in" style={input} />
              </label>
            </div>
            {chips("Must-have skills", "must_have_skills", "comma separated · hard filter")}
            {chips("Good-to-have skills", "good_to_have_skills", "comma separated · bonus")}
            {chips("Required languages", "required_languages", "comma separated")}
          </Panel>
          <Panel title="How the score is built">
            <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8, fontSize: 14, lineHeight: 1.5, color: C.mid }}>
              <li>40% must-have skill coverage</li><li>20% good-to-have skill coverage</li><li>20% experience against the minimum</li><li>10% education at or above the minimum</li><li>10% required languages covered</li>
            </ul>
            <span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>A candidate passes the hard filter only when every must-have skill, the experience, the education and every language are met. The score and a short strengths-and-gaps note appear on each application as soon as it is submitted.</span>
          </Panel>
        </div>
      ) : null}

      {tab === "Application form" ? (
        <Panel title="What candidates are asked" right={<Pill onClick={() => set("form", {})}>Reset to default</Pill>}>
          <span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>Choose what this role asks for. Name, email and the resume are always required.</span>
          {[...new Set(FIELDS.map((f) => f.group))].map((g) => (
            <div key={g} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label>{g}</Label>
              {FIELDS.filter((f) => f.group === g).map((f) => (
                <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
                  <span style={{ fontSize: 15 }}>{f.label}{f.hint ? <span style={{ fontSize: 12, color: C.dim }}> · {f.hint}</span> : null}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["required", "optional", "off"] as FieldMode[]).map((m) => (
                      <button key={m} type="button" disabled={f.locked && m !== "required"} onClick={() => set("form", { ...form, [f.key]: m })} style={{ font: "inherit", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 999, border: `1px solid ${form[f.key] === m ? C.sky : C.line}`, background: form[f.key] === m ? C.sky : "transparent", color: form[f.key] === m ? C.bg : f.locked ? "#3a424e" : C.mid, cursor: f.locked ? "default" : "pointer" }}>{m}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Panel>
      ) : null}

      {tab === "Questions" ? (
        <Panel title="Role-specific questions" right={<Pill onClick={() => set("questions", [...(j.questions ?? []), { id: Math.random().toString(36).slice(2, 8), label: "", type: "textarea", required: false }])}>+ Add question</Pill>}>
          <span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>Asked at the end of the application form. Keep them few and specific.</span>
          {!(j.questions ?? []).length ? <Empty text="No extra questions. The standard form is enough for most roles." /> : (j.questions ?? []).map((q, i) => (
            <div key={q.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 150px 110px auto", gap: 10, alignItems: "center" }}>
              <input value={q.label} placeholder="Question text" onChange={(e) => set("questions", j.questions.map((x, k) => k === i ? { ...x, label: e.target.value } : x))} className="adm-in" style={input} />
              <select value={q.type} onChange={(e) => set("questions", j.questions.map((x, k) => k === i ? { ...x, type: e.target.value as Question["type"] } : x))} className="adm-in" style={{ ...input, appearance: "none" }}>
                <option value="textarea">Long answer</option><option value="text">Short answer</option><option value="yesno">Yes / No</option><option value="select">Choice</option>
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.mid }}><input type="checkbox" checked={q.required} onChange={(e) => set("questions", j.questions.map((x, k) => k === i ? { ...x, required: e.target.checked } : x))} style={{ accentColor: C.sky }} />Required</label>
              <Pill onClick={() => set("questions", j.questions.filter((_, k) => k !== i))}>Remove</Pill>
              {q.type === "select" ? <input value={(q.options ?? []).join(", ")} placeholder="Options, comma separated" onChange={(e) => set("questions", j.questions.map((x, k) => k === i ? { ...x, options: e.target.value.split(",").map((s) => s.trim()) } : x))} className="adm-in" style={{ ...input, gridColumn: "1 / -1" }} /> : null}
            </div>
          ))}
        </Panel>
      ) : null}
    </>
  );
}

// ───────────────────────── Applications ─────────────────────────

function Applications({ job, onBack }: { job: JobRow; onBack: () => void }) {
  const [rows, setRows] = useState<ApplicationRow[] | null>(null);
  const [filter, setFilter] = useState<"all" | ApplicationRow["status"]>("all");
  const [pick, setPick] = useState<ApplicationRow | null>(null);
  const load = () => { supabase()!.from("applications").select("*").eq("job_id", job.id).order("created_at", { ascending: false }).then(({ data }) => setRows((data ?? []) as ApplicationRow[])); };
  useEffect(load, [job.id]);
  useEffect(() => { const t = setInterval(load, 20_000); return () => clearInterval(t); }, [job.id]);

  const visible = (rows ?? []).filter((r) => filter === "all" || r.status === filter);
  const count = (s: ApplicationRow["status"]) => (rows ?? []).filter((r) => r.status === s).length;
  const [callMsg, setCallMsg] = useState("");
  const [calling, setCalling] = useState(false);
  const callAll = async () => {
    const ids = (rows ?? []).filter((r) => r.status === "shortlisted").map((r) => r.id);
    if (!ids.length || !confirm(`Start AI phone screening for ${ids.length} shortlisted candidate${ids.length > 1 ? "s" : ""}?`)) return;
    setCalling(true); setCallMsg("");
    try {
      const res = await startInterviews(ids);
      const started = res.results.filter((r) => ["initiating", "queued"].includes(r.status)).length;
      const problems = res.results.filter((r) => r.error).map((r) => { const a = (rows ?? []).find((x) => x.id === r.application_id); return `${a?.candidate_name ?? r.application_id.slice(0, 8)}: ${r.error}`; });
      const head = res.configured ? `${started} call${started === 1 ? "" : "s"} started.` : `${started} candidate${started === 1 ? "" : "s"} queued. Calling is not connected yet: the phone line and interview bridge still need to be set up, after which queued interviews can be started.`;
      setCallMsg(problems.length ? `${head} Not started: ${problems.join(" · ")}` : head);
    } catch (e) { setCallMsg((e as Error).message); }
    setCalling(false);
  };

  if (pick) return <ApplicationDetail app={pick} job={job} onBack={() => { setPick(null); load(); }} />;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Pill onClick={onBack}>← Roles</Pill>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>{job.title}</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.dim }}>{(rows ?? []).length} APPLICATIONS</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" disabled={calling || !count("shortlisted")} onClick={callAll} style={{ ...btn, opacity: count("shortlisted") ? 1 : .5, marginRight: 8 }}>{calling ? "Starting…" : `Call all shortlisted · ${count("shortlisted")}`}</button>
          {(["all", "new", "screened", "shortlisted", "rejected", "failed"] as const).map((s) => <Pill key={s} on={filter === s} onClick={() => setFilter(s)}>{s === "all" ? "All" : `${s[0].toUpperCase()}${s.slice(1)} · ${count(s)}`}</Pill>)}
        </div>
      </div>
      {callMsg ? <Panel><span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>{callMsg}</span></Panel> : null}
      {count("failed") ? <Panel><span style={{ fontSize: 14, lineHeight: 1.5, color: C.amber }}>{count("failed")} application{count("failed") > 1 ? "s" : ""} could not be screened. Open the candidate to see the reason and press “Re-run screener”. The usual cause is the model key on the server.</span></Panel> : null}
      <Panel title="Candidates" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>CLICK A CANDIDATE TO REVIEW · SCORES APPEAR WITHIN A MINUTE OF APPLYING</span>}>
        {!rows ? <Empty text="Loading…" /> : !visible.length ? <Empty text="No applications here yet." /> : (
          <Table head={["Candidate", "Applied", "Score", "Hard filter", "Status"]} rows={visible.map((r) => [
            `${r.candidate_name}  ·  ${r.email}`,
            new Date(r.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
            r.score == null ? (r.status === "failed" ? "error" : "pending") : String(Math.round(Number(r.score))),
            r.must_have_pass == null ? "—" : r.must_have_pass ? "pass" : "fail",
            r.status === "new" ? "awaiting screen" : r.status === "failed" ? "screen failed" : r.status,
          ])} onRow={(i) => setPick(visible[i])} />
        )}
      </Panel>
    </>
  );
}

function ApplicationDetail({ app: initial, job, onBack }: { app: ApplicationRow; job: JobRow; onBack: () => void }) {
  const [app, setApp] = useState(initial);
  const [url, setUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [iv, setIv] = useState<Interview | null>(null);
  const [ivMsg, setIvMsg] = useState("");
  const loadIv = () => { supabase()!.from("interviews").select("*").eq("application_id", app.id).order("created_at", { ascending: false }).limit(1).then(({ data }) => setIv((data?.[0] as Interview) ?? null)); };
  useEffect(loadIv, [app.id]);
  useEffect(() => { if (!iv || !["queued", "initiating", "ringing", "in_progress"].includes(iv.status)) return; const t = setInterval(loadIv, 8000); return () => clearInterval(t); }, [iv]);
  const call = async () => {
    setBusy(true); setIvMsg("");
    try { const res = await startInterviews([app.id]); const r = res.results[0]; setIvMsg(r?.error ? r.error : res.configured ? "Calling the candidate now." : "Queued. Calling is not connected yet: the phone line and interview bridge still need to be set up."); }
    catch (e) { setIvMsg((e as Error).message); }
    setBusy(false); loadIv();
  };
  useEffect(() => { if (app.resume_path) supabase()!.storage.from("resumes").createSignedUrl(app.resume_path, 3600).then(({ data }) => setUrl(data?.signedUrl ?? null)); }, [app.resume_path]);

  const update = async (patch: Partial<ApplicationRow>) => {
    setBusy(true);
    const { data } = await supabase()!.from("applications").update(patch).eq("id", app.id).select().single();
    if (data) setApp(data as ApplicationRow); setBusy(false);
  };
  const rescreen = async () => {
    setBusy(true);
    const sb = supabase()!;
    await sb.from("applications").update({ status: "new", screen_error: null }).eq("id", app.id);
    setApp((a) => ({ ...a, status: "screening", screen_error: null, score: null, must_have_pass: null }));
    const { data: res } = await sb.functions.invoke("screen-application", { body: { application_id: app.id } }).catch(() => ({ data: null }));
    // The function returns when it is done; refresh until the row has left "screening".
    for (let i = 0; i < 10; i++) {
      const { data } = await sb.from("applications").select("*").eq("id", app.id).single();
      if (data) { setApp(data as ApplicationRow); if (!["new", "screening"].includes((data as ApplicationRow).status)) break; }
      await new Promise((r) => setTimeout(r, 1500));
    }
    if (res?.error) setIvMsg("");
    setBusy(false);
  };

  const b = (app.breakdown ?? {}) as Record<string, { matched?: string[] | boolean; missing?: string[]; coverage?: number; candidate_top?: string | null; required?: string | null; candidate_years?: number; required_years?: number; all_covered?: boolean }>;
  const parsed = (app.parsed ?? {}) as { education?: { degree: string; field?: string | null; institution?: string | null; year?: number | null }[]; experience?: { company: string; role: string; years: number; summary: string }[]; skills?: string[]; languages?: { name: string; read: boolean; write: boolean }[]; total_experience_years?: number };
  const score = app.score == null ? null : Math.round(Number(app.score));
  const scoreColor = score == null ? C.dim : score >= 70 ? C.green : score >= 45 ? C.amber : "#ef6b6b";
  const bar = (label: string, value: number, detail: string, hard = false) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: C.mid }}>{label}{hard ? <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}> · HARD</span> : null}</span><span style={{ fontFamily: MONO, color: C.ink }}>{Math.round(value * 100)}%</span></div>
      <div style={{ height: 6, background: C.bg, border: `1px solid ${C.line}` }}><div style={{ height: "100%", width: `${Math.round(value * 100)}%`, background: value >= 1 ? C.green : value > 0 ? C.sky : "transparent" }} /></div>
      <span style={{ fontSize: 12, color: C.dim }}>{detail}</span>
    </div>
  );
  const answers = Object.entries(app.answers ?? {}).filter(([k]) => !["name", "email", "phone"].includes(k) && !k.startsWith("_"));
  const labelFor = (k: string) => k.startsWith("q_") ? (job.questions ?? []).find((q) => `q_${q.id}` === k)?.label ?? k : FIELDS.find((f) => f.key === k)?.label ?? k;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Pill onClick={onBack}>← {job.title}</Pill>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>{app.candidate_name}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: APP_COLOR[app.status], border: `1px solid ${APP_COLOR[app.status]}`, padding: "4px 10px", borderRadius: 999 }}>{app.status.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" disabled={busy} onClick={() => update({ status: "shortlisted" })} style={{ ...btn, background: C.green }}>Shortlist</button>
          <button type="button" disabled={busy} onClick={() => update({ status: "rejected" })} style={{ ...btn, background: "transparent", color: C.ink, border: `1px solid ${C.line}` }}>Reject</button>
          <button type="button" disabled={busy || app.status !== "shortlisted"} title={app.status !== "shortlisted" ? "Shortlist the candidate first" : undefined} onClick={call} style={{ ...btn, background: C.ice, opacity: app.status === "shortlisted" ? 1 : .5 }}>Start call screening</button>
          <Pill onClick={rescreen}>Re-run screener</Pill>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Panel title="Screening">
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1, color: scoreColor }}>{score ?? (app.status === "failed" ? "!" : "…")}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{app.must_have_pass == null ? (app.status === "failed" ? "Screening failed" : "Screening in progress") : app.must_have_pass ? "Meets all hard requirements" : "Misses a hard requirement"}</span>
                <span style={{ fontSize: 13, color: C.dim }}>{app.screened_at ? `Screened ${new Date(app.screened_at).toLocaleString("en-GB")}` : app.screen_error ? app.screen_error : "The score and rationale appear here automatically."}</span>
              </div>
            </div>
            {app.breakdown ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {bar("Must-have skills", b.must_haves?.coverage ?? 0, `Matched: ${(b.must_haves?.matched as string[] ?? []).join(", ") || "none"} · Missing: ${(b.must_haves?.missing ?? []).join(", ") || "none"}`, true)}
                {bar("Good-to-have skills", b.good_to_haves?.coverage ?? 0, `Matched: ${(b.good_to_haves?.matched as string[] ?? []).join(", ") || "none"}`)}
                {bar("Experience", b.experience?.matched ? 1 : Math.min(1, (b.experience?.candidate_years ?? 0) / Math.max(1, b.experience?.required_years ?? 1)), `${b.experience?.candidate_years ?? 0} years against ${b.experience?.required_years ?? 0} required`, true)}
                {bar("Education", b.education?.matched ? 1 : 0, `${b.education?.candidate_top ?? "unknown"} against ${b.education?.required ?? "any"}`, true)}
                {bar("Languages", b.languages?.all_covered ? 1 : 0, `Missing: ${(b.languages?.missing ?? []).join(", ") || "none"}`, true)}
              </div>
            ) : null}
            {app.rationale ? <div style={{ whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.6, color: C.mid, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>{app.rationale.replace(/\*\*/g, "")}</div> : null}
          </Panel>
          <Panel title="Phone screening" right={iv ? <span style={{ fontFamily: MONO, fontSize: 11, color: IV_COLOR[iv.status] }}>{iv.status.replace("_", " ").toUpperCase()}</span> : null}>
            {ivMsg ? <span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>{ivMsg}</span> : null}
            {!iv ? <Empty text={app.status === "shortlisted" ? "Not called yet. “Start call screening” rings the candidate and runs a first-round interview." : "Shortlist the candidate to enable phone screening."} /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: C.mid }}>
                <span>{iv.status === "queued" ? (iv.error ?? "Waiting to be called.") : iv.status === "completed" ? `Completed · ${Math.round((iv.duration_seconds ?? 0) / 60)} min${iv.score != null ? ` · interview score ${Math.round(Number(iv.score))}` : ""}` : iv.error ?? `Started ${new Date(iv.created_at).toLocaleString("en-GB")}`}</span>
                {iv.summary ? <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.55, color: C.ink }}>{iv.summary}</div> : null}
                {iv.transcript?.length ? <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto", borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>{iv.transcript.map((t, i) => <div key={i} style={{ display: "flex", gap: 10 }}><span style={{ fontFamily: MONO, fontSize: 11, color: t.role === "ai" ? C.sky : C.green, flex: "none", paddingTop: 3 }}>{t.role === "ai" ? "ASHA" : "CAND."}</span><span>{t.text}</span></div>)}</div> : null}
              </div>
            )}
          </Panel>
          <Panel title="Parsed profile">
            {!app.parsed ? <Empty text="Not parsed yet." /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 14, color: C.mid }}>
                <div><Label>Experience · {parsed.total_experience_years ?? 0} years</Label>{(parsed.experience ?? []).map((e, i) => <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${C.line}` }}><span style={{ color: C.ink, fontWeight: 600 }}>{e.role}</span> · {e.company} · {e.years} yrs<div style={{ fontSize: 13, color: C.dim }}>{e.summary}</div></div>)}</div>
                <div><Label>Education</Label>{(parsed.education ?? []).map((e, i) => <div key={i} style={{ padding: "6px 0" }}><span style={{ color: C.ink }}>{e.degree}</span>{e.field ? ` · ${e.field}` : ""}{e.institution ? ` · ${e.institution}` : ""}{e.year ? ` · ${e.year}` : ""}</div>)}</div>
                <div><Label>Skills</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{(parsed.skills ?? []).map((s) => <span key={s} style={{ fontSize: 12, padding: "4px 10px", border: `1px solid ${C.line}`, borderRadius: 999 }}>{s}</span>)}</div></div>
                <div><Label>Languages</Label><div style={{ marginTop: 6 }}>{(parsed.languages ?? []).map((l) => `${l.name}${l.read && l.write ? "" : " (limited)"}`).join(", ") || "—"}</div></div>
              </div>
            )}
          </Panel>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Panel title="Application" right={url ? <a href={url} target="_blank" rel="noopener" style={{ fontSize: 13, color: C.sky, borderBottom: `1px solid ${C.sky}` }}>Open resume PDF ↗</a> : null}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", fontSize: 14 }}>
              <span style={{ color: C.dim }}>Email</span><a href={`mailto:${app.email}`} style={{ color: C.sky }}>{app.email}</a>
              {app.phone ? <><span style={{ color: C.dim }}>Phone</span><span>{app.phone}</span></> : null}
              <span style={{ color: C.dim }}>Applied</span><span>{new Date(app.created_at).toLocaleString("en-GB")}</span>
              {answers.map(([k, v]) => <span key={k} style={{ display: "contents" }}><span style={{ color: C.dim }}>{labelFor(k)}</span><span style={{ whiteSpace: "pre-wrap" }}>{String(v ?? "—")}</span></span>)}
            </div>
          </Panel>
          {url ? <Panel title="Resume"><object data={url} type="application/pdf" style={{ width: "100%", height: 620, border: `1px solid ${C.line}` }}><a href={url} target="_blank" rel="noopener" style={{ color: C.sky }}>Open the PDF</a></object></Panel> : null}
          <Panel title="Notes for the team">
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="adm-in" style={{ ...input, resize: "vertical", lineHeight: 1.5 }} placeholder="Interview feedback, next steps…" />
            <button type="button" disabled={busy || notes === (app.notes ?? "")} onClick={() => update({ notes })} style={{ ...btn, alignSelf: "flex-start" }}>Save notes</button>
          </Panel>
        </div>
      </div>
    </>
  );
}
