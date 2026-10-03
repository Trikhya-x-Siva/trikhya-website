"use client";

import { Fragment, useRef, useState } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
import { withBase } from "@/lib/paths";

export function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  const [sent, setSent] = useState(false);
  const notSent = !sent;
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
<section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: "-81px", paddingTop: "81px" }}>
<img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: ".12", pointerEvents: "none" }} />
<div style={{ position: "relative", maxWidth: "1360px", margin: "0 auto", padding: "clamp(56px,8vw,110px) clamp(20px,5vw,40px) clamp(64px,8vw,110px)", display: "flex", flexDirection: "column", gap: "28px" }}>
<div data-word="1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".18em", display: "flex", gap: "12px", alignItems: "center" }}><span style={{ width: "28px", height: "1px", background: "#ffffff" }}></span>CONTACT</div>
<h1 style={{ margin: "0", fontSize: "clamp(46px,6.6vw,100px)", lineHeight: ".95", fontWeight: "800", letterSpacing: "-.045em", maxWidth: "1050px" }}><span data-word="1" style={{ display: "inline-block" }}>Bring</span> <span data-word="1" style={{ display: "inline-block" }}>us</span> <span data-word="1" style={{ display: "inline-block" }}>the</span> <span data-word="1" style={{ display: "inline-block" }}>problem.</span> <span data-word="1" style={{ display: "inline-block" }}>We’ll</span> <span data-word="1" style={{ display: "inline-block" }}>bring</span> <span data-word="1" style={{ display: "inline-block" }}>the</span> <span data-word="1" style={{ display: "inline-block", color: "#BFE6FA" }}>machinery.</span></h1>
<p data-word="1" style={{ margin: "0", fontSize: "clamp(18px,1.7vw,23px)", lineHeight: "1.5", maxWidth: "660px", textWrap: "pretty" }}>Whether it is a first idea or a stalled pilot, we would like to hear about it.</p>
</div>
</section>

<section id="contact" style={{ background: "#0E1116", color: "#ffffff" }}>
<div style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(64px,9vw,120px) clamp(20px,5vw,40px) clamp(80px,11vw,140px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "72px" }}>
<div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
<span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", letterSpacing: ".16em", color: "#4FB8EE" }}>SEND A MESSAGE</span>
<h2 style={{ margin: "0", fontSize: "clamp(36px,4.2vw,60px)", lineHeight: "1", fontWeight: "800", letterSpacing: "-.035em" }}>Tell us what you’re working on.</h2>
<p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#aab3bf", maxWidth: "520px" }}>A few lines is enough. We reply within two working days.</p>
<a href="mailto:hello@trikhya.ai?subject=Project%20enquiry%20for%20Trikhya" data-sweep="1" style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "14px", border: "1.5px solid #4FB8EE", color: "#4FB8EE", fontWeight: "700", fontSize: "17px", padding: "16px 26px", borderRadius: "999px" }}><span>✉</span><span>Email us directly</span></a>
</div>
<div data-reveal="1">
{notSent ? (<>
<form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" }}>
<label style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8a94a1" }}>NAME<input required style={{ background: "transparent", border: "none", borderBottom: "1.5px solid #3a4250", color: "#ffffff", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: "19px", padding: "10px 0", outline: "none", letterSpacing: "0" }} data-focus="border-bottom-color:#4FB8EE;" /></label>
<label style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8a94a1" }}>WORK EMAIL<input type="email" required style={{ background: "transparent", border: "none", borderBottom: "1.5px solid #3a4250", color: "#ffffff", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: "19px", padding: "10px 0", outline: "none", letterSpacing: "0" }} data-focus="border-bottom-color:#4FB8EE;" /></label>
</div>
<label style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8a94a1" }}>COMPANY<input style={{ background: "transparent", border: "none", borderBottom: "1.5px solid #3a4250", color: "#ffffff", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: "19px", padding: "10px 0", outline: "none", letterSpacing: "0" }} data-focus="border-bottom-color:#4FB8EE;" /></label>
<label style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8a94a1" }}>WHAT ARE YOU TRYING TO CHANGE?<textarea rows={4} style={{ background: "transparent", border: "none", borderBottom: "1.5px solid #3a4250", color: "#ffffff", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: "19px", padding: "10px 0", outline: "none", resize: "vertical", letterSpacing: "0" }} data-focus="border-bottom-color:#4FB8EE;"></textarea></label>
<button type="submit" data-magnet="1" style={{ alignSelf: "flex-start", marginTop: "12px", background: "#4FB8EE", color: "#0E1116", border: "none", fontWeight: "700", fontSize: "17px", padding: "18px 32px", borderRadius: "999px", cursor: "pointer" }} data-hover="background:#8fd3f7;">Send message →</button>
</form>
</>) : null}
{sent ? (<>
<div style={{ border: "1px solid #2a313c", padding: "48px", display: "flex", flexDirection: "column", gap: "12px" }}>
<span style={{ fontSize: "32px", fontWeight: "800", color: "#4FB8EE" }}>Message received.</span>
<span style={{ fontSize: "18px", color: "#aab3bf" }}>We’ll be in touch within two working days.</span>
</div>
</>) : null}
</div>
</div>
</section>
    </div>
  );
}
