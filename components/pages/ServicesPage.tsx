"use client";

import { Fragment, useRef } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
import { withBase } from "@/lib/paths";
const services = [
  { n: "01", title: "AI strategy & discovery", body: "We find the decisions where AI pays back first, and define how success will be measured." },
  { n: "02", title: "Data & systems integration", body: "Connecting the tools, databases and documents you already use into a layer AI can reason over safely." },
  { n: "03", title: "Custom assistants & agents", body: "Purpose-built AI for your teams or your customers, tuned to your language and rules." },
  { n: "04", title: "Deployment & operations", body: "Evaluation, monitoring and continuous improvement after go-live. We stay accountable." },
];
const phases = [
  { when: "WEEK 0–2", title: "Discover", body: "Interviews, a data review and a shortlist of the problems most worth solving." },
  { when: "WEEK 2–6", title: "Prototype", body: "A working version on your real data, tried by the people who will use it." },
  { when: "WEEK 6–18", title: "Deploy", body: "Around three months to harden, secure and roll out across the wider organisation." },
  { when: "ONGOING", title: "Evolve", body: "Monitoring, feedback loops and new capabilities as your needs grow." },
];
const offerings = [
  { n: "01", title: "Generalist AI Accelerators", body: "Speed up core business processes with adaptable, high-speed intelligence designed for broad applicability. Our accelerators integrate seamlessly into your existing stack." },
  { n: "02", title: "Specialized AI Workflows", body: "End-to-end automation pipelines custom-built for complex, multi-step operations in your specific stack." },
  { n: "03", title: "Domain Adapted Intelligence", body: "Fine-tuned models that understand the nuance, jargon, and specific constraints of your industry." },
];

export function ServicesPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: ".12", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "110px 40px 110px", display: "flex", flexDirection: "column", gap: "28px" }}>
<div data-word="1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".18em", display: "flex", gap: "12px", alignItems: "center" }}><span style={{ width: "28px", height: "1px", background: "#ffffff" }}></span>SERVICES</div>
<h1 style={{ margin: "0", fontSize: "clamp(46px,6.6vw,100px)", lineHeight: ".95", fontWeight: "800", letterSpacing: "-.045em", maxWidth: "1050px" }}><span data-word="1" style={{ display: "inline-block" }}>From</span> <span data-word="1" style={{ display: "inline-block" }}>first</span> <span data-word="1" style={{ display: "inline-block" }}>sketch</span> <span data-word="1" style={{ display: "inline-block" }}>to</span> <span data-word="1" style={{ display: "inline-block" }}>everyday</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>systems.</span></h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "660px", textWrap: "pretty" }}>We take AI from an idea on a whiteboard to a system your teams or customers use every day, and we stay accountable after launch.</p>
</div>
</section>

<section id="services" style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "64px" }}>
<div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: "32px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "760px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>WHAT WE FORGE</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>From first sketch to systems that run every day.</h2>
</div>
<a href={withBase("/contact/")} style={{ fontWeight: "700", fontSize: "17px", color: "#1670A6", borderBottom: "2px solid #1670A6", paddingBottom: "4px" }}>Discuss your use case →</a>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1px", background: "#d5dbe2", border: "1px solid #d5dbe2" }}>
{services.map((s, i) => (<Fragment key={i}>
<div data-reveal="1" data-spot="1" style={{ background: "#F4F6F8", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "18px", minHeight: "300px", transition: "background .25s" }} data-hover="background:#ffffff;">
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "#1670A6", letterSpacing: ".12em" }}>{s.n}</span>
<span style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.15" }}>{s.title}</span>
<span style={{ fontSize: "17px", lineHeight: "1.55", color: "#4a5260" }}>{s.body}</span>
</div>
</Fragment>))}
</div>
</section>

<section style={{ background: "#0E1116", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<div data-blueprint="1" style={{ position: "absolute", inset: "0", pointerEvents: "none" }}></div>
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "56px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "760px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#4FB8EE" }}>HOW WE DELIVER</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Three ways we put intelligence to work.</h2>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "40px" }}>
{offerings.map((o, i) => (<Fragment key={i}>
<div data-reveal="1" data-tilt="1" style={{ borderTop: "2px solid #4FB8EE", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".12em", color: "#8a94a1" }}>{o.n}</span>
<span style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.15" }}>{o.title}</span>
<span style={{ fontSize: "17px", lineHeight: "1.55", color: "#aab3bf" }}>{o.body}</span>
</div>
</Fragment>))}
</div>
</div></section>

<section style={{ background: "#E7ECF1" }}>
<div style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "56px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "760px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>HOW AN ENGAGEMENT RUNS</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Weeks to first value, not quarters.</h2>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px" }}>
{phases.map((p, i) => (<Fragment key={i}>
<div data-reveal="1" style={{ background: "#ffffff", padding: "32px 28px", display: "flex", flexDirection: "column", gap: "14px", borderTop: "4px solid #1670A6" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "#5b6370" }}>{p.when}</span>
<span style={{ fontSize: "24px", fontWeight: "700" }}>{p.title}</span>
<span style={{ fontSize: "16px", lineHeight: "1.55", color: "#4a5260" }}>{p.body}</span>
</div>
</Fragment>))}
</div>
</div>
</section>

<section style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-120px", bottom: "-200px", width: "520px", opacity: ".12", pointerEvents: "none" }} />
<div data-reveal="1" style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "120px 40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", maxWidth: "760px" }}>Have a use case in mind?</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
<a href={withBase("/contact/")} data-magnet="1" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: "700", fontSize: "17px", padding: "18px 30px", borderRadius: "999px" }} data-hover="background:#BFE6FA;color:#0F4A70;">Discuss it with us →</a>
<a href={withBase("/solutions/")} data-sweep="#ffffff" data-sweep-ink="#0F4A70" style={{ border: "1.5px solid rgba(255,255,255,.7)", color: "#ffffff", fontWeight: "600", fontSize: "17px", padding: "17px 28px", borderRadius: "999px" }}>See solutions</a>
</div>
</div>
</section>
    </div>
  );
}
