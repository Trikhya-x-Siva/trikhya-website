"use client";

import { useRef } from "react";
import { usePageMotion } from "@/lib/page-motion";
import { MARK_WHITE } from "@/lib/assets";
import { withBase } from "@/lib/paths";
import { INSIGHTS, bySlug, insightHref, tagOf, type Block, type Insight } from "@/content/insights";
import { InsightCard } from "@/components/insights/InsightCard";

const MONO = "'JetBrains Mono',monospace";
const SANS = "'Hanken Grotesk',sans-serif";

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "p") return <p key={i} data-reveal="1" style={{ margin: 0, fontSize: "clamp(18px,1.35vw,21px)", lineHeight: 1.6, color: "#1f2733", textWrap: "pretty" }}>{b.text}</p>;
        if (b.t === "h") return <h2 key={i} data-reveal="1" style={{ margin: "24px 0 0", fontSize: "clamp(26px,2.2vw,34px)", lineHeight: 1.1, fontWeight: 800, letterSpacing: "-.025em" }}>{b.text}</h2>;
        if (b.t === "quote") return (
          <blockquote key={i} data-reveal="1" style={{ margin: "12px 0", padding: "clamp(24px,3vw,40px)", background: "#1670A6", color: "#ffffff", fontSize: "clamp(22px,2vw,30px)", lineHeight: 1.3, fontWeight: 700, letterSpacing: "-.02em", position: "relative", overflow: "hidden" }}>
            <img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: -60, bottom: -80, width: 240, opacity: .14, pointerEvents: "none" }} />
            <span style={{ position: "relative" }}>“{b.text}”</span>
          </blockquote>
        );
        if (b.t === "list") return (
          <ul key={i} data-reveal="1" style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {b.items.map((it, j) => (
              <li key={j} style={{ display: "flex", gap: 14, fontSize: "clamp(17px,1.25vw,19px)", lineHeight: 1.55, color: "#1f2733" }}>
                <span style={{ flex: "none", width: 8, height: 8, marginTop: 11, background: "#4FB8EE" }} />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        );
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 1, background: "#d5dbe2", border: "1px solid #d5dbe2" }}>
            {b.items.map((s, j) => (
              <div key={j} data-reveal="1" data-hover="background:#ffffff;" style={{ background: "#F4F6F8", padding: "26px 24px", display: "flex", flexDirection: "column", gap: 10, transition: "background .25s" }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: "#1670A6", letterSpacing: ".1em" }}>{String(j + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.01em" }}>{s.title}</span>
                <span style={{ fontSize: 15.5, lineHeight: 1.5, color: "#5b6370" }}>{s.body}</span>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

export function InsightArticlePage({ slug }: { slug: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageMotion(rootRef);
  const i = bySlug(slug) as Insight;
  const idx = INSIGHTS.indexOf(i);
  const related = (i.related ?? []).map(bySlug).filter(Boolean) as Insight[];
  const next = INSIGHTS[(idx + 1) % INSIGHTS.length];
  const date = new Date(i.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div ref={rootRef} style={{ fontFamily: SANS, color: "#0E1116", background: "#F4F6F8", overflowX: "clip" }}>
      <section style={{ position: "relative", background: `linear-gradient(135deg,${i.cover.from},${i.cover.to})`, color: i.cover.from === "#E7ECF1" ? "#0E1116" : "#ffffff", overflow: "hidden", marginTop: -81, paddingTop: 81 }}>
        <img data-spin="1" data-parallax="0.3" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-10%", top: "0", width: "min(56vw,780px)", opacity: i.cover.from === "#E7ECF1" ? ".4" : ".12", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "clamp(48px,7vw,96px) clamp(20px,5vw,40px) clamp(56px,7vw,96px)", display: "flex", flexDirection: "column", gap: 26 }}>
          <a href={withBase("/insights/")} data-word="1" style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".18em", display: "flex", gap: 12, alignItems: "center", color: "inherit", opacity: .85 }}><span style={{ width: 28, height: 1, background: "currentColor" }} />INSIGHTS · {tagOf(i)}</a>
          <h1 style={{ margin: 0, fontSize: "clamp(40px,5.2vw,78px)", lineHeight: .98, fontWeight: 800, letterSpacing: "-.04em", maxWidth: 1000 }}>
            {i.title.split(" ").map((w, k) => <span key={k} data-word="1" style={{ display: "inline-block" }}>{w}&nbsp;</span>)}
          </h1>
          <p data-word="1" style={{ margin: 0, fontSize: "clamp(18px,1.6vw,23px)", lineHeight: 1.5, maxWidth: 720, textWrap: "pretty", opacity: .9 }}>{i.dek}</p>
          <div data-word="1" style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".1em", opacity: .8 }}>{date} · TRIKHYA INTELLIGENCE FOUNDRY</div>
        </div>
      </section>

      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,40px)", display: "grid", gridTemplateColumns: "minmax(0,760px) minmax(240px,1fr)", gap: "clamp(40px,6vw,96px)", alignItems: "start" }}>
        <article style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <Body blocks={i.body} />
        </article>
        <aside style={{ position: "sticky", top: 120, display: "flex", flexDirection: "column", gap: 28 }}>
          <div data-reveal="1" style={{ border: "1px solid #d5dbe2", padding: 24, display: "flex", flexDirection: "column", gap: 14, background: "#ffffff" }}>
            <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#1670A6" }}>FROM THE FOUNDRY</span>
            <span style={{ fontSize: 17, lineHeight: 1.5, color: "#1f2733" }}>These notes come from our first system in production: a natural-language query assistant for a multi-plant insole manufacturer.</span>
            <a href={withBase("/solutions/natural-language-query/")} style={{ fontWeight: 700, fontSize: 16, color: "#1670A6", borderBottom: "2px solid #1670A6", paddingBottom: 3, alignSelf: "flex-start" }}>See how we built it →</a>
          </div>
          {related.length ? (
            <div data-reveal="1" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#5b6370" }}>RELATED</span>
              {related.map((r) => (
                <a key={r.slug} href={withBase(insightHref(r.slug))} data-hover="color:#1670A6;" style={{ display: "flex", flexDirection: "column", gap: 6, color: "#0E1116", paddingBottom: 14, borderBottom: "1px solid #d5dbe2" }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", color: "#5b6370" }}>{tagOf(r)}</span>
                  <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</span>
                </a>
              ))}
            </div>
          ) : null}
        </aside>
      </section>

      <section style={{ background: "#0E1116", color: "#ffffff" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", gap: 40 }}>
          <div data-reveal="1" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 20 }}>
            <h2 style={{ margin: 0, fontSize: "clamp(30px,3.6vw,48px)", lineHeight: 1, fontWeight: 800, letterSpacing: "-.035em" }}>Keep reading.</h2>
            <a href={withBase("/insights/")} style={{ fontWeight: 700, fontSize: 17, color: "#4FB8EE", borderBottom: "2px solid #4FB8EE", paddingBottom: 4 }}>All insights →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 28 }}>
            {[next, ...INSIGHTS.filter((x) => x !== i && x !== next).slice(0, 2)].map((x) => (
              <InsightCard key={x.slug} i={x} index={INSIGHTS.indexOf(x)} dark />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
