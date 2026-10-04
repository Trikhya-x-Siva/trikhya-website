"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, SUPABASE_URL } from "@/lib/supabase";
import { MARK_BLUE } from "@/lib/assets";
import { withBase } from "@/lib/paths";
import { JOBS } from "@/content/jobs";
import { aggregate, loadEvents, RANGES, type Agg, type Ev } from "./data";
import { Bars, C, Chart, Empty, fmt, Kpi, Label, MONO, Panel, pct, Pill, SANS, secs, Table } from "./ui";

const TABS = ["Overview", "Pages", "Careers", "Godseye", "Audience", "Live"] as const;
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
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setState("sending");
    const { error } = await supabase()!.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname } });
    if (error) { setErr(error.message); setState("error"); } else setState("sent");
  };
  return (
    <Panel>
      <Label>Sign in</Label>
      {state === "sent" ? (
        <span style={{ fontSize: 16, lineHeight: 1.5, color: C.mid }}>Check your inbox. We sent a sign-in link to <b style={{ color: C.ink }}>{email}</b>. Open it on this device.</span>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 15, lineHeight: 1.5, color: C.mid }}>Enter your Trikhya email. You will get a one-time link, no password.</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@trikhya.ai" className="adm-in" style={input} />
          <button type="submit" disabled={state === "sending"} style={btn}>{state === "sending" ? "Sending…" : "Send sign-in link"}</button>
          {state === "error" ? <span style={{ fontSize: 13, lineHeight: 1.5, color: C.amber }}>{err.replace(/^For security purposes, /, "")}</span> : null}
        </form>
      )}
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
              <Pill onClick={onSignOut}>Sign out</Pill>
            </div>
          </div>
          <nav role="tablist" style={{ display: "flex", gap: 28 }}>
            {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} className="adm-tab" onClick={() => { setTab(t); setPagePick(null); }}>{t}</button>)}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 28px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
        {error ? <Panel><Empty text={`Could not load events: ${error}. Has the SQL migration been run in Supabase (${SUPABASE_URL})?`} /></Panel> : null}
        {!agg ? <Empty text="Loading events…" /> : (
          <>
            {tab === "Overview" ? <Overview a={agg} days={days} onPage={(p) => { setPagePick(p); setTab("Pages"); }} /> : null}
            {tab === "Pages" ? <Pages a={agg} pick={pagePick} setPick={setPagePick} /> : null}
            {tab === "Careers" ? <Careers a={agg} /> : null}
            {tab === "Godseye" ? <Godseye a={agg} /> : null}
            {tab === "Audience" ? <Audience a={agg} /> : null}
            {tab === "Live" ? <Live events={events!} /> : null}
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
          <Bars rows={a.pageRows.slice(0, 10).map((p) => ({ key: p.path, count: p.views }))} max={10} onPick={onPage} />
        </Panel>
        <Panel title="Where visitors came from"><Bars rows={a.referrers} /></Panel>
        <Panel title="Landing pages"><Bars rows={a.landing} /></Panel>
      </div>
    </>
  );
}

function Pages({ a, pick, setPick }: { a: Agg; pick: string | null; setPick: (p: string | null) => void }) {
  const row = pick ? a.pageRows.find((p) => p.path === pick) : null;
  return (
    <>
      <Panel title="Every page" right={pick ? <Pill onClick={() => setPick(null)}>All pages</Pill> : null}>
        <Table head={["Page", "Views", "Sessions", "Avg time", "Scroll", "Clicks", "Exits"]} rows={a.pageRows.map((p) => [p.path, fmt(p.views), fmt(p.sessions), secs(p.seconds), `${Math.round(p.scroll)}%`, fmt(p.clicks), fmt(p.exits)])} onRow={(i) => setPick(a.pageRows[i].path)} />
      </Panel>
      {row ? (
        <div style={grid(360)}>
          <Panel title={`Interactions on ${row.path}`} right={<span style={{ fontSize: 13, color: C.dim }}>{row.title}</span>}>
            <Bars rows={a.interactions.get(row.path) ?? []} max={25} />
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

function Careers({ a }: { a: Agg }) {
  const rows = JOBS.map((j) => { const r = a.jobs.get(j.id) ?? { opens: 0, copies: 0, applies: 0 }; return [j.title, fmt(r.opens), fmt(r.copies), fmt(r.applies), pct(r.opens ? r.applies / r.opens : 0)]; });
  const careers = a.pageRows.find((p) => p.path.replace(/\/$/, "").endsWith("/careers"));
  const totals = [...a.jobs.values()].reduce((t, r) => ({ opens: t.opens + r.opens, copies: t.copies + r.copies, applies: t.applies + r.applies }), { opens: 0, copies: 0, applies: 0 });
  return (
    <>
      <div style={grid(200)}>
        <Kpi label="Careers page views" value={fmt(careers?.views ?? 0)} sub={`${careers?.sessions ?? 0} sessions`} />
        <Kpi label="Jobs opened" value={fmt(totals.opens)} />
        <Kpi label="Links copied" value={fmt(totals.copies)} />
        <Kpi label="Apply clicks" value={fmt(totals.applies)} accent={C.green} sub={pct(totals.opens ? totals.applies / totals.opens : 0) + " of opens"} />
      </div>
      <Panel title="Per role"><Table head={["Role", "Opened", "Link copied", "Apply clicked", "Apply rate"]} rows={rows} /></Panel>
      <Panel title="Interactions on the careers page"><Bars rows={careers ? a.interactions.get(careers.path) ?? [] : []} max={20} /></Panel>
    </>
  );
}

function Godseye({ a }: { a: Agg }) {
  const qs = a.godseye.questions;
  return (
    <>
      <div style={grid(200)}>
        <Kpi label="Chat opened" value={fmt(a.godseye.opens)} />
        <Kpi label="Questions asked" value={fmt(qs.length)} sub={`${(a.godseye.opens ? qs.length / a.godseye.opens : 0).toFixed(1)} per open`} />
        <Kpi label="Sessions that asked" value={fmt(new Set(qs.map((q) => q.session_id)).size)} />
      </div>
      <Panel title="Every question" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>NEWEST FIRST</span>}>
        <Table head={["Question", "Page", "When"]} rows={qs.map((q) => [String(q.props.q ?? ""), q.path, new Date(q.ts).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })])} />
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
      <Table head={["Event", "Page", "Detail", "Session", "When"]} rows={recent.map((e) => [e.name, e.path, e.name === "click" ? String(e.props.label ?? e.props.href ?? "") : e.name === "page_leave" ? `${e.props.seconds}s · ${e.props.scroll}%` : e.name === "godseye_question" ? String(e.props.q ?? "") : String(e.props.job ?? ""), e.session_id.slice(0, 6), new Date(e.ts).toLocaleTimeString("en-GB")])} />
    </Panel>
  );
}
