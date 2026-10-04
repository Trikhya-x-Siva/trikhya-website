"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, SUPABASE_URL } from "@/lib/supabase";
import { MARK_BLUE } from "@/lib/assets";
import { withBase } from "@/lib/paths";
import { JOBS } from "@/content/jobs";
import { aggregate, loadEvents, pageName, RANGES, type Agg, type Ev } from "./data";
import { Bars, C, Chart, Empty, fmt, Kpi, Label, MONO, Panel, pct, Pill, SANS, secs, Table } from "./ui";
import { Hiring } from "./Hiring";
import { GodseyeAdmin } from "./GodseyeAdmin";

const TABS = ["Overview", "Pages", "Careers", "Godseye", "Audience", "Live", "Admins"] as const;
type Tab = (typeof TABS)[number];

export function AdminApp() {
  const sb = supabase();
  const [session, setSession] = useState<Session | null | undefined>(sb ? undefined : null);
  const [adminFor, setAdminFor] = useState<{ uid: string; ok: boolean } | null>(null);
  const isAdmin = session && adminFor?.uid === session.user.id ? adminFor.ok : null;

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!sb || !session) return;
    const uid = session.user.id;
    sb.rpc("is_admin").then(({ data }) => setAdminFor({ uid, ok: !!data }));
  }, [sb, session]);

  if (!sb) return <Shell><Panel><Empty text={`Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.`} /></Panel></Shell>;
  if (session === undefined) return <Shell><Empty text="Loading…" /></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  if (isAdmin === null) return <Shell><Empty text="Checking access…" /></Shell>;
  if (!isAdmin) return <Shell><Panel><Empty text={`${session.user.email} is signed in but is not on the admin list. Add the address to the admins table in Supabase.`} /><button type="button" onClick={() => sb.auth.signOut()} style={btn}>Sign out</button></Panel></Shell>;
  return <Dashboard email={session.user.email ?? ""} onSignOut={() => sb.auth.signOut()} />;
}

const btn: React.CSSProperties = { font: "inherit", fontWeight: 700, fontSize: 15, padding: "12px 22px", borderRadius: 999, border: "none", background: C.sky, color: C.bg, cursor: "pointer", alignSelf: "flex-start" };
const input: React.CSSProperties = { font: "inherit", fontSize: 16, padding: "13px 16px", background: C.bg, border: `1px solid ${C.line}`, color: C.ink, outline: "none", width: "100%", boxSizing: "border-box", borderRadius: 0 };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: SANS, display: "grid", placeItems: "center", padding: 24 }}>
      <style>{`.adm-in:focus{border-color:${C.sky}!important} .adm-in:-webkit-autofill,.adm-in:-webkit-autofill:focus{-webkit-text-fill-color:${C.ink};-webkit-box-shadow:0 0 0 1000px ${C.bg} inset;caret-color:${C.ink};transition:background-color 9999s}`}</style>
      <div style={{ width: "min(460px,100%)", display: "flex", flexDirection: "column", gap: 24 }}>
        <Brand />
        {children}
      </div>
    </div>
  );
}

function Brand() {
  return (
    <a href={withBase("/")} style={{ display: "flex", alignItems: "center", gap: 12, color: C.ink }}>
      <img src={MARK_BLUE} alt="" style={{ width: 34 }} />
      <span style={{ fontWeight: 900, fontSize: 14, letterSpacing: ".14em" }}>TRIKHYA <span style={{ color: C.sky }}>ADMIN</span></span>
    </a>
  );
}

function Login() {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(""); setNote("");
    const sb = supabase()!;
    if (mode === "create") {
      const { data: ok } = await sb.rpc("is_allowlisted", { check_email: email });
      if (!ok) { setErr("That email is not on the admin list. Ask an existing admin to add it first."); setBusy(false); return; }
      if (password.length < 10) { setErr("Use at least 10 characters."); setBusy(false); return; }
      const { data, error } = await sb.auth.signUp({ email, password });
      setBusy(false);
      if (error) setErr(error.message);
      else if (data.user && !data.session) setNote("Account created. Email confirmation is switched on in Supabase, so check your inbox once, then sign in.");
      return;
    }
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(error.message === "Invalid login credentials" ? "That email and password do not match." : error.message);
  };
  return (
    <Panel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <Label>{mode === "signin" ? "Sign in" : "Create account"}</Label>
        <Pill onClick={() => { setMode(mode === "signin" ? "create" : "signin"); setErr(""); setNote(""); }}>{mode === "signin" ? "First time? Create account" : "Back to sign in"}</Pill>
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mode === "create" ? <span style={{ fontSize: 15, lineHeight: 1.5, color: C.mid }}>Only emails already added by an admin can create an account.</span> : null}
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@trikhya.ai" className="adm-in" style={input} />
        <input type="password" required autoComplete={mode === "create" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "create" ? "Choose a password, 10+ characters" : "Password"} className="adm-in" style={input} />
        <button type="submit" disabled={busy} style={btn}>{busy ? "Please wait…" : mode === "create" ? "Create account" : "Sign in"}</button>
        {err ? <span style={{ fontSize: 13, lineHeight: 1.5, color: C.amber }}>{err}</span> : null}
        {note ? <span style={{ fontSize: 13, lineHeight: 1.5, color: C.green }}>{note}</span> : null}
      </form>
    </Panel>
  );
}

/** Lets a signed-in admin set or change their password, so email is not needed for later sign-ins. */
function SetPassword({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); if (pw.length < 10) { setMsg("Use at least 10 characters."); return; }
    setBusy(true);
    const { error } = await supabase()!.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) setMsg(error.message); else { setMsg("Password saved. Use it next time you sign in."); setPw(""); setTimeout(onDone, 1800); }
  };
  return (
    <Panel title="Set a password" right={<Pill onClick={onDone}>Close</Pill>}>
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password, 10+ characters" className="adm-in" style={{ ...input, width: "min(360px,100%)" }} />
        <button type="submit" disabled={busy} style={btn}>{busy ? "Saving…" : "Save password"}</button>
        {msg ? <span style={{ fontSize: 13, color: msg.startsWith("Password saved") ? C.green : C.amber }}>{msg}</span> : null}
      </form>
    </Panel>
  );
}

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [days, setDays] = useState(30);
  const [events, setEvents] = useState<Ev[] | null>(null);
  const [error, setError] = useState("");
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [pagePick, setPagePick] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [manage, setManage] = useState<"hiring" | "godseye" | null>(null);

  const refresh = () => { loadEvents(days).then((e) => { setEvents(e); setError(""); setRefreshedAt(new Date()); }).catch((e) => setError(String(e.message || e))); };
  useEffect(refresh, [days]);
  useEffect(() => { const t = setInterval(refresh, 60_000); return () => clearInterval(t); }, [days]);
  const agg = useMemo(() => (events ? aggregate(events, days) : null), [events, days]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: SANS }}>
      <style>{`.adm-row:hover td{background:rgba(255,255,255,.03)} .adm-tab{all:unset;cursor:pointer;padding:10px 0;font-size:15px;color:${C.mid};border-bottom:2px solid transparent;transition:color .2s,border-color .2s} .adm-tab:hover{color:${C.ink}} .adm-tab[aria-selected=true]{color:${C.ink};border-color:${C.sky}}`}</style>
      <header style={{ borderBottom: `1px solid ${C.line}`, background: C.panel }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px 28px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <Brand />
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {RANGES.map(([d, l]) => <Pill key={d} on={days === Number(d)} onClick={() => setDays(Number(d))}>{l}</Pill>)}
              <span style={{ width: 1, height: 22, background: C.line, margin: "0 6px" }} />
              <span style={{ fontFamily: MONO, fontSize: 12, color: C.dim }}>{refreshedAt ? `UPDATED ${refreshedAt.toLocaleTimeString("en-GB")}` : "LOADING"}</span>
              <Pill onClick={refresh}>Refresh</Pill>
              <span style={{ fontSize: 13, color: C.dim }}>{email}</span>
              <Pill onClick={() => setShowPw((v) => !v)}>Set password</Pill>
              <Pill onClick={onSignOut}>Sign out</Pill>
            </div>
          </div>
          <nav role="tablist" style={{ display: "flex", gap: 28 }}>
            {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} className="adm-tab" onClick={() => { setTab(t); setPagePick(null); setManage(null); }}>{t}</button>)}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 28px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
        {showPw ? <SetPassword onDone={() => setShowPw(false)} /> : null}
        {error ? <Panel><Empty text={`Could not load events: ${error}. Has the SQL migration been run in Supabase (${SUPABASE_URL})?`} /></Panel> : null}
        {manage === "hiring" ? <Hiring onBack={() => setManage(null)} /> : manage === "godseye" ? <GodseyeAdmin onBack={() => setManage(null)} /> : !agg ? <Empty text="Loading events…" /> : (
          <>
            {tab === "Overview" ? <Overview a={agg} days={days} onPage={(p) => { setPagePick(p); setTab("Pages"); }} /> : null}
            {tab === "Pages" ? <Pages a={agg} pick={pagePick} setPick={setPagePick} /> : null}
            {tab === "Careers" ? <Careers a={agg} onManage={() => setManage("hiring")} /> : null}
            {tab === "Godseye" ? <Godseye a={agg} onManage={() => setManage("godseye")} /> : null}
            {tab === "Audience" ? <Audience a={agg} /> : null}
            {tab === "Live" ? <Live events={events!} /> : null}
            {tab === "Admins" ? <Admins me={email} /> : null}
          </>
        )}
      </main>
    </div>
  );
}

const grid = (min: number): React.CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 20 });

function Overview({ a, days, onPage }: { a: Agg; days: number; onPage: (p: string) => void }) {
  return (
    <>
      <div style={grid(200)}>
        <Kpi label="Visitors" value={fmt(a.visitors)} sub={`${a.returning} recognised returning`} />
        <Kpi label="Sessions" value={fmt(a.sessions)} sub={`${days}-day window`} />
        <Kpi label="Page views" value={fmt(a.views)} sub={`${(a.sessions ? a.views / a.sessions : 0).toFixed(1)} per session`} />
        <Kpi label="Avg time on page" value={secs(a.avgSeconds)} sub={`${Math.round(a.avgScroll)}% average scroll depth`} />
        <Kpi label="Bounce rate" value={pct(a.bounceRate)} sub="single-page sessions" accent={a.bounceRate > 0.7 ? C.amber : undefined} />
        <Kpi label="Enquiries" value={fmt(a.contact)} sub={`${a.godseye.questions.length} Godseye questions`} accent={C.green} />
      </div>
      <Panel title="Views and sessions per day"><Chart series={a.series} /></Panel>
      <div style={grid(360)}>
        <Panel title="Top pages" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>CLICK FOR DETAIL</span>}>
          <Bars rows={a.pageRows.slice(0, 10).map((p) => ({ key: pageName(p.path), count: p.views }))} max={10} onPick={(k) => { const r = a.pageRows.find((p) => pageName(p.path) === k); if (r) onPage(r.path); }} />
        </Panel>
        <Panel title="Where visitors came from"><Bars rows={a.referrers} /></Panel>
        <Panel title="Landing pages"><Bars rows={a.landing.map((r) => ({ ...r, key: pageName(r.key) }))} /></Panel>
      </div>
    </>
  );
}

function Pages({ a, pick, setPick }: { a: Agg; pick: string | null; setPick: (p: string | null) => void }) {
  const row = pick ? a.pageRows.find((p) => p.path === pick) : null;
  return (
    <>
      <Panel title="Every page" right={pick ? <Pill onClick={() => setPick(null)}>All pages</Pill> : null}>
        <Table head={["Page", "Views", "Sessions", "Avg time", "Scroll", "Clicks", "Exits"]} rows={a.pageRows.map((p) => [pageName(p.path), fmt(p.views), fmt(p.sessions), secs(p.seconds), `${Math.round(p.scroll)}%`, fmt(p.clicks), fmt(p.exits)])} onRow={(i) => setPick(a.pageRows[i].path)} />
      </Panel>
      {row ? (
        <div style={grid(360)}>
          <Panel title={`Interactions on ${pageName(row.path)}`} right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{row.path}</span>}>
            <Bars rows={(a.interactions.get(row.path) ?? []).map((r) => ({ ...r, key: r.key.length > 48 ? r.key.slice(0, 46) + "…" : r.key }))} max={25} />
          </Panel>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Kpi label="Views" value={fmt(row.views)} sub={`${row.sessions} sessions`} />
            <Kpi label="Time on page" value={secs(row.seconds)} sub={`${Math.round(row.scroll)}% scrolled on average`} />
            <Kpi label="Exit share" value={pct(row.views ? row.exits / row.views : 0)} sub="views that ended the session" />
          </div>
        </div>
      ) : null}
    </>
  );
}

function Careers({ a, onManage }: { a: Agg; onManage: () => void }) {
  const rows = JOBS.map((j) => { const r = a.jobs.get(j.id) ?? { opens: 0, copies: 0, applies: 0, applied: 0 }; return [j.title, fmt(r.opens), fmt(r.copies), fmt(r.applies), fmt(r.applied), pct(r.opens ? r.applied / r.opens : 0)]; });
  const careers = a.pageRows.find((p) => p.path.replace(/\/$/, "").endsWith("/careers"));
  const totals = [...a.jobs.values()].reduce((t, r) => ({ opens: t.opens + r.opens, copies: t.copies + r.copies, applies: t.applies + r.applies, applied: t.applied + r.applied }), { opens: 0, copies: 0, applies: 0, applied: 0 });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, color: C.mid }}>How the careers page performs. Roles, application forms and candidates live in hiring management.</span>
        <button type="button" onClick={onManage} style={{ font: "inherit", fontWeight: 700, fontSize: 15, padding: "11px 20px", borderRadius: 999, border: "none", background: C.sky, color: C.bg, cursor: "pointer" }}>Hiring management →</button>
      </div>
      <div style={grid(200)}>
        <Kpi label="Careers page views" value={fmt(careers?.views ?? 0)} sub={`${careers?.sessions ?? 0} sessions`} />
        <Kpi label="Jobs opened" value={fmt(totals.opens)} />
        <Kpi label="Links copied" value={fmt(totals.copies)} />
        <Kpi label="Apply clicks" value={fmt(totals.applies)} />
        <Kpi label="Applications submitted" value={fmt(totals.applied)} accent={C.green} sub={pct(totals.opens ? totals.applied / totals.opens : 0) + " of opens"} />
      </div>
      <Panel title="Per role"><Table head={["Role", "Opened", "Link copied", "Apply clicked", "Applied", "Conversion"]} rows={rows} /></Panel>
    </>
  );
}

function Godseye({ a, onManage }: { a: Agg; onManage: () => void }) {
  const qs = a.godseye.questions;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, color: C.mid }}>Usage of the assistant. Its knowledge, behaviour, on/off switch and full conversations live in Godseye management.</span>
        <button type="button" onClick={onManage} style={{ font: "inherit", fontWeight: 700, fontSize: 15, padding: "11px 20px", borderRadius: 999, border: "none", background: C.sky, color: C.bg, cursor: "pointer" }}>Godseye management →</button>
      </div>
      <div style={grid(200)}>
        <Kpi label="Chat opened" value={fmt(a.godseye.opens)} />
        <Kpi label="Questions asked" value={fmt(qs.length)} sub={`${(a.godseye.opens ? qs.length / a.godseye.opens : 0).toFixed(1)} per open`} />
        <Kpi label="Sessions that asked" value={fmt(new Set(qs.map((q) => q.session_id)).size)} />
      </div>
      <Panel title="Every question" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>NEWEST FIRST</span>}>
        <Table head={["Question", "Page", "When"]} rows={qs.map((q) => [String(q.props.q ?? ""), pageName(q.path), new Date(q.ts).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })])} />
      </Panel>
    </>
  );
}

function Audience({ a }: { a: Agg }) {
  return (
    <div style={grid(360)}>
      <Panel title="Devices (by screen width)"><Bars rows={a.devices} /></Panel>
      <Panel title="Browser language"><Bars rows={a.languages} /></Panel>
      <Panel title="Referrers"><Bars rows={a.referrers} max={15} /></Panel>
      <Panel title="Outbound links clicked"><Bars rows={a.outbound} max={15} /></Panel>
    </div>
  );
}

function Live({ events }: { events: Ev[] }) {
  const recent = events.slice(0, 150);
  return (
    <Panel title="Most recent events" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>AUTO-REFRESHES EVERY MINUTE</span>}>
      <Table head={["Event", "Page", "Detail", "Session", "When"]} rows={recent.map((e) => [e.name, pageName(e.path), e.name === "click" ? String(e.props.label ?? e.props.href ?? "") : e.name === "page_leave" ? `${e.props.seconds}s · ${e.props.scroll}%` : e.name === "godseye_question" ? String(e.props.q ?? "") : String(e.props.job ?? ""), e.session_id.slice(0, 6), new Date(e.ts).toLocaleTimeString("en-GB")])} />
    </Panel>
  );
}

function Admins({ me }: { me: string }) {
  const [rows, setRows] = useState<{ email: string; added_at: string }[] | null>(null);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const load = () => { supabase()!.from("admins").select("email, added_at").order("added_at").then(({ data, error }) => { if (error) setMsg(error.message); else setRows(data ?? []); }); };
  useEffect(load, []);
  const add = async (e: FormEvent) => {
    e.preventDefault(); setMsg("");
    const { error } = await supabase()!.from("admins").insert({ email: email.trim().toLowerCase() });
    if (error) setMsg(error.message.includes("duplicate") ? "That email is already an admin." : error.message); else { setEmail(""); setMsg("Added. They can now create their login from the sign-in screen."); load(); }
  };
  const remove = async (target: string) => {
    if (!confirm(`Remove ${target} from the admin list? Their login will stop working.`)) return;
    const { error } = await supabase()!.from("admins").delete().eq("email", target);
    if (error) setMsg(error.message); else load();
  };
  return (
    <div style={grid(420)}>
      <Panel title="Add an admin">
        <form onSubmit={add} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 15, lineHeight: 1.5, color: C.mid }}>Add a teammate&apos;s email. They then open the admin sign-in page, choose “Create account”, and set their own password. Only emails on this list can create an account or sign in.</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@trikhya.ai" className="adm-in" style={input} />
          <button type="submit" style={btn}>Add admin</button>
          {msg ? <span style={{ fontSize: 13, color: msg.startsWith("Added") ? C.green : C.amber }}>{msg}</span> : null}
        </form>
      </Panel>
      <Panel title="Current admins" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{rows?.length ?? 0} TOTAL</span>}>
        {!rows ? <Empty text="Loading…" /> : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {rows.map((r) => (
              <div key={r.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: `1px solid ${C.line}` }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 15 }}>{r.email}{r.email.toLowerCase() === me.toLowerCase() ? <span style={{ fontFamily: MONO, fontSize: 11, color: C.sky, marginLeft: 10 }}>YOU</span> : null}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>ADDED {new Date(r.added_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</span>
                </span>
                {r.email.toLowerCase() !== me.toLowerCase() ? <Pill onClick={() => remove(r.email)}>Remove</Pill> : null}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
