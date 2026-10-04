"use client";

import { NLQ } from "@/content/nlq";
import { useTyped } from "@/lib/page-motion";
import { withBase } from "@/lib/paths";

const MONO = "'JetBrains Mono',monospace";

/** The live query demo panel from the design, labelled for the assistant. */
export function QueryDemo({ minHeight = 360 }: { minHeight?: number }) {
  const { typed, ansOpacity, ansShift } = useTyped("Which orders are going to be late this week?");
  const row = (cells: [string, string, string, string], slipColor: string, last = false) => (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr .7fr .6fr", gap: 6, padding: "10px clamp(8px,3vw,14px)", color: "#dde2e8", borderBottom: last ? undefined : "1px solid #222831" }}>
      <span>{cells[0]}</span><span>{cells[1]}</span><span>{cells[2]}</span><span style={{ color: slipColor }}>{cells[3]}</span>
    </div>
  );
  return (
    <div data-wipe="1" style={{ background: "#161a21", border: "1px solid #2a313c", boxShadow: "0 40px 90px rgba(0,0,0,.5)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #2a313c", fontFamily: MONO, fontSize: 12, color: "#7d8794" }}>
        <span>query-assistant</span><span style={{ color: "#5fd39a" }}>● 3 systems connected</span>
      </div>
      <div style={{ padding: "clamp(18px,4vw,28px) clamp(14px,4vw,24px)", display: "flex", flexDirection: "column", gap: 22, minHeight }}>
        <div style={{ alignSelf: "flex-end", background: "#232a34", padding: "14px 18px", fontSize: 17, maxWidth: "88%", minHeight: 24 }}>
          <span>{typed}</span><span style={{ display: "inline-block", width: 2, height: 18, background: "#4FB8EE", marginLeft: 2, verticalAlign: -3, animation: "blink 1s steps(1) infinite" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: ansOpacity, transform: `translateY(${ansShift}px)`, transition: "opacity .5s,transform .5s" }}>
          <div style={{ fontSize: 16, lineHeight: 1.5, color: "#dde2e8" }}><b style={{ color: "#4FB8EE" }}>3 orders</b> are at risk this week. All three wait on the same delayed material.</div>
          <div style={{ border: "1px solid #2a313c", fontFamily: MONO, fontSize: 13 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr .7fr .6fr", gap: 6, padding: "10px clamp(8px,3vw,14px)", color: "#7d8794", borderBottom: "1px solid #2a313c" }}><span>ORDER</span><span>CUSTOMER</span><span>DUE</span><span>SLIP</span></div>
            {row(["SO-48213", "Customer A", "Thu", "+2d"], "#f0a35e")}
            {row(["SO-48230", "Customer B", "Fri", "+1d"], "#f0a35e")}
            {row(["SO-48251", "Customer C", "Fri", "+4d"], "#ef6b6b", true)}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: "#7d8794" }}>SOURCES · orders, materials, schedules · validated · 2.1s</div>
        </div>
      </div>
    </div>
  );
}

/** Featured solution card on Home and Solutions. The whole card links to the detail page. */
export function FeaturedSolution() {
  return (
    <a
      href={withBase(NLQ.href)}
      data-reveal="1"
      data-hover="border-color:#4FB8EE;transform:translateY(-4px);"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "clamp(32px,4vw,56px)", alignItems: "center", padding: "clamp(28px,4vw,48px)", border: "1px solid #2a313c", background: "#0E1116", color: "#ffffff", transition: "border-color .3s, transform .3s cubic-bezier(.2,.7,.2,1)" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontFamily: MONO, fontSize: 13, letterSpacing: ".12em" }}>
          <span style={{ color: "#8a94a1" }}>{NLQ.tag}</span>
          <span style={{ color: "#5fd39a" }}>● {NLQ.status.toUpperCase()}</span>
        </div>
        <span style={{ fontSize: "clamp(30px,2.8vw,42px)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.05 }}>{NLQ.title}</span>
        <span style={{ fontSize: 18, lineHeight: 1.55, color: "#aab3bf", maxWidth: 560 }}>{NLQ.summary}</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, borderTop: "1px solid #2a313c", paddingTop: 20 }}>
          {NLQ.stats.slice(0, 3).map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: 13, color: "#8a94a1", lineHeight: 1.35 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: "#4FB8EE", borderBottom: "2px solid #4FB8EE", paddingBottom: 4, alignSelf: "flex-start" }}>See how we built it →</span>
      </div>
      <QueryDemo />
    </a>
  );
}
