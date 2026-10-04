import { MARK_BLUE } from "@/lib/assets";
import { withBase } from "@/lib/paths";

const PAGES = [["/", "Home"], ["/solutions/", "Solutions"], ["/about/", "About"], ["/insights/", "Insights"], ["/careers/", "Careers"], ["/contact/", "Contact"]];
const SOCIAL = [["https://www.linkedin.com/company/trikhya-intelligence-foundry", "LinkedIn"], ["https://x.com/", "X"], ["https://github.com/", "GitHub"], ["https://www.youtube.com/", "YouTube"], ["https://www.instagram.com/", "Instagram"]];

export function Footer() {
  return (
    <footer style={{ background: "#0E1116", color: "#ffffff", borderTop: "1px solid #222831" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "clamp(48px,7vw,72px) clamp(20px,5vw,40px) 40px", display: "flex", flexDirection: "column", gap: 56 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={MARK_BLUE} alt="" style={{ width: 40, height: "auto" }} />
            <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: ".14em" }}>TRIKHYA <span style={{ color: "#4FB8EE" }}>INTELLIGENCE FOUNDRY</span></span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, fontSize: 15, color: "#aab3bf" }}>
            {PAGES.map(([href, label]) => <a key={href} href={withBase(href)}>{label}</a>)}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, paddingTop: 28, borderTop: "1px solid #222831" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {SOCIAL.map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noopener" data-sweep="1" data-hover="border-color:#4FB8EE;" style={{ border: "1px solid #2a313c", padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, color: "#d4dae2" }}>{label} ↗</a>
            ))}
          </div>
          <a href="mailto:hello@trikhya.ai?subject=Project%20enquiry%20for%20Trikhya" data-hover="background:#8fd3f7;color:#0E1116;" style={{ display: "flex", alignItems: "center", gap: 10, background: "#4FB8EE", color: "#0E1116", fontWeight: 700, fontSize: 15, padding: "12px 22px", borderRadius: 999 }}>✉ hello@trikhya.ai</a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#6f7986" }}>
          <span>© 2026 Trikhya Intelligence Foundry</span><span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
