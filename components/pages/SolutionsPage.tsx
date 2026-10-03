"use client";

import { Fragment, useRef } from "react";
import { usePageMotion, useTyped } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
const solutions = [
  { tag: "02 · B-AI-B", title: "Document & knowledge assistants", body: "Search, summarise and answer across contracts, manuals and internal knowledge, with citations." },
  { tag: "03 · B-AI-B", title: "Multi-step workflow agents", body: "Agents that carry routine processes from intake to completion, handing off to people at the right moments." },
  { tag: "04 · B-AI-C", title: "Customer-facing assistants", body: "AI that answers customers in your voice, follows your policies and escalates when a human is needed." },
];

export function SolutionsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  const { typed, ansOpacity, ansShift } = useTyped("Which orders are going to be late this week?");
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: ".12", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "110px 40px 110px", display: "flex", flexDirection: "column", gap: "28px" }}>
<div data-word="1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".18em", display: "flex", gap: "12px", alignItems: "center" }}><span style={{ width: "28px", height: "1px", background: "#ffffff" }}></span>SOLUTIONS</div>
<h1 style={{ margin: "0", fontSize: "clamp(46px,6.6vw,100px)", lineHeight: ".95", fontWeight: "800", letterSpacing: "-.045em", maxWidth: "1050px" }}><span data-word="1" style={{ display: "inline-block" }}>Patterns</span> <span data-word="1" style={{ display: "inline-block" }}>proven</span> <span data-word="1" style={{ display: "inline-block" }}>in</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>production.</span></h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "660px", textWrap: "pretty" }}>Each solution was built for a real client, then generalised into a pattern we can adapt for the next. Client names stay private.</p>
</div>
</section>

<section id="solutions" style={{ background: "#0E1116", color: "#ffffff" }}>
<div style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "72px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "860px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#4FB8EE" }}>SOLUTIONS</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", textWrap: "balance" }}>What we’ve already built.</h2>
<p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#aab3bf", maxWidth: "640px" }}>Each solution is shaped around one client, then generalised into a pattern we can bring to the next. Client names stay private.</p>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: "56px", alignItems: "center" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".12em", color: "#8a94a1" }}>01 · B-AI-B</span>
<span style={{ fontSize: "clamp(28px,2.6vw,38px)", fontWeight: "800", letterSpacing: "-.02em", lineHeight: "1.1" }}>Ask-your-business analytics</span>
<span style={{ fontSize: "18px", lineHeight: "1.55", color: "#aab3bf", maxWidth: "520px" }}>Managers ask questions in everyday language and get precise answers drawn from the company’s own systems, with the source records shown alongside.</span>
</div>
<div data-reveal="1" data-wipe="1" style={{ background: "#161a21", border: "1px solid #2a313c", boxShadow: "0 40px 90px rgba(0,0,0,.5)", display: "flex", flexDirection: "column" }}>
<div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #2a313c", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "#7d8794" }}><span>analytics-assistant</span><span style={{ color: "#5fd39a" }}>● systems connected</span></div>
<div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "22px", minHeight: "360px" }}>
<div style={{ alignSelf: "flex-end", background: "#232a34", padding: "14px 18px", fontSize: "17px", maxWidth: "88%", minHeight: "24px" }}><span>{typed}</span><span style={{ display: "inline-block", width: "2px", height: "18px", background: "#4FB8EE", marginLeft: "2px", verticalAlign: "-3px", animation: "blink 1s steps(1) infinite" }}></span></div>
<div style={{ display: "flex", flexDirection: "column", gap: "14px", opacity: `${ansOpacity}`, transform: `translateY(${ansShift}px)`, transition: "opacity .5s,transform .5s" }}>
<div style={{ fontSize: "16px", lineHeight: "1.5", color: "#dde2e8" }}><b style={{ color: "#4FB8EE" }}>3 orders</b> are at risk this week. All three depend on the same delayed input.</div>
<div style={{ border: "1px solid #2a313c", fontFamily: "'JetBrains Mono',monospace", fontSize: "13px" }}>
<div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr .8fr", padding: "10px 14px", color: "#7d8794", borderBottom: "1px solid #2a313c" }}><span>ORDER</span><span>CUSTOMER</span><span>DUE</span><span>SLIP</span></div>
<div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr .8fr", padding: "10px 14px", color: "#dde2e8", borderBottom: "1px solid #222831" }}><span>SO-48213</span><span>Customer A</span><span>Thu</span><span style={{ color: "#f0a35e" }}>+2d</span></div>
<div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr .8fr", padding: "10px 14px", color: "#dde2e8", borderBottom: "1px solid #222831" }}><span>SO-48230</span><span>Customer B</span><span>Fri</span><span style={{ color: "#f0a35e" }}>+1d</span></div>
<div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr .8fr", padding: "10px 14px", color: "#dde2e8" }}><span>SO-48251</span><span>Customer C</span><span>Fri</span><span style={{ color: "#ef6b6b" }}>+4d</span></div>
</div>
<div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#7d8794" }}>SOURCES · orders, schedules · 1.8s</div>
</div>
</div>
</div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1px", background: "#2a313c", border: "1px solid #2a313c" }}>
{solutions.map((s, i) => (<Fragment key={i}>
<div data-reveal="1" data-spot="1" style={{ background: "#0E1116", padding: "36px 32px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "240px", transition: "background .25s" }} data-hover="background:#161a21;">
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".12em", color: "#4FB8EE" }}>{s.tag}</span>
<span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-.01em", lineHeight: "1.2" }}>{s.title}</span>
<span style={{ fontSize: "17px", lineHeight: "1.55", color: "#aab3bf" }}>{s.body}</span>
</div>
</Fragment>))}
</div>
</div>
</section>

<section style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-120px", bottom: "-200px", width: "520px", opacity: ".12", pointerEvents: "none" }} />
<div data-reveal="1" style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "120px 40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", maxWidth: "760px" }}>Want one of these, shaped to your business?</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
<a href="/contact/" data-magnet="1" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: "700", fontSize: "17px", padding: "18px 30px", borderRadius: "999px" }} data-hover="background:#BFE6FA;color:#0F4A70;">Talk to us →</a>
<a href="/services/" data-sweep="#ffffff" data-sweep-ink="#0F4A70" style={{ border: "1.5px solid rgba(255,255,255,.7)", color: "#ffffff", fontWeight: "600", fontSize: "17px", padding: "17px 28px", borderRadius: "999px" }}>Our services</a>
</div>
</div>
</section>
    </div>
  );
}
