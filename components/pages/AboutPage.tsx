"use client";

import { Fragment, useRef } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
const principles = [
  { n: "01", title: "Ship, then refine", body: "A working system in real hands teaches more than any slide. We get there early and improve from use." },
  { n: "02", title: "People stay in charge", body: "AI extends human judgement. It doesn’t quietly replace it." },
  { n: "03", title: "Show the working", body: "Everything we build can explain where its answers come from." },
  { n: "04", title: "Own the outcome", body: "We measure ourselves by what changes in your business, not by what we delivered." },
];

export function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: ".12", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "120px 40px 120px", display: "flex", flexDirection: "column", gap: "28px" }}>
<div data-word="1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".18em", display: "flex", gap: "12px", alignItems: "center" }}><span style={{ width: "28px", height: "1px", background: "#ffffff" }}></span>OUR STORY</div>
<h1 style={{ margin: "0", fontSize: "clamp(48px,7vw,108px)", lineHeight: ".95", fontWeight: "800", letterSpacing: "-.045em", maxWidth: "1050px" }}>
<span data-word="1" style={{ display: "inline-block" }}>We</span> <span data-word="1" style={{ display: "inline-block" }}>started</span> <span data-word="1" style={{ display: "inline-block" }}>a</span> <span data-word="1" style={{ display: "inline-block" }}>foundry</span> <span data-word="1" style={{ display: "inline-block" }}>because</span> <span data-word="1" style={{ display: "inline-block" }}>AI</span> <span data-word="1" style={{ display: "inline-block" }}>needed</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>makers.</span>
</h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "660px", textWrap: "pretty" }}>There was no shortage of ideas about what AI could do. There was a shortage of people willing to build it properly, inside real businesses, and stay until it worked.</p>
</div>
</section>

<section style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "64px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>HOW IT BEGAN</span>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.2vw,60px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", textWrap: "balance" }}>From promising pilots to systems people rely on.</h2>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: "20px", lineHeight: "1.6", color: "#3b4350" }}>
<p data-reveal="1" style={{ margin: "0", textWrap: "pretty" }}>[Founding story placeholder.] Trikhya was founded by engineers who had watched too many AI initiatives stall between the demo and the day-to-day. The technology was ready. What was missing was the craft of fitting it into how a business actually works.</p>
<p data-fill="1" style={{ margin: "0", textWrap: "pretty", color: "#0E1116" }}>So we set up as a foundry: a place where raw capability is shaped into something solid and dependable. We work closely with the people who own a problem, engineer the intelligence that solves it, and hand it back in a form they can trust.</p>
</div>
</section>

<section style={{ background: "#0E1116", color: "#ffffff" }}>
<div style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "64px" }}>
<div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "48px", alignItems: "center" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#4FB8EE" }}>THE NAME</span>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.2vw,60px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Trikhya: built on three.</h2>
<p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#aab3bf", maxWidth: "560px" }}>Our mark is three facets locked into one form. Each stands for a part of the loop behind everything we make.</p>
</div>
<div style={{ display: "flex", justifyContent: "center" }}><div data-assemble="1" role="img" aria-label="Trikhya mark" style={{ width: "min(70%,340px)", aspectRatio: "570/530" }}></div></div>
</div>
<div data-flow="1" style={{ position: "relative", height: "90px" }}></div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "40px" }}>
<div data-reveal="1" style={{ borderTop: "2px solid #4FB8EE", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".12em", color: "#8a94a1" }}>FACET 01 · HUMAN</span><span style={{ fontSize: "26px", fontWeight: "700" }}>Intent</span><span style={{ fontSize: "17px", lineHeight: "1.55", color: "#aab3bf" }}>People decide what is worth solving and what success looks like.</span></div>
<div data-reveal="1" style={{ borderTop: "2px solid #4FB8EE", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".12em", color: "#8a94a1" }}>FACET 02 · AI</span><span style={{ fontSize: "26px", fontWeight: "700" }}>Engineering</span><span style={{ fontSize: "17px", lineHeight: "1.55", color: "#aab3bf" }}>Intelligence is designed, connected and tested against the real world.</span></div>
<div data-reveal="1" style={{ borderTop: "2px solid #4FB8EE", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".12em", color: "#8a94a1" }}>FACET 03 · HUMAN</span><span style={{ fontSize: "26px", fontWeight: "700" }}>Impact</span><span style={{ fontSize: "17px", lineHeight: "1.55", color: "#aab3bf" }}>Results reach teams and customers in a form they can understand and act on.</span></div>
</div>
</div>
</section>

<section style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "56px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "760px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>WHAT WE STAND FOR</span>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.2vw,60px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Principles we build by.</h2>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1px", background: "#d5dbe2", border: "1px solid #d5dbe2" }}>
{principles.map((p, i) => (<Fragment key={i}>
<div data-reveal="1" data-spot="1" style={{ background: "#F4F6F8", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "240px", transition: "background .25s" }} data-hover="background:#ffffff;">
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "#1670A6", letterSpacing: ".12em" }}>{p.n}</span>
<span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-.01em", lineHeight: "1.2" }}>{p.title}</span>
<span style={{ fontSize: "17px", lineHeight: "1.55", color: "#4a5260" }}>{p.body}</span>
</div>
</Fragment>))}
</div>
</section>

<section style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-120px", bottom: "-200px", width: "520px", opacity: ".12", pointerEvents: "none" }} />
<div data-reveal="1" style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "120px 40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", maxWidth: "760px" }}>Have something worth building? Let’s talk.</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
<a href="mailto:hello@trikhya.ai?subject=Project%20enquiry%20for%20Trikhya" data-magnet="1" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: "700", fontSize: "17px", padding: "18px 30px", borderRadius: "999px" }} data-hover="background:#BFE6FA;color:#0F4A70;">✉ Email us</a>
<a href="/careers/" data-sweep="#ffffff" data-sweep-ink="#0F4A70" style={{ border: "1.5px solid rgba(255,255,255,.7)", color: "#ffffff", fontWeight: "600", fontSize: "17px", padding: "17px 28px", borderRadius: "999px" }}>Join the team</a>
</div>
</div>
</section>
    </div>
  );
}
