"use client";

import type { ReactNode } from "react";
import type { Solution } from "@/content/solutions";
import { useTyped } from "@/lib/page-motion";
import { withBase } from "@/lib/paths";
import { SolutionVideo } from "./SolutionVideo";

const MONO = "'JetBrains Mono',monospace";
const GRID = (cols: string): React.CSSProperties => ({ display: "grid", gridTemplateColumns: cols, gap: 6, padding: "10px clamp(8px,3vw,14px)" });

/** Dark terminal-style panel: a typed question, then the answer fades in. Shared by every solution demo. */
function Demo({ label, status, question, minHeight = 360, children }: { label: string; status: string; question: string; minHeight?: number; children: ReactNode }) {
  const { typed, ansOpacity, ansShift } = useTyped(question);
  return (
    <div data-wipe="1" style={{ background: "#161a21", border: "1px solid #2a313c", boxShadow: "0 40px 90px rgba(0,0,0,.5)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #2a313c", fontFamily: MONO, fontSize: 12, color: "#7d8794" }}>
        <span>{label}</span><span style={{ color: "#5fd39a" }}>● {status}</span>
      </div>
      <div style={{ padding: "clamp(18px,4vw,28px) clamp(14px,4vw,24px)", display: "flex", flexDirection: "column", gap: 22, minHeight }}>
        <div style={{ alignSelf: "flex-end", background: "#232a34", padding: "14px 18px", fontSize: 17, maxWidth: "88%", minHeight: 24 }}>
          <span>{typed}</span><span style={{ display: "inline-block", width: 2, height: 18, background: "#4FB8EE", marginLeft: 2, verticalAlign: -3, animation: "blink 1s steps(1) infinite" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: ansOpacity, transform: `translateY(${ansShift}px)`, transition: "opacity .5s,transform .5s" }}>{children}</div>
      </div>
    </div>
  );
}

function Table({ cols, head, rows }: { cols: string; head: string[]; rows: { cells: string[]; last?: string }[] }) {
  return (
    <div style={{ border: "1px solid #2a313c", fontFamily: MONO, fontSize: 13 }}>
      <div style={{ ...GRID(cols), color: "#7d8794", borderBottom: "1px solid #2a313c" }}>{head.map((h) => <span key={h}>{h}</span>)}</div>
      {rows.map((r, i) => (
        <div key={i} style={{ ...GRID(cols), color: "#dde2e8", borderBottom: i < rows.length - 1 ? "1px solid #222831" : undefined }}>
          {r.cells.map((c, j) => <span key={j} style={j === r.cells.length - 1 ? { color: r.last } : undefined}>{c}</span>)}
        </div>
      ))}
    </div>
  );
}

const Answer = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 16, lineHeight: 1.5, color: "#dde2e8" }}>{children}</div>;
const Foot = ({ children }: { children: ReactNode }) => <div style={{ fontFamily: MONO, fontSize: 11, color: "#7d8794" }}>{children}</div>;
const B = ({ children }: { children: ReactNode }) => <b style={{ color: "#4FB8EE" }}>{children}</b>;

export function QueryDemo({ minHeight }: { minHeight?: number }) {
  return (
    <Demo label="query-assistant" status="3 systems connected" question="Which orders are going to be late this week?" minHeight={minHeight}>
      <Answer><B>3 orders</B> are at risk this week. All three wait on the same delayed material.</Answer>
      <Table cols="1.2fr 1fr .7fr .6fr" head={["ORDER", "CUSTOMER", "DUE", "SLIP"]} rows={[
        { cells: ["SO-48213", "Customer A", "Thu", "+2d"], last: "#f0a35e" },
        { cells: ["SO-48230", "Customer B", "Fri", "+1d"], last: "#f0a35e" },
        { cells: ["SO-48251", "Customer C", "Fri", "+4d"], last: "#ef6b6b" },
      ]} />
      <Foot>SOURCES · orders, materials, schedules · validated · 2.1s</Foot>
    </Demo>
  );
}

export function TrainingDemo({ minHeight }: { minHeight?: number }) {
  return (
    <Demo label="module-player · fire safety" status="language locked: Hindi" question="Where do we assemble during a fire drill?" minHeight={minHeight}>
      <Answer>The assembly point is the <B>open yard outside the main gate</B>. Leave by the nearest marked exit, do not use the lifts, and report to your supervisor for the headcount.</Answer>
      <Table cols="1.4fr .8fr .8fr" head={["MODULE", "PROGRESS", "QUIZ"]} rows={[
        { cells: ["Industrial safety", "100%", "5 / 5"], last: "#5fd39a" },
        { cells: ["Fire safety", "62%", "due at 2:22"], last: "#f0a35e" },
        { cells: ["Culture & values", "0%", "—"], last: "#7d8794" },
      ]} />
      <Foot>SOURCE · module script, section 4 · spoken back in Hindi · 1.4s</Foot>
    </Demo>
  );
}

export function ScreenerDemo({ minHeight }: { minHeight?: number }) {
  return (
    <Demo label="resume-screener" status="24 PDFs · 3 at a time" question="Screen the batch for: Production Engineer" minHeight={minHeight}>
      <Answer><B>9 of 24</B> pass every hard requirement. Ranked by score, with the gap that cost the most.</Answer>
      <Table cols="1.2fr .6fr .8fr 1fr" head={["CANDIDATE", "SCORE", "HARD FILTER", "MISSING"]} rows={[
        { cells: ["Candidate A", "86", "pass", "AutoCAD (nice-to-have)"], last: "#dde2e8" },
        { cells: ["Candidate B", "74", "pass", "Marathi (write)"], last: "#f0a35e" },
        { cells: ["Candidate C", "58", "fail", "5S (must-have)"], last: "#ef6b6b" },
      ]} />
      <Foot>WEIGHTS · must-have 40 · nice-to-have 20 · experience 20 · education 10 · language 10 · 9 shortlisted → first-round calls queued</Foot>
    </Demo>
  );
}

const statusColor = (s: string) => (s === "In production" ? "#5fd39a" : "#f0a35e");

/** Large solution card with its live demo. The whole card links to the detail page. */
export function FeaturedSolution({ s, demo }: { s: Solution; demo: ReactNode }) {
  return (
    <a
      href={withBase(s.href)}
      data-reveal="1"
      data-hover="border-color:#4FB8EE;transform:translateY(-4px);"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "clamp(32px,4vw,56px)", alignItems: "center", padding: "clamp(28px,4vw,48px)", border: "1px solid #2a313c", background: "#0E1116", color: "#ffffff", transition: "border-color .3s, transform .3s cubic-bezier(.2,.7,.2,1)" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontFamily: MONO, fontSize: 13, letterSpacing: ".12em" }}>
          <span style={{ color: "#8a94a1" }}>{s.tag}</span>
          <span style={{ color: statusColor(s.status) }}>● {s.status.toUpperCase()}</span>
        </div>
        <span style={{ fontSize: "clamp(30px,2.8vw,42px)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.05 }}>{s.title}</span>
        <span style={{ fontSize: 18, lineHeight: 1.55, color: "#aab3bf", maxWidth: 560 }}>{s.summary}</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, borderTop: "1px solid #2a313c", paddingTop: 20 }}>
          {s.stats.slice(0, 3).map((st) => (
            <div key={st.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>{st.value}</span>
              <span style={{ fontSize: 13, color: "#8a94a1", lineHeight: 1.35 }}>{st.label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: "#4FB8EE", borderBottom: "2px solid #4FB8EE", paddingBottom: 4, alignSelf: "flex-start" }}>See how we built it →</span>
      </div>
      {s.video ? <SolutionVideo video={s.video} /> : demo}
    </a>
  );
}

