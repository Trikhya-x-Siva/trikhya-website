"use client";

import { Fragment, useRef } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
const roles = [
  { title: "AI Engineer", team: "Engineering", where: "Location · placeholder" },
  { title: "Forward-Deployed Engineer", team: "Delivery", where: "Location · placeholder" },
  { title: "Data Engineer", team: "Engineering", where: "Location · placeholder" },
  { title: "Product Designer", team: "Product", where: "Location · placeholder" },
];

export function CareersPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: ".12", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "110px 40px 110px", display: "flex", flexDirection: "column", gap: "28px" }}>
<div data-word="1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".18em", display: "flex", gap: "12px", alignItems: "center" }}><span style={{ width: "28px", height: "1px", background: "#ffffff" }}></span>CAREERS</div>
<h1 style={{ margin: "0", fontSize: "clamp(46px,6.6vw,100px)", lineHeight: ".95", fontWeight: "800", letterSpacing: "-.045em", maxWidth: "1050px" }}><span data-word="1" style={{ display: "inline-block" }}>Come</span> <span data-word="1" style={{ display: "inline-block" }}>build</span> <span data-word="1" style={{ display: "inline-block" }}>the</span> <span data-word="1" style={{ display: "inline-block" }}>real</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>thing.</span></h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "660px", textWrap: "pretty" }}>We hire engineers, data people and product thinkers who like seeing their work used on Monday morning.</p>
</div>
</section>

<section style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "56px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "760px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>WHY TRIKHYA</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Work that leaves the lab.</h2>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "40px" }}>
<div data-reveal="1" style={{ borderTop: "2px solid #1670A6", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}><span style={{ fontSize: "24px", fontWeight: "700" }}>Real systems, real users</span><span style={{ fontSize: "17px", lineHeight: "1.55", color: "#4a5260" }}>What you build goes into production and gets used by the people it was built for.</span></div>
<div data-reveal="1" style={{ borderTop: "2px solid #1670A6", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}><span style={{ fontSize: "24px", fontWeight: "700" }}>Small team, wide scope</span><span style={{ fontSize: "17px", lineHeight: "1.55", color: "#4a5260" }}>You’ll work across discovery, engineering and delivery, close to clients.</span></div>
<div data-reveal="1" style={{ borderTop: "2px solid #1670A6", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}><span style={{ fontSize: "24px", fontWeight: "700" }}>Craft over hype</span><span style={{ fontSize: "17px", lineHeight: "1.55", color: "#4a5260" }}>We care about evaluation, reliability and clear reasoning more than demos.</span></div>
</div>
</section>

<section style={{ background: "#0E1116", color: "#ffffff" }}>
<div style={{ maxWidth: "1360px", margin: "0 auto", padding: "140px 40px", display: "flex", flexDirection: "column", gap: "48px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#4FB8EE" }}>OPEN ROLES</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Current openings.</h2>
</div>
<div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #2a313c" }}>
{roles.map((r, i) => (<Fragment key={i}>
<a href="mailto:careers@trikhya.ai?subject=Application%20at%20Trikhya" data-reveal="1" data-spot="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", alignItems: "center", padding: "28px 0", borderBottom: "1px solid #2a313c", color: "#ffffff", transition: "padding .25s" }} data-hover="color:#4FB8EE;padding-left:12px;">
<span style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-.01em" }}>{r.title}</span>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".1em", color: "#8a94a1" }}>{r.team}</span>
<span style={{ fontSize: "16px", color: "#aab3bf" }}>{r.where}</span>
<span style={{ fontWeight: "700", fontSize: "16px", justifySelf: "end" }}>Apply →</span>
</a>
</Fragment>))}
</div>
<p data-reveal="1" style={{ margin: "0", fontSize: "18px", color: "#aab3bf" }}>Don’t see your role? Write to <a href="mailto:careers@trikhya.ai" style={{ color: "#4FB8EE" }}>careers@trikhya.ai</a>.</p>
</div>
</section>
    </div>
  );
}
