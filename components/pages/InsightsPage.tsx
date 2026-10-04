"use client";

import { useRef } from "react";
import { INSIGHTS } from "@/content/insights";
import { InsightCard } from "@/components/insights/InsightCard";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
import { withBase } from "@/lib/paths";

export function InsightsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: ".12", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(56px,8vw,110px) clamp(20px,5vw,40px) clamp(64px,8vw,110px)", display: "flex", flexDirection: "column", gap: "28px" }}>
<div data-word="1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".18em", display: "flex", gap: "12px", alignItems: "center" }}><span style={{ width: "28px", height: "1px", background: "#ffffff" }}></span>INSIGHTS</div>
<h1 style={{ margin: "0", fontSize: "clamp(46px,6.6vw,100px)", lineHeight: ".95", fontWeight: "800", letterSpacing: "-.045em", maxWidth: "1050px" }}><span data-word="1" style={{ display: "inline-block" }}>Notes</span> <span data-word="1" style={{ display: "inline-block" }}>from</span> <span data-word="1" style={{ display: "inline-block" }}>the</span> <span data-word="1" style={{ display: "inline-block" }}>foundry</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>floor.</span></h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "660px", textWrap: "pretty" }}>Essays, engineering write-ups and field notes on taking AI from ambition to everyday use.</p>
</div>
</section>

<section id="insights" style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(80px,11vw,140px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", gap: "48px" }}>
<div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: "24px" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#1670A6" }}>INSIGHTS</span>
<h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,60px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Notes from the foundry floor.</h2>
</div>
<a href="#insights" style={{ fontWeight: "700", fontSize: "17px", color: "#1670A6", borderBottom: "2px solid #1670A6", paddingBottom: "4px" }}>All insights →</a>
</div>
<div data-htrack="1" style={{ position: "relative" }}><div style={{ position: "sticky", top: "140px", overflow: "hidden" }}><div data-htrack-row="1" style={{ display: "flex", gap: "28px", width: "max-content" }}>
{INSIGHTS.map((i, k) => <InsightCard key={i.slug} i={i} index={k} width="min(440px,78vw)" />)}
</div></div></div>
</section>

<section style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
<img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-120px", bottom: "-200px", width: "520px", opacity: ".12", pointerEvents: "none" }} />
<div data-reveal="1" style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(72px,9vw,120px) clamp(20px,5vw,40px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.6vw,64px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em", maxWidth: "760px" }}>Want to talk about any of this?</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
<a href={withBase("/contact/")} data-magnet="1" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: "700", fontSize: "17px", padding: "18px 30px", borderRadius: "999px" }} data-hover="background:#BFE6FA;color:#0F4A70;">Get in touch →</a>

</div>
</div>
</section>
    </div>
  );
}
