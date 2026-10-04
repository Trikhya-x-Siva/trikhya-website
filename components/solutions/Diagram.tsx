"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Diagram primitives in the site palette. Nodes are positioned HTML; arrows are one SVG overlay.
 * The host scales down to fit its container so the whole picture is always visible. */

export type Pt = [number, number];
export type NodeSpec = { x: number; y: number; w: number; h: number; title: string; sub?: string; tone?: "default" | "brand" | "ice" | "exit" };
export type ArrowSpec = { pts: Pt[]; head?: boolean; color?: string; dashed?: boolean };
export type LabelSpec = { x: number; y: number; w: number; text: string; color?: string; align?: "left" | "center" };

export const GREY = "#6f7986", SKY = "#4FB8EE", ICE = "#BFE6FA";

export function DiagramHost({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const update = () => {
      const s = Math.min(1, el.clientWidth / width);
      setScale(s); setOffset(Math.max(0, (el.clientWidth - width * s) / 2));
    };
    update(); const ro = new ResizeObserver(update); ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} style={{ width: "100%", overflow: "hidden", border: "1px solid #2a313c", background: "#161a21" }}>
      <div style={{ height: height * scale }}>
        <div style={{ position: "relative", width, height, marginLeft: offset, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
      </div>
    </div>
  );
}

export function Arrows({ width, height, arrows }: { width: number; height: number; arrows: ArrowSpec[] }) {
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        {[GREY, SKY, ICE].map((c) => (
          <marker key={c} id={`head-${c.slice(1)}`} orient="auto" markerWidth="5" markerHeight="5" refX="3.2" refY="2" overflow="visible"><path d="M0 0 L4 2 L0 4 Z" fill={c} /></marker>
        ))}
      </defs>
      {arrows.map((a, i) => {
        const color = a.color ?? GREY; const pts = [...a.pts];
        if (a.head) { const [px, py] = pts[pts.length - 2]; const [lx, ly] = pts[pts.length - 1]; pts[pts.length - 1] = [lx + Math.sign(px - lx) * 2, ly + Math.sign(py - ly) * 2]; }
        const d = pts.map(([x, y], j) => `${j === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
        return <path key={i} d={d} stroke={color} strokeWidth={2} strokeDasharray={a.dashed ? "6 6" : undefined} markerEnd={a.head ? `url(#head-${color.slice(1)})` : undefined} />;
      })}
    </svg>
  );
}

const TONES: Record<NonNullable<NodeSpec["tone"]>, React.CSSProperties> = {
  default: { background: "#0E1116", border: "1px solid #2a313c", color: "#ffffff" },
  brand: { background: "rgba(79,184,238,.12)", border: `1px solid ${SKY}`, color: "#ffffff" },
  ice: { background: "rgba(191,230,250,.08)", border: `1px solid ${ICE}`, color: "#ffffff" },
  exit: { background: "transparent", border: "1px dashed #4a5260", color: "#aab3bf" },
};

export function Node({ x, y, w, h, title, sub, tone = "default" }: NodeSpec) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 13, lineHeight: 1.3, ...TONES[tone] }}>
      <span><b style={{ fontWeight: 700 }}>{title}</b>{sub ? <><br /><span style={{ color: "#aab3bf" }}>{sub}</span></> : null}</span>
    </div>
  );
}

export function Label({ x, y, w, text, color = "#8a94a1", align = "center" }: LabelSpec) {
  return <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: "16px", color, textAlign: align }}>{text}</div>;
}
