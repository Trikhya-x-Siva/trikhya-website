"use client";

import { supabase } from "@/lib/supabase";
import { INSIGHTS } from "@/content/insights";
import { NLQ } from "@/content/nlq";

export type Ev = {
  id: number; ts: string; session_id: string; visitor_id: string | null; name: string; path: string; title: string | null;
  referrer: string | null; props: Record<string, unknown>; lang: string | null; screen_w: number | null; ua: string | null;
};

export const RANGES = [["7", "7 days"], ["30", "30 days"], ["90", "90 days"]] as const;

/** Pull every event since `days` ago, 1000 rows a page, capped at 50k. Fine for a marketing site. */
export async function loadEvents(days: number): Promise<Ev[]> {
  const sb = supabase(); if (!sb) return [];
  const since = new Date(Date.now() - days * 86400e3).toISOString();
  const out: Ev[] = [];
  for (let page = 0; page < 50; page++) {
    const { data, error } = await sb.from("events").select("*").gte("ts", since).order("ts", { ascending: false }).range(page * 1000, page * 1000 + 999);
    if (error) throw error;
    out.push(...(data as Ev[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

const n = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const host = (u: string | null) => { try { return u ? new URL(u).host.replace(/^www\./, "") : ""; } catch { return ""; } };
/** Human name for a path, basePath-agnostic. */
export function pageName(path: string) {
  const p = path.replace(/^\/trikhya-website/, "").replace(/\/+$/, "") || "/";
  const fixed: Record<string, string> = { "/": "Home", "/services": "Services", "/solutions": "Solutions", "/about": "About", "/insights": "Insights", "/careers": "Careers", "/contact": "Contact", "/privacy": "Privacy policy", "/terms": "Terms of use", "/admin": "Admin" };
  if (fixed[p]) return fixed[p];
  if (p === NLQ.href.replace(/\/$/, "")) return `Solution · ${NLQ.title}`;
  const ins = INSIGHTS.find((i) => p === `/insights/${i.slug}`); if (ins) return `Insight · ${ins.title}`;
  return p;
}
export const device = (w: number | null) => (w == null ? "unknown" : w < 768 ? "mobile" : w < 1200 ? "tablet / small laptop" : "desktop");

export type PageRow = { path: string; title: string; views: number; sessions: number; seconds: number; scroll: number; clicks: number; exits: number };
export type Count = { key: string; count: number };

export function aggregate(ev: Ev[], days: number) {
  const views = ev.filter((e) => e.name === "page_view");
  const leaves = ev.filter((e) => e.name === "page_leave");
  const clicks = ev.filter((e) => e.name === "click");
  const sessions = new Set(ev.map((e) => e.session_id));
  const visitors = new Set(ev.map((e) => e.visitor_id ?? e.session_id));
  const returning = new Set(ev.filter((e) => e.visitor_id).map((e) => e.visitor_id)).size;

  // Sessions with a single page view.
  const perSession = new Map<string, number>();
  views.forEach((v) => perSession.set(v.session_id, (perSession.get(v.session_id) ?? 0) + 1));
  const bounces = [...perSession.values()].filter((c) => c === 1).length;

  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const avgSeconds = avg(leaves.map((l) => n(l.props.seconds)));
  const avgScroll = avg(leaves.map((l) => n(l.props.scroll)));

  // Daily series.
  const day = (ts: string) => ts.slice(0, 10);
  const series: { day: string; views: number; sessions: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400e3).toISOString().slice(0, 10);
    const dv = views.filter((v) => day(v.ts) === d);
    series.push({ day: d, views: dv.length, sessions: new Set(dv.map((v) => v.session_id)).size });
  }

  // Pages.
  const pages = new Map<string, PageRow>();
  const row = (p: string, t: string | null) => { let r = pages.get(p); if (!r) { r = { path: p, title: t ?? p, views: 0, sessions: 0, seconds: 0, scroll: 0, clicks: 0, exits: 0 }; pages.set(p, r); } return r; };
  const sessByPage = new Map<string, Set<string>>();
  views.forEach((v) => { row(v.path, v.title).views++; (sessByPage.get(v.path) ?? sessByPage.set(v.path, new Set()).get(v.path)!).add(v.session_id); });
  const leaveByPage = new Map<string, { s: number[]; sc: number[] }>();
  leaves.forEach((l) => { const b = leaveByPage.get(l.path) ?? { s: [], sc: [] }; b.s.push(n(l.props.seconds)); b.sc.push(n(l.props.scroll)); leaveByPage.set(l.path, b); });
  clicks.forEach((c) => row(c.path, c.title).clicks++);
  // Exit = last page view of a session.
  const lastBySession = new Map<string, Ev>();
  [...views].sort((a, b) => a.ts.localeCompare(b.ts)).forEach((v) => lastBySession.set(v.session_id, v));
  lastBySession.forEach((v) => row(v.path, v.title).exits++);
  pages.forEach((r, p) => { r.sessions = sessByPage.get(p)?.size ?? 0; const b = leaveByPage.get(p); r.seconds = b ? avg(b.s) : 0; r.scroll = b ? avg(b.sc) : 0; });
  const pageRows = [...pages.values()].sort((a, b) => b.views - a.views);

  // Interactions per page, by label.
  const interactions = new Map<string, Count[]>();
  const byLabel = new Map<string, Map<string, number>>();
  ev.filter((e) => !["page_view", "page_leave"].includes(e.name)).forEach((e) => {
    const label = e.name === "click" ? String(e.props.label || e.props.href || "(unlabelled)") : `${e.name}${e.props.job ? ` · ${e.props.job}` : ""}`;
    const m = byLabel.get(e.path) ?? new Map(); m.set(label, (m.get(label) ?? 0) + 1); byLabel.set(e.path, m);
  });
  byLabel.forEach((m, p) => interactions.set(p, [...m.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count)));

  const countBy = (xs: Ev[], f: (e: Ev) => string): Count[] => {
    const m = new Map<string, number>(); xs.forEach((e) => { const k = f(e); if (k) m.set(k, (m.get(k) ?? 0) + 1); });
    return [...m.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
  };
  // First page view per session gives the entry referrer.
  const firstBySession = new Map<string, Ev>();
  [...views].sort((a, b) => a.ts.localeCompare(b.ts)).forEach((v) => { if (!firstBySession.has(v.session_id)) firstBySession.set(v.session_id, v); });
  const entries = [...firstBySession.values()];
  const referrers = countBy(entries, (e) => { const h = host(e.referrer); return !h || h === location.host ? "direct / none" : h; });
  const landing = countBy(entries, (e) => e.path);
  const devices = countBy(entries, (e) => device(e.screen_w));
  const languages = countBy(entries, (e) => (e.lang || "unknown").toLowerCase());
  const outbound = countBy(clicks.filter((c) => c.props.outbound), (c) => String(c.props.href || ""));

  // Careers funnel.
  const jobs = new Map<string, { opens: number; copies: number; applies: number; applied: number }>();
  ev.forEach((e) => {
    const j = e.props.job as string | undefined; if (!j) return;
    const r = jobs.get(j) ?? { opens: 0, copies: 0, applies: 0, applied: 0 };
    if (e.name === "job_open") r.opens++; else if (e.name === "job_link_copy") r.copies++; else if (e.name === "job_apply") r.applies++; else if (e.name === "job_applied") r.applied++;
    jobs.set(j, r);
  });

  const godseye = { opens: ev.filter((e) => e.name === "godseye_open").length, questions: ev.filter((e) => e.name === "godseye_question") };
  const contact = ev.filter((e) => e.name === "contact_submit").length;

  return { total: ev.length, views: views.length, sessions: sessions.size, visitors: visitors.size, returning, bounceRate: perSession.size ? bounces / perSession.size : 0, avgSeconds, avgScroll, series, pageRows, interactions, referrers, landing, devices, languages, outbound, jobs, godseye, contact };
}

export type Agg = ReturnType<typeof aggregate>;
