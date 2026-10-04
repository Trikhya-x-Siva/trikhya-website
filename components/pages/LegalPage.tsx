"use client";

import { useRef } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
import { withBase } from "@/lib/paths";
import type { LegalDoc } from "@/content/legal";

const MONO = "'JetBrains Mono',monospace";

export function LegalPage({ doc, other }: { doc: LegalDoc; other: LegalDoc }) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  const updated = new Date(doc.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
      <section style={{ position: "relative", background: "#0E1116", color: "#ffffff", overflow: "hidden", marginTop: -81, paddingTop: 81 }}>
        <img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: 0, width: "min(50vw,700px)", opacity: .1, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,40px) clamp(48px,5vw,72px)", display: "flex", flexDirection: "column", gap: 22 }}>
          <div data-word="1" style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".18em", display: "flex", gap: 12, alignItems: "center" }}><span style={{ width: 28, height: 1, background: "#ffffff" }} />LEGAL</div>
          <h1 style={{ margin: 0, fontSize: "clamp(40px,5vw,72px)", lineHeight: .98, fontWeight: 800, letterSpacing: "-.04em" }}>
            {doc.title.split(" ").map((w, k) => <span key={k} data-word="1" style={{ display: "inline-block" }}>{w}&nbsp;</span>)}
          </h1>
          <p data-word="1" style={{ margin: 0, fontSize: "clamp(17px,1.4vw,21px)", lineHeight: 1.5, maxWidth: 680, color: "#aab3bf", textWrap: "pretty" }}>{doc.lead}</p>
          <div data-word="1" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", color: "#8a94a1" }}>LAST UPDATED · {updated.toUpperCase()}</div>
        </div>
      </section>

      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "clamp(44px,5vw,72px) clamp(20px,5vw,40px)", display: "grid", gridTemplateColumns: "minmax(200px,280px) minmax(0,760px)", gap: "clamp(32px,5vw,80px)", alignItems: "start" }}>
        <nav data-reveal="1" style={{ position: "sticky", top: 120, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", color: "#5b6370", marginBottom: 6 }}>ON THIS PAGE</span>
          {doc.sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} data-hover="color:#1670A6;" style={{ fontSize: 15, color: "#1f2733", display: "flex", gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: "#1670A6", paddingTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>{s.title}
            </a>
          ))}
          <a href={withBase(`/${other.slug}/`)} style={{ marginTop: 18, fontWeight: 700, fontSize: 15, color: "#1670A6", borderBottom: "2px solid #1670A6", paddingBottom: 2, alignSelf: "flex-start" }}>{other.title} →</a>
        </nav>
        <article style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 14, scrollMarginTop: 110 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(22px,1.8vw,28px)", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-.02em", display: "flex", gap: 14, alignItems: "baseline" }}>
                <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 500, color: "#1670A6" }}>{String(i + 1).padStart(2, "0")}</span>{s.title}
              </h2>
              {s.paras?.map((p, k) => <p key={k} style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#1f2733" }}>{p}</p>)}
              {s.items ? (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {s.items.map((it, k) => (
                    <li key={k} style={{ display: "flex", gap: 14, fontSize: 16.5, lineHeight: 1.55, color: "#1f2733" }}>
                      <span style={{ flex: "none", width: 8, height: 8, marginTop: 10, background: "#4FB8EE" }} /><span>{it}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {s.after?.map((p, k) => <p key={k} style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#1f2733" }}>{p}</p>)}
            </section>
          ))}
        </article>
      </section>
    </div>
  );
}
