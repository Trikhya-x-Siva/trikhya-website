"use client";

import { useRef } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
import { FeaturedSolution } from "@/components/solutions/FeaturedSolution";
import { withBase } from "@/lib/paths";

export function SolutionsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: ".12", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(56px,8vw,110px) clamp(20px,5vw,40px) clamp(64px,8vw,110px)", display: "flex", flexDirection: "column", gap: "28px" }}>
<div data-word="1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".18em", display: "flex", gap: "12px", alignItems: "center" }}><span style={{ width: "28px", height: "1px", background: "#ffffff" }}></span>SOLUTIONS</div>
<h1 style={{ margin: "0", fontSize: "clamp(46px,6.6vw,100px)", lineHeight: ".95", fontWeight: "800", letterSpacing: "-.045em", maxWidth: "1050px" }}><span data-word="1" style={{ display: "inline-block" }}>Patterns</span> <span data-word="1" style={{ display: "inline-block" }}>proven</span> <span data-word="1" style={{ display: "inline-block" }}>in</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>production.</span></h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "660px", textWrap: "pretty" }}>Each solution was built for a real client, then generalised into a pattern we can adapt for the next. Client names stay private.</p>
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
</div>
</section>

<section style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-120px", bottom: "-200px", width: "520px", opacity: ".12", pointerEvents: "none" }} />
<div data-reveal="1" style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(72px,9vw,120px) clamp(20px,5vw,40px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", maxWidth: "760px" }}>Want one of these, shaped to your business?</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
<a href={withBase("/contact/")} data-magnet="1" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: "700", fontSize: "17px", padding: "18px 30px", borderRadius: "999px" }} data-hover="background:#BFE6FA;color:#0F4A70;">Talk to us →</a>
<a href={withBase("/services/")} data-sweep="#ffffff" data-sweep-ink="#0F4A70" style={{ border: "1.5px solid rgba(255,255,255,.7)", color: "#ffffff", fontWeight: "600", fontSize: "17px", padding: "17px 28px", borderRadius: "999px" }}>Our services</a>
</div>
</div>
</section>
    </div>
  );
}
