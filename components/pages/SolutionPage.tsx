"use client";

import { useRef, type ReactNode } from "react";
import type { Solution } from "@/content/solutions";
import { MARK_WHITE } from "@/lib/assets";
import { usePageMotion } from "@/lib/page-motion";
import { withBase } from "@/lib/paths";
import { SolutionVideo } from "@/components/solutions/SolutionVideo";

const MONO = "'JetBrains Mono',monospace";
const PAD = "clamp(44px,5vw,72px) clamp(20px,5vw,40px)";
const H2: React.CSSProperties = { margin: 0, fontSize: "clamp(38px,4.6vw,68px)", lineHeight: 1, fontWeight: 800, letterSpacing: "-.035em", textWrap: "balance" };
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: MONO, fontSize: 13, letterSpacing: ".16em", color });
/** Blank cells so a 3-column grid stays rectangular when the item count is not a multiple of 3. */
const fill = (n: number) => Array.from({ length: (3 - (n % 3)) % 3 }, (_, i) => <div key={`fill-${i}`} aria-hidden style={{ background: "#0E1116" }} />);

type Props = { s: Solution; demo: ReactNode; pipelineDiagram?: ReactNode; dataDiagram?: ReactNode };

/** One layout for every solution page. Content comes from `s`; the demo panel and diagrams are passed in. */
export function SolutionPage({ s, demo, pipelineDiagram, dataDiagram }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  const words = (text: string, color?: string) => text.split(" ").map((w, i) => <span key={i}><span data-word="1" style={{ display: "inline-block", color }}>{w}</span> </span>);

  return (
    <div ref={rootRef} style={{ fontFamily: "'Hanken Grotesk',sans-serif", color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>

      {/* Hero */}
      <section style={{ position: "relative", background: "#1670A6", color: "#ffffff", overflow: "hidden", marginTop: -81, paddingTop: 81 }}>
        <img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "4%", width: "min(56vw,780px)", opacity: 0.12, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,40px) clamp(48px,5vw,72px)", display: "flex", flexDirection: "column", gap: 28 }}>
          <div data-word="1" style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".18em", display: "flex", gap: 12, alignItems: "center" }}><span style={{ width: 28, height: 1, background: "#fff" }} />SOLUTION {s.tag} · {s.status.toUpperCase()}</div>
          <h1 style={{ margin: 0, fontSize: "clamp(46px,6.6vw,100px)", lineHeight: 0.95, fontWeight: 800, letterSpacing: "-.045em", maxWidth: 1050 }}>{words(s.heroTitle[0])}{words(s.heroTitle[1], "#BFE6FA")}</h1>
          <p data-word="1" style={{ margin: 0, fontSize: "clamp(18px,1.7vw,23px)", lineHeight: 1.5, maxWidth: 680, textWrap: "pretty" }}>{s.tagline}</p>
          <div data-word="1" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,48px)", borderTop: "1px solid rgba(255,255,255,.25)", paddingTop: 24, marginTop: 12 }}>
            {s.stats.map((st) => (
              <div key={st.label} style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 260 }}>
                <span style={{ fontSize: "clamp(32px,3vw,44px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1 }}>{st.value}</span>
                <span style={{ fontSize: 13, color: "#d9eefb" }}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The problem */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: PAD, display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 48, alignItems: "end" }}>
          <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={eyebrow("#1670A6")}>THE PROBLEM</span>
            <h2 style={H2}>{s.problem.lead}</h2>
          </div>
          <p data-fill="1" style={{ margin: 0, fontSize: 21, lineHeight: 1.55, color: "#0E1116", textWrap: "pretty" }}>{s.problem.body}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 1, background: "#d5dbe2", border: "1px solid #d5dbe2" }}>
          {s.problem.pains.map((p, i) => (
            <div key={i} data-reveal="1" data-spot="1" data-hover="background:#ffffff;" style={{ background: "#F4F6F8", padding: "36px 32px", display: "flex", flexDirection: "column", gap: 14, transition: "background .25s" }}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: "#1670A6", letterSpacing: ".12em" }}>0{i + 1}</span>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.01em", lineHeight: 1.2 }}>{p.title}</span>
              <span style={{ fontSize: 17, lineHeight: 1.55, color: "#4a5260" }}>{p.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What we built */}
      <section style={{ background: "#0E1116", color: "#ffffff", position: "relative", overflow: "hidden" }}>
        <div data-blueprint="1" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: PAD, display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: 56, alignItems: "center" }}>
            <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <span style={eyebrow("#4FB8EE")}>WHAT WE BUILT</span>
              <h2 style={H2}>{s.built.lead}</h2>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "#aab3bf", maxWidth: 560 }}>{s.summary}</p>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: "#aab3bf", maxWidth: 560 }}>{s.built.extra}</p>
            </div>
            <div data-reveal="1">{s.video ? <SolutionVideo video={s.video} /> : demo}</div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section style={{ background: "#E7ECF1" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: PAD, display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 48, alignItems: "end" }}>
            <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <span style={eyebrow("#1670A6")}>OUR APPROACH</span>
              <h2 style={H2}>{s.approach.lead}</h2>
            </div>
            <p data-reveal="1" style={{ margin: 0, fontSize: 20, lineHeight: 1.55, color: "#3b4350", textWrap: "pretty" }}>{s.approach.body}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {s.approach.principles.map((p) => (
              <div key={p.n} data-reveal="1" data-tilt="1" style={{ background: "#ffffff", padding: "32px 28px", display: "flex", flexDirection: "column", gap: 14, borderTop: "4px solid #1670A6" }}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: "#5b6370", letterSpacing: ".12em" }}>{p.n}</span>
                <span style={{ fontSize: 24, fontWeight: 700 }}>{p.title}</span>
                <span style={{ fontSize: 16, lineHeight: 1.55, color: "#4a5260" }}>{p.body}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section style={{ background: "#0E1116", color: "#ffffff" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: PAD, display: "flex", flexDirection: "column", gap: 32 }}>
          <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 860 }}>
            <span style={eyebrow("#4FB8EE")}>HOW IT WORKS</span>
            <h2 style={H2}>{s.pipeline.lead}</h2>
            <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "#aab3bf", maxWidth: 720 }}>{s.pipeline.body}</p>
          </div>
          {pipelineDiagram && <div data-reveal="1" data-wipe="1">{pipelineDiagram}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 1, background: "#2a313c", border: "1px solid #2a313c" }}>
            {s.pipeline.steps.map((st, i) => (
              <div key={i} data-reveal="1" data-spot="1" data-hover="background:#161a21;" style={{ background: "#0E1116", padding: "28px 26px", display: "flex", flexDirection: "column", gap: 10, transition: "background .25s" }}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: "#4FB8EE", letterSpacing: ".12em" }}>0{i + 1}</span>
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.01em" }}>{st.title}</span>
                <span style={{ fontSize: 15.5, lineHeight: 1.55, color: "#aab3bf" }}>{st.body}</span>
              </div>
            ))}
            {fill(s.pipeline.steps.length)}
          </div>
        </div>
      </section>

      {/* Data */}
      {s.data && dataDiagram && (
        <section style={{ background: "#161a21", color: "#ffffff", borderTop: "1px solid #222831" }}>
          <div style={{ maxWidth: 1360, margin: "0 auto", padding: PAD, display: "flex", flexDirection: "column", gap: 32 }}>
            <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 860 }}>
              <span style={eyebrow("#4FB8EE")}>THE DATA</span>
              <h2 style={H2}>{s.data.lead}</h2>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "#aab3bf", maxWidth: 720 }}>{s.data.body}</p>
            </div>
            <div data-reveal="1" data-wipe="1">{dataDiagram}</div>
          </div>
        </section>
      )}

      {/* Outcome */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: PAD, display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 48, alignItems: "center" }}>
          <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={eyebrow("#1670A6")}>THE RESULT</span>
            <h2 style={H2}>{s.outcome.lead}</h2>
          </div>
          {s.outcome.headline && (
            <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 6, borderLeft: "4px solid #1670A6", paddingLeft: 28 }}>
              <span style={{ fontSize: "clamp(64px,8vw,120px)", fontWeight: 800, letterSpacing: "-.045em", lineHeight: 0.95 }}>{s.outcome.headline.value}</span>
              <span style={{ fontSize: 18, color: "#3b4350" }}>{s.outcome.headline.body}</span>
            </div>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 40 }}>
          {s.outcome.points.map((p, i) => (
            <div key={i} data-reveal="1" style={{ borderTop: "2px solid #1670A6", paddingTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontSize: 24, fontWeight: 700 }}>{p.title}</span>
              <span style={{ fontSize: 17, lineHeight: 1.55, color: "#4a5260" }}>{p.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Around it + stack */}
      <section style={{ background: "#0E1116", color: "#ffffff" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: PAD, display: "flex", flexDirection: "column", gap: 32 }}>
          {s.around && (
            <>
              <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 860 }}>
                <span style={eyebrow("#4FB8EE")}>AROUND IT</span>
                <h2 style={H2}>{s.around.lead}</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 1, background: "#2a313c", border: "1px solid #2a313c" }}>
                {s.around.items.map((a, i) => (
                  <div key={i} data-reveal="1" data-spot="1" data-hover="background:#161a21;" style={{ background: "#0E1116", padding: "36px 32px", display: "flex", flexDirection: "column", gap: 14, minHeight: 220, transition: "background .25s" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.01em", lineHeight: 1.2 }}>{a.title}</span>
                    <span style={{ fontSize: 16, lineHeight: 1.55, color: "#aab3bf" }}>{a.body}</span>
                  </div>
                ))}
                {fill(s.around.items.length)}
              </div>
            </>
          )}
          <div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#8a94a1", marginRight: 8 }}>BUILT WITH</span>
            {s.stack.map((t) => <span key={t} style={{ border: "1px solid #2a313c", padding: "8px 14px", borderRadius: 999, fontSize: 14, color: "#d4dae2" }}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1670A6", color: "#ffffff", position: "relative", overflow: "hidden" }}>
        <img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: -120, bottom: -200, width: 520, opacity: 0.12, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "clamp(48px,5vw,72px) clamp(20px,5vw,40px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 40 }}>
          <h2 style={{ ...H2, fontSize: "clamp(36px,4.6vw,64px)", maxWidth: 760 }}>Want this, shaped to your business?</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a href={withBase("/contact/")} data-hover="background:#BFE6FA;color:#0F4A70;" style={{ background: "#ffffff", color: "#0F4A70", fontWeight: 700, fontSize: 17, padding: "18px 30px", borderRadius: 999 }}>Talk to us →</a>
            <a href={withBase("/solutions/")} data-sweep="#ffffff" data-sweep-ink="#0F4A70" style={{ border: "1.5px solid rgba(255,255,255,.7)", color: "#ffffff", fontWeight: 600, fontSize: 17, padding: "17px 28px", borderRadius: 999 }}>All solutions</a>
          </div>
        </div>
      </section>
    </div>
  );
}
