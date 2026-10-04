"use client";

import { Fragment, useRef } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
import { FeaturedSolution } from "@/components/solutions/FeaturedSolution";
import { withBase } from "@/lib/paths";
import { INSIGHTS } from "@/content/insights";
import { InsightCard } from "@/components/insights/InsightCard";
const services = [
  { n: "01", title: "AI strategy & discovery", body: "We find the decisions where AI pays back first, and define how success will be measured." },
  { n: "02", title: "Data & systems integration", body: "Connecting the tools, databases and documents you already use into a layer AI can reason over safely." },
  { n: "03", title: "Custom assistants & agents", body: "Purpose-built AI for your teams or your customers, tuned to your language and rules." },
  { n: "04", title: "Deployment & operations", body: "Evaluation, monitoring and continuous improvement after go-live. We stay accountable." },
];
const offerings = [
  { n: "01", title: "Generalist AI Accelerators", body: "Speed up core business processes with adaptable, high-speed intelligence designed for broad applicability. Our accelerators integrate seamlessly into your existing stack." },
  { n: "02", title: "Specialized AI Workflows", body: "End-to-end automation pipelines custom-built for complex, multi-step operations in your specific stack." },
  { n: "03", title: "Domain Adapted Intelligence", body: "Fine-tuned models that understand the nuance, jargon, and specific constraints of your industry." },
];

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section id="top" style={{ position: "relative", zIndex: "0", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.25" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-12%", top: "6%", width: "min(62vw,880px)", opacity: ".12", pointerEvents: "none" }} />
<img data-spin="-1" data-parallax="0.5" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "8%", top: "30%", width: "min(22vw,300px)", opacity: ".10", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(64px,9vw,120px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", gap: "96px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "1000px" }}>
<h1 style={{ margin: "0", fontSize: "clamp(52px,8.2vw,124px)", lineHeight: ".94", fontWeight: "800", letterSpacing: "-.045em" }}>
<span data-word="1" style={{ display: "inline-block" }}>Where</span> <span data-word="1" style={{ display: "inline-block" }}>AI</span> <span data-word="1" style={{ display: "inline-block" }}>ambition</span> <span data-word="1" style={{ display: "inline-block" }}>becomes</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>working</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>machinery.</span>
</h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "640px", textWrap: "pretty" }}>We design and engineer AI with people at both ends: the ones who set the goal, and the ones who live with the result. In between, we build the intelligence that does the work.</p>
</div>
</div>
<div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,.25)", background: "#13628F", overflow: "hidden" }}>
<div data-ticker="1" style={{ display: "flex", width: "max-content", gap: "56px", padding: "18px 0", fontFamily: "'JetBrains Mono',monospace", fontSize: "14px", letterSpacing: ".12em", whiteSpace: "nowrap", color: "#d9eefb" }}>
<span>ERP</span><span>◆</span><span>CRM</span><span>◆</span><span>DOCUMENTS</span><span>◆</span><span>DATA WAREHOUSES</span><span>◆</span><span>SUPPORT DESKS</span><span>◆</span><span>FINANCE</span><span>◆</span><span>OPERATIONS</span><span>◆</span><span>SPREADSHEETS</span><span>◆</span><span>APIS</span><span>◆</span>
<span>ERP</span><span>◆</span><span>CRM</span><span>◆</span><span>DOCUMENTS</span><span>◆</span><span>DATA WAREHOUSES</span><span>◆</span><span>SUPPORT DESKS</span><span>◆</span><span>FINANCE</span><span>◆</span><span>OPERATIONS</span><span>◆</span><span>SPREADSHEETS</span><span>◆</span><span>APIS</span><span>◆</span>
</div>
</div>
</section>

<section style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(80px,11vw,140px) clamp(20px,5vw,40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "64px", alignItems: "end" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>THE GAP</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", textWrap: "balance" }}>Most AI never leaves the slide deck.</h2>
</div>
<p data-fill="1" style={{ margin: "0", fontSize: "21px", lineHeight: "1.55", color: "#0E1116", textWrap: "pretty" }}>Pilots impress in a meeting, then stall when they meet messy data, old systems and real users. Trikhya exists to close that gap. We stay through integration, rollout and adoption, until the system is part of how the business runs.</p>
</section>

<section id="method" style={{ background: "#0E1116", color: "#ffffff", position: "relative" }}>
<div data-blueprint="1" style={{ position: "absolute", inset: "0", pointerEvents: "none" }}></div>
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(80px,11vw,140px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", gap: "72px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "860px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#4FB8EE" }}>THE METHOD · H—AI—H</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", textWrap: "balance" }}>People at the start. People at the finish. Intelligence in between.</h2>
<p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#aab3bf", maxWidth: "680px" }}>Every system we build follows one loop. It works whether the person on the other end is your own team or your customer.</p>
</div>
<div data-pin="1" style={{ position: "relative", height: "220vh" }}><div style={{ position: "sticky", top: "180px" }}>
<div style={{ position: "relative" }}>
<div style={{ position: "absolute", left: "0", right: "0", top: "44px", height: "2px", background: "#232a34" }}></div>
<div data-pin-line="1" style={{ position: "absolute", left: "0", top: "44px", height: "2px", width: "100%", background: "#4FB8EE", transformOrigin: "left", transform: "scaleX(0)" }}></div>
<div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "40px" }}>
<div data-pin-step="1" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
<div style={{ width: "88px", height: "88px", borderRadius: "50%", border: "2px solid #4FB8EE", background: "#0E1116", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "30px", color: "#4FB8EE" }}>H</div>
<span style={{ fontSize: "28px", fontWeight: "700" }}>Frame the intent</span>
<span style={{ fontSize: "18px", lineHeight: "1.55", color: "#aab3bf" }}>We sit with the people who own the problem and define what a good answer looks like before any model is chosen.</span>
</div>
<div data-pin-step="1" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
<div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "#4FB8EE", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "28px", color: "#0E1116" }}>AI</div>
<span style={{ fontSize: "28px", fontWeight: "700" }}>Engineer the intelligence</span>
<span style={{ fontSize: "18px", lineHeight: "1.55", color: "#aab3bf" }}>Models, retrieval and agents connected to your real data, with guardrails, evaluation and citations built in.</span>
</div>
<div data-pin-step="1" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
<div style={{ width: "88px", height: "88px", borderRadius: "50%", border: "2px solid #4FB8EE", background: "#0E1116", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "30px", color: "#4FB8EE" }}>H</div>
<span style={{ fontSize: "28px", fontWeight: "700" }}>Deliver the outcome</span>
<span style={{ fontSize: "18px", lineHeight: "1.55", color: "#aab3bf" }}>Answers land with the people who decide, in the tools they already use. They can always see why.</span>
</div>
</div>
</div>
</div></div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "24px" }}>
<div data-reveal="1" data-tilt="1" style={{ border: "1px solid #2a313c", padding: "clamp(24px,5vw,36px)", display: "flex", flexDirection: "column", gap: "14px" }} data-hover="border-color:#4FB8EE;">
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "28px", fontWeight: "600", color: "#4FB8EE" }}>B-AI-B</span>
<span style={{ fontSize: "19px", lineHeight: "1.5", color: "#d4dae2" }}>Business to AI to business. Intelligence for your own teams: operations, planning, finance, leadership.</span>
</div>
<div data-reveal="1" data-tilt="1" style={{ border: "1px solid #2a313c", padding: "clamp(24px,5vw,36px)", display: "flex", flexDirection: "column", gap: "14px" }} data-hover="border-color:#4FB8EE;">
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "28px", fontWeight: "600", color: "#4FB8EE" }}>B-AI-C</span>
<span style={{ fontSize: "19px", lineHeight: "1.5", color: "#d4dae2" }}>Business to AI to customer. Intelligence that serves the people you sell to, with your standards intact.</span>
</div>
</div>
</div>
</section>

<section id="services" style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(80px,11vw,140px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", gap: "64px" }}>
<div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: "32px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "760px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>WHAT WE FORGE</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>From first sketch to systems that run every day.</h2>
</div>
<a href={withBase("/services/")} style={{ fontWeight: "700", fontSize: "17px", color: "#1670A6", borderBottom: "2px solid #1670A6", paddingBottom: "4px" }}>All services →</a>
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

<section id="solutions" style={{ background: "#0E1116", color: "#ffffff" }}>
<div style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(80px,11vw,140px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", gap: "72px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "860px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#4FB8EE" }}>SOLUTIONS</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", textWrap: "balance" }}>What we’ve already built.</h2>
<p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#aab3bf", maxWidth: "640px" }}>Built for one client, in production today, and generalised into a pattern we can bring to the next. Client names stay private.</p>
</div>
<FeaturedSolution />
<div data-reveal="1"><a href={withBase("/solutions/")} style={{ fontWeight: "700", fontSize: "17px", color: "#4FB8EE", borderBottom: "2px solid #4FB8EE", paddingBottom: "4px", alignSelf: "flex-start" }} data-hover="color:#8fd3f7;border-bottom-color:#8fd3f7;">See all solutions →</a></div>
</div>
</section>

<section id="about" style={{ background: "#F4F6F8", color: "#0E1116" }}>
<div style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(48px,6vw,88px) clamp(20px,5vw,40px) clamp(56px,7vw,96px)", display: "flex", flexDirection: "column", gap: "56px" }}>
<div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "48px", alignItems: "end" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>THE FOUNDRY</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Engineers who ship, in a field full of demos.</h2>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}><p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#3b4350" }}>Trikhya means three. Three facets in our mark, three steps in every build: a person, the intelligence, a person again.</p>
<a href={withBase("/about/")} style={{ fontWeight: "700", fontSize: "17px", color: "#1670A6", borderBottom: "2px solid #1670A6", paddingBottom: "4px", alignSelf: "flex-start" }} data-hover="color:#0F4A70;border-bottom-color:#0F4A70;">Read our story →</a></div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "40px" }}>
{offerings.map((o, i) => (<Fragment key={i}>
<div data-reveal="1" data-tilt="1" style={{ borderTop: "2px solid #1670A6", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".12em", color: "#5b6370" }}>{o.n}</span>
<span style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-.015em", lineHeight: "1.15" }}>{o.title}</span>
<span style={{ fontSize: "17px", lineHeight: "1.55", color: "#3b4350" }}>{o.body}</span>
</div>
</Fragment>))}
</div>
</div>
</section>

<section id="insights" style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,40px) clamp(80px,11vw,140px)", display: "flex", flexDirection: "column", gap: "48px" }}>
<div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: "24px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>INSIGHTS</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,60px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Notes from the foundry floor.</h2>
</div>
<a href={withBase("/insights/")} style={{ fontWeight: "700", fontSize: "17px", color: "#1670A6", borderBottom: "2px solid #1670A6", paddingBottom: "4px" }}>All insights →</a>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "28px" }}>
{INSIGHTS.slice(0, 3).map((i, k) => <InsightCard key={i.slug} i={i} index={k} />)}
</div>
</section>

<section id="careers" style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", left: "-120px", bottom: "-200px", width: "520px", opacity: ".12", pointerEvents: "none" }} />
<div data-reveal="1" style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(72px,9vw,120px) clamp(20px,5vw,40px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "720px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em" }}>CAREERS</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Come build the real thing.</h2>
<p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55" }}>We hire engineers, data people and product thinkers who like seeing their work used on Monday morning.</p>
</div>
<a href={withBase("/careers/")} data-magnet="1" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: "700", fontSize: "17px", padding: "18px 30px", borderRadius: "999px" }} data-hover="background:#BFE6FA;color:#0F4A70;">See open roles →</a>
</div>
</section>

<section style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-120px", bottom: "-200px", width: "520px", opacity: ".12", pointerEvents: "none" }} />
<div data-reveal="1" style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(72px,9vw,120px) clamp(20px,5vw,40px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", maxWidth: "760px" }}>Bring us the problem. We’ll bring the machinery.</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
<a href={withBase("/contact/")} data-magnet="1" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: "700", fontSize: "17px", padding: "18px 30px", borderRadius: "999px" }} data-hover="background:#BFE6FA;color:#0F4A70;">Start a conversation →</a>
<a href="mailto:hello@trikhya.ai?subject=Project%20enquiry%20for%20Trikhya" data-sweep="#ffffff" data-sweep-ink="#0F4A70" style={{ border: "1.5px solid rgba(255,255,255,.7)", color: "#ffffff", fontWeight: "600", fontSize: "17px", padding: "17px 28px", borderRadius: "999px" }}>✉ Email us</a>
</div>
</div>
</section>
    </div>
  );
}
