"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { APPLY_EMAIL, JOBS, type Job } from "@/content/jobs";
import { track } from "@/lib/analytics";

const MONO = "'JetBrains Mono',monospace";
const E = "cubic-bezier(.2,.7,.2,1)";

type Filters = { role: string; team: string; location: string; experience: string };
const EMPTY: Filters = { role: "", team: "", location: "", experience: "" };
type SortKey = "newest" | "title" | "experience";

const matches = (j: Job, f: Filters, skip?: keyof Filters) =>
  (skip === "role" || !f.role || j.title === f.role) &&
  (skip === "team" || !f.team || j.team === f.team) &&
  (skip === "location" || !f.location || j.location === f.location) &&
  (skip === "experience" || !f.experience || j.experience === f.experience);

const uniq = (xs: string[]) => [...new Set(xs)];

export function CareersBoard() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>("newest");
  const [openId, setOpenId] = useState<string | null>(null);

  // Dependent options: each filter only offers values present in jobs that match the other filters.
  const options = (key: keyof Filters, pick: (j: Job) => string) => uniq(JOBS.filter((j) => matches(j, filters, key)).map(pick));
  const roleOptions = options("role", (j) => j.title);
  const teamOptions = options("team", (j) => j.team);
  const locationOptions = options("location", (j) => j.location);
  const experienceOptions = options("experience", (j) => j.experience);

  const visible = useMemo(() => {
    const list = JOBS.filter((j) => matches(j, filters));
    if (sort === "title") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "experience") return [...list].sort((a, b) => a.level - b.level);
    return [...list].sort((a, b) => b.posted.localeCompare(a.posted));
  }, [filters, sort]);

  const set = (key: keyof Filters, value: string, exact = false) => setFilters((f) => {
    const next = { ...f, [key]: exact ? value : f[key] === value ? "" : value };
    // Drop any other selection that no longer has a matching job.
    (Object.keys(next) as (keyof Filters)[]).forEach((k) => { if (k !== key && next[k] && !JOBS.some((j) => matches(j, next))) next[k] = ""; });
    return next;
  });
  const active = Object.values(filters).filter(Boolean).length;

  // Deep link: /careers/#job=ai-engineer opens the posting.
  useEffect(() => {
    const fromHash = () => { const m = location.hash.match(/job=([\w-]+)/); setOpenId(m ? m[1] : null); };
    fromHash(); addEventListener("hashchange", fromHash);
    return () => removeEventListener("hashchange", fromHash);
  }, []);
  const open = (id: string) => { history.replaceState(null, "", `#job=${id}`); setOpenId(id); track("job_open", { job: id }); };
  const close = () => { history.replaceState(null, "", location.pathname + location.search); setOpenId(null); };
  const job = JOBS.find((j) => j.id === openId) || null;

  const selectStyle: React.CSSProperties = { font: "inherit", fontSize: 14, fontWeight: 600, height: 42, padding: "0 36px 0 14px", borderRadius: 999, border: "1px solid #2a313c", background: "#0E1116 url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%238a94a1' stroke-width='1.6' stroke-linecap='round'/></svg>\") no-repeat right 14px center", color: "#d4dae2", appearance: "none", WebkitAppearance: "none", cursor: "pointer", minWidth: 0, transition: `border-color .25s ${E}` };
  const field = (label: string, key: keyof Filters, opts: string[]) => (
    <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", color: "#8a94a1", flex: "none" }}>{label}</span>
      <select value={filters[key]} onChange={(e) => set(key, e.target.value, true)} style={{ ...selectStyle, borderColor: filters[key] ? "#4FB8EE" : "#2a313c", color: filters[key] ? "#ffffff" : "#d4dae2" }}>
        <option value="">All</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Filters and sort: one row */}
      <div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 22px", padding: "14px 18px", border: "1px solid #2a313c", background: "#161a21" }}>
        {field("ROLE", "role", roleOptions)}
        {field("TEAM", "team", teamOptions)}
        {field("LOCATION", "location", locationOptions)}
        {field("EXPERIENCE", "experience", experienceOptions)}
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", color: "#8a94a1" }}>SORT</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={selectStyle}>
            <option value="newest">Newest</option><option value="title">Title A–Z</option><option value="experience">Experience</option>
          </select>
        </label>
        {active > 0 ? <button type="button" onClick={() => setFilters(EMPTY)} style={{ cursor: "pointer", font: "inherit", fontSize: 13, color: "#4FB8EE", background: "none", border: "none", padding: 0, borderBottom: "1px solid #4FB8EE" }}>Clear</button> : null}
      </div>

      {/* Results */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
        <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".12em", color: "#8a94a1" }}>{visible.length} {visible.length === 1 ? "OPENING" : "OPENINGS"}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #2a313c" }}>
        {visible.map((r) => (
          <button key={r.id} type="button" onClick={() => open(r.id)} data-spot="1" data-hover="color:#4FB8EE;padding-left:12px;" style={{ cursor: "pointer", font: "inherit", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #2a313c", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, alignItems: "center", padding: "28px 0", color: "#ffffff", transition: "padding .25s, color .25s", width: "100%" }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.01em" }}>{r.title}</span>
            <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".1em", color: "#8a94a1" }}>{r.team.toUpperCase()} · {r.type.toUpperCase()}</span>
            <span style={{ fontSize: 16, color: "#aab3bf" }}>{r.location}</span>
            <span style={{ fontSize: 16, color: "#aab3bf" }}>{r.experience}</span>
            <span style={{ fontWeight: 700, fontSize: 16, justifySelf: "start" }}>View role →</span>
          </button>
        ))}
        {visible.length === 0 ? <p style={{ margin: 0, padding: "40px 0", fontSize: 18, color: "#aab3bf" }}>No openings match those filters yet. Write to <a href={`mailto:${APPLY_EMAIL}`} style={{ color: "#4FB8EE" }}>{APPLY_EMAIL}</a> anyway.</p> : null}
      </div>

      {job ? <JobDialog job={job} onClose={close} /> : null}
    </div>
  );
}

function JobDialog({ job, onClose }: { job: Job; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    panel.current?.animate([{ opacity: 0, transform: "translateY(16px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: E, fill: "both" });
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    return () => { document.body.style.overflow = prev; removeEventListener("keydown", onKey); };
  }, [onClose]);

  const share = async () => {
    const url = `${location.origin}${location.pathname}#job=${job.id}`;
    try { await navigator.clipboard.writeText(url); }
    catch { const t = document.createElement("textarea"); t.value = url; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
    setCopied(true); setTimeout(() => setCopied(false), 2200); track("job_link_copy", { job: job.id });
  };
  const applyHref = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Application: ${job.title}`)}&body=${encodeURIComponent(`Hi Trikhya,\n\nI'd like to apply for the ${job.title} role (${job.location}).\n\n`)}`;
  const meta = [["TEAM", job.team], ["LOCATION", job.location], ["TYPE", job.type], ["EXPERIENCE", job.experience], ["POSTED", new Date(job.posted).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })]];
  const iconBtn = (label: string, onClick: () => void, svg: React.ReactNode) => (
    <button type="button" aria-label={label} title={label} onClick={onClick} style={{ cursor: "pointer", width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,.5)", background: "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{svg}</button>
  );
  const list = (title: string, items: string[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#8a94a1" }}>{title}</span>
      <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 16, lineHeight: 1.55, color: "#d4dae2" }}>{items.map((it) => <li key={it}>{it}</li>)}</ul>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 380, background: "rgba(14,17,22,.78)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="job-title" onClick={(e) => e.stopPropagation()} style={{ width: "min(860px, 100%)", maxHeight: "calc(100vh - 48px)", background: "#161a21", border: "1px solid #2a313c", borderRadius: 18, boxShadow: "0 30px 80px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", overflow: "hidden", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "24px 28px", background: "#1670A6", borderBottom: "1px solid #2a313c" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#d9eefb" }}>{job.team.toUpperCase()} · {job.type.toUpperCase()}</span>
            <h3 id="job-title" style={{ margin: 0, fontSize: "clamp(26px,3vw,36px)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.05 }}>{job.title}</h3>
          </div>
          <div style={{ display: "flex", gap: 10, flex: "none", alignItems: "center" }}>
            <span aria-live="polite" style={{ fontFamily: MONO, fontSize: 12, color: "#d9eefb", opacity: copied ? 1 : 0, transform: copied ? "none" : "translateX(6px)", transition: `opacity .3s ${E}, transform .3s ${E}` }}>Job link copied</span>
            {iconBtn("Copy job link", share, copied ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" /></svg>)}
            {iconBtn("Close", onClose, <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>)}
          </div>
        </div>
        <div style={{ overflowY: "auto", padding: "28px", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, padding: "18px 20px", border: "1px solid #2a313c", background: "#0E1116" }}>
            {meta.map(([k, v]) => <div key={k} style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".12em", color: "#8a94a1" }}>{k}</span><span style={{ fontSize: 15, color: "#ffffff" }}>{v}</span></div>)}
          </div>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "#dde2e8" }}>{job.summary}</p>
          {list("WHAT YOU WILL DO", job.responsibilities)}
          {list("WHAT WE ARE LOOKING FOR", job.requirements)}
          {list("NICE TO HAVE", job.niceToHave)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", padding: "18px 28px", borderTop: "1px solid #2a313c", background: "#161a21" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span aria-hidden style={{ width: 34, height: 34, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", background: "rgba(95,211,154,.12)", border: "1px solid rgba(95,211,154,.45)", color: "#5fd39a" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>We reply to every one.</span>
              <span style={{ fontSize: 13, color: "#8a94a1" }}>You will hear back from us within a week, whatever the outcome.</span>
            </span>
          </div>
          <a href={applyHref} data-track="job_apply" data-job={job.id} data-magnet="1" data-hover="background:#8fd3f7;" style={{ background: "#4FB8EE", color: "#0E1116", fontWeight: 700, fontSize: 16, padding: "14px 26px", borderRadius: 999 }}>Apply for this role →</a>
        </div>
      </div>
    </div>
  );
}
