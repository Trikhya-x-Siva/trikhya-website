import type { ReactNode } from "react";
import { ScaledDiagram } from "./ScaledDiagram";

/** Shared primitives for the pipeline and data-flow diagrams.
 *  Nodes are absolutely positioned HTML; arrows are one SVG overlay. */

export type Pt = [number, number];

export type NodeSpec = {
  x: number; y: number; w: number; h: number;
  title: string; sub?: string;
  tone?: "default" | "brand" | "cyan" | "exit";
};

export type ArrowSpec = {
  /** polyline points; segments must be horizontal or vertical */
  pts: Pt[];
  head?: boolean;
  color?: string;
  dashed?: boolean;
};

export type LabelSpec = { x: number; y: number; w: number; text: string; color?: string; align?: "left" | "center" };

const GREY = "#7c8594";

export function DiagramHost({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return <ScaledDiagram width={width} height={height}>{children}</ScaledDiagram>;
}

export function Arrows({ width, height, arrows }: { width: number; height: number; arrows: ArrowSpec[] }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0" width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        {[GREY, "#3b82f6", "#22d3ee"].map((c) => (
          <marker key={c} id={`head-${c.slice(1)}`} orient="auto" markerWidth="5" markerHeight="5" refX="3.2" refY="2" overflow="visible">
            <path d="M0 0 L4 2 L0 4 Z" fill={c} />
          </marker>
        ))}
      </defs>
      {arrows.map((a, i) => {
        const color = a.color ?? GREY;
        const pts = [...a.pts];
        if (a.head) {
          // stop one stroke-width short of the target, like the mock
          const [px, py] = pts[pts.length - 2];
          const [lx, ly] = pts[pts.length - 1];
          pts[pts.length - 1] = [lx + Math.sign(px - lx) * 2, ly + Math.sign(py - ly) * 2];
        }
        const d = pts.map(([x, y], j) => `${j === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
        return (
          <path key={i} d={d} stroke={color} strokeWidth={2} strokeDasharray={a.dashed ? "6 6" : undefined} markerEnd={a.head ? `url(#head-${color.slice(1)})` : undefined} />
        );
      })}
    </svg>
  );
}

const tones = {
  default: "bg-white/[0.06] border-white/[0.14] text-white",
  brand: "bg-electric-cobalt/15 border-electric-cobalt text-white",
  cyan: "bg-cyan-400/10 border-cyan-400 text-white",
  exit: "bg-transparent border-dashed border-white/30 text-white/70",
};

export function Node({ x, y, w, h, title, sub, tone = "default" }: NodeSpec) {
  return (
    <div className={`absolute flex items-center justify-center rounded-[10px] border p-2 text-center text-[13px] leading-snug ${tones[tone]}`} style={{ left: x, top: y, width: w, height: h }}>
      <span>
        <b className="font-semibold">{title}</b>
        {sub ? <><br />{sub}</> : null}
      </span>
    </div>
  );
}

export function Label({ x, y, w, text, color = "rgba(255,255,255,0.55)", align = "center" }: LabelSpec) {
  return (
    <div className="absolute text-[13px] leading-4" style={{ left: x, top: y, width: w, color, textAlign: align }}>{text}</div>
  );
}
