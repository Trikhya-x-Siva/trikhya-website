"use client";

import { MARK_BLUE } from "@/lib/assets";
import { withBase } from "@/lib/paths";
import { usePathname } from "next/navigation";

const SOCIAL = [["https://www.linkedin.com/company/trikhya-intelligence-foundry", "LinkedIn"], ["https://x.com/", "X"], ["https://github.com/", "GitHub"], ["https://www.youtube.com/", "YouTube"], ["https://www.instagram.com/", "Instagram"]];

export function Footer() {
  const adminPath = usePathname();
  if (adminPath?.includes("/admin")) return null;
  return <FooterInner />;
}

function FooterInner() {
  return (
    <footer style={{ background: "#0E1116", color: "#ffffff", borderTop: "1px solid #222831" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "clamp(48px,7vw,72px) clamp(20px,5vw,40px) 40px", display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={MARK_BLUE} alt="" style={{ width: 40, height: "auto" }} />
            <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: ".14em" }}>TRIKHYA <span style={{ color: "#4FB8EE" }}>INTELLIGENCE FOUNDRY</span></span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {SOCIAL.map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noopener" data-sweep="1" data-hover="border-color:#4FB8EE;" style={{ border: "1px solid #2a313c", padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, color: "#d4dae2" }}>{label} ↗</a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 28px", paddingTop: 24, paddingRight: 260, borderTop: "1px solid #222831", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#6f7986" }}>
          <span>© 2026 Trikhya Intelligence Foundry</span>
          <span style={{ display: "flex", gap: 18, color: "#aab3bf" }}>
            <a href={withBase("/privacy/")} data-hover="color:#4FB8EE;" style={{ color: "inherit" }}>Privacy</a>
            <a href={withBase("/terms/")} data-hover="color:#4FB8EE;" style={{ color: "inherit" }}>Terms</a>
            <a href={withBase("/privacy/#cookies")} onClick={(e) => { e.preventDefault(); dispatchEvent(new Event("trikhya:cookies")); }} data-hover="color:#4FB8EE;" style={{ color: "inherit" }}>Cookies</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
