"use client";

import { insightHref, tagOf, type Insight } from "@/content/insights";
import { withBase } from "@/lib/paths";
import { MARK_WHITE } from "@/lib/assets";

const MONO = "'JetBrains Mono',monospace";

/** Generated cover: brand gradient, rotating mark, mono glyph. Replaces the "cover image" placeholder. */
export function InsightCover({ i, index }: { i: Insight; index: number }) {
  const light = i.cover.from === "#E7ECF1";
  return (
    <div data-wipe="1" style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: `linear-gradient(135deg,${i.cover.from},${i.cover.to})`, color: light ? "#0F4A70" : "#ffffff" }}>
      <img data-spin="1" src={MARK_WHITE} alt="" style={{ position: "absolute", right: "-18%", bottom: "-30%", width: "70%", opacity: light ? ".35" : ".14", pointerEvents: "none" }} />
      <span style={{ position: "absolute", left: 20, top: 18, fontFamily: MONO, fontSize: 12, letterSpacing: ".16em", opacity: .8 }}>{String(index + 1).padStart(2, "0")}</span>
      <span style={{ position: "absolute", left: 20, bottom: 18, fontFamily: MONO, fontSize: "clamp(22px,2.4vw,34px)", fontWeight: 700, letterSpacing: "-.02em" }}>{i.cover.glyph}</span>
    </div>
  );
}

export function InsightCard({ i, index, width, dark = false }: { i: Insight; index: number; width?: string; dark?: boolean }) {
  return (
    <a href={withBase(insightHref(i.slug))} data-reveal="1" data-hover={dark ? "color:#4FB8EE;" : "color:#1670A6;"} style={{ display: "flex", flexDirection: "column", gap: 16, color: dark ? "#ffffff" : "#0E1116", width, flex: width ? "none" : undefined }}>
      <InsightCover i={i} index={index} />
      <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", color: dark ? "#8a94a1" : "#5b6370" }}>{tagOf(i)}</span>
      <span style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-.01em" }}>{i.title}</span>
      <span style={{ fontSize: 16, lineHeight: 1.5, color: dark ? "#aab3bf" : "#5b6370" }}>{i.dek}</span>
    </a>
  );
}
