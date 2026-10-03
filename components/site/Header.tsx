"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MARK_WHITE } from "@/lib/assets";
import { withBase } from "@/lib/paths";

const LINKS = [
  { href: "/solutions/", label: "Solutions" },
  { href: "/about/", label: "About" },
  { href: "/insights/", label: "Insights" },
  { href: "/careers/", label: "Careers" },
];

export function Header() {
  const pathname = (usePathname() || "/").replace(/\/?$/, "/");
  const [scrolled, setScrolled] = useState(false);
  const [wide, setWide] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => { const w = window.innerWidth >= 1180; setWide(w); if (w) setMenuOpen(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll(); onResize();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const open = menuOpen && !wide;
  const active = (href: string) => pathname === href;

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: open ? "#0E1116" : scrolled ? "rgba(14,17,22,.92)" : "rgba(22,112,166,0)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", transition: "background .3s", borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,.08)" : "rgba(255,255,255,0)"}` }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", height: 80, boxSizing: "border-box", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, color: "#ffffff" }}>
        <a href={withBase("/")} data-brand="1" style={{ display: "flex", alignItems: "center", gap: 14, color: "#ffffff" }}>
          <img src={MARK_WHITE} alt="" style={{ width: 34, height: "auto" }} />
          <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: ".14em", whiteSpace: "nowrap" }}>TRIKHYA <span style={{ color: "#BFE6FA" }}>INTELLIGENCE FOUNDRY</span></span>
        </a>
        <nav style={{ display: wide ? "flex" : "none", flexWrap: "nowrap", gap: 28, fontSize: 15, fontWeight: 500, whiteSpace: "nowrap" }}>
          {LINKS.map((l) => (
            <a key={l.href} href={withBase(l.href)} style={active(l.href) ? { color: "#BFE6FA", borderBottom: "2px solid #BFE6FA", paddingBottom: 4 } : undefined}>{l.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href={withBase("/contact/")} data-magnet="1" data-hover="background:#BFE6FA;color:#0F4A70;" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: 700, fontSize: 15, padding: "11px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>Contact us</a>
          <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" style={{ display: wide ? "none" : "flex", width: 44, height: 44, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.6)", background: "transparent", color: "#ffffff", fontSize: 18, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>{open ? "✕" : "≡"}</button>
        </div>
      </div>
      {open ? (
        <nav data-menu="1" onClick={() => setMenuOpen(false)} style={{ display: "flex", flexDirection: "column", background: "#0E1116", color: "#ffffff", padding: "8px 40px 24px", fontSize: 20, fontWeight: 600 }}>
          {LINKS.map((l) => <a key={l.href} href={withBase(l.href)} style={{ padding: "14px 0", borderBottom: "1px solid #222831", color: active(l.href) ? "#4FB8EE" : undefined }}>{l.label}</a>)}
          <a href={withBase("/contact/")} style={{ padding: "14px 0" }}>Contact</a>
        </nav>
      ) : null}
    </header>
  );
}
