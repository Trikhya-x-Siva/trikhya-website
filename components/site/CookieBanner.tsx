"use client";

import { useEffect, useState } from "react";
import { withBase } from "@/lib/paths";

const KEY = "trikhya-consent";
const E = "cubic-bezier(.2,.7,.2,1)";

type Consent = { choice: "all" | "essential"; at: string };

export function readConsent(): Consent | null {
  try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as Consent) : null; } catch { return null; }
}

/** Cookie notice. Shown once; the footer "Cookies" link reopens it via the `trikhya:cookies` event. */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const c = readConsent();
    const expired = c ? Date.now() - new Date(c.at).getTime() > 365 * 86400e3 : true;
    let t: number | undefined;
    if (!c || expired) t = window.setTimeout(() => { setShown(true); requestAnimationFrame(() => setOpen(true)); }, 900);
    const reopen = () => { setShown(true); requestAnimationFrame(() => setOpen(true)); };
    addEventListener("trikhya:cookies", reopen);
    return () => { clearTimeout(t); removeEventListener("trikhya:cookies", reopen); };
  }, []);

  const choose = (choice: Consent["choice"]) => {
    try { localStorage.setItem(KEY, JSON.stringify({ choice, at: new Date().toISOString() })); } catch { /* storage blocked */ }
    setOpen(false); setTimeout(() => setShown(false), 500);
  };

  if (!shown) return null;
  return (
    <div role="dialog" aria-label="Cookie notice" aria-live="polite" style={{ position: "fixed", left: 24, bottom: 24, zIndex: 60, width: "min(440px, calc(100vw - 48px))", background: "#161a21", color: "#ffffff", border: "1px solid #2a313c", boxShadow: "0 30px 80px rgba(0,0,0,.5)", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16, fontFamily: "'Hanken Grotesk',sans-serif", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(16px)", transition: `opacity .5s ${E}, transform .5s ${E}` }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".16em", color: "#8a94a1" }}>COOKIES</span>
      <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.5, color: "#d4dae2" }}>
        This site uses only the browser storage it needs to work: your choice here and a one-off flag for page transitions. No analytics, no advertising cookies.{" "}
        <a href={withBase("/privacy/#cookies")} style={{ color: "#4FB8EE", borderBottom: "1px solid #4FB8EE" }}>How we handle data</a>
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={() => choose("all")} data-hover="background:#8fd3f7;" style={{ font: "inherit", fontWeight: 700, fontSize: 15, padding: "11px 20px", borderRadius: 999, border: "none", background: "#4FB8EE", color: "#0E1116", transition: "background .25s" }}>Accept</button>
        <button type="button" onClick={() => choose("essential")} data-hover="border-color:#4FB8EE;" style={{ font: "inherit", fontWeight: 600, fontSize: 15, padding: "11px 20px", borderRadius: 999, border: "1px solid #2a313c", background: "transparent", color: "#d4dae2", transition: "border-color .25s" }}>Essential only</button>
      </div>
    </div>
  );
}
