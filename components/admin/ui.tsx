"use client";

import type { ReactNode } from "react";
import type { Count } from "./data";

export const MONO = "'JetBrains Mono',monospace";
export const SANS = "'Hanken Grotesk',sans-serif";
export const C = { bg: "#0E1116", panel: "#161a21", line: "#2a313c", ink: "#ffffff", dim: "#8a94a1", mid: "#aab3bf", sky: "#4FB8EE", ice: "#BFE6FA", green: "#5fd39a", amber: "#f0a35e" };

export const fmt = (x: number) => (x >= 10000 ? `${(x / 1000).toFixed(1)}k` : Math.round(x).toLocaleString("en-GB"));
export const secs = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`);
export const pct = (x: number) => `${Math.round(x * 100)}%`;

export function Label({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".16em", color: C.dim, textTransform: "uppercase" }}>{children}</span>;
}

export function Panel({ title, right, children, style }: { title?: ReactNode; right?: ReactNode; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <section style={{ background: C.panel, border: `1px solid ${C.line}`, padding: 22, display: "flex", flexDirection: "column", gap: 16, minWidth: 0, ...style }}>
      {title ? <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}><Label>{title}</Label>{right}</div> : null}
      {children}
    </section>
  );
}

export function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <Panel>
      <Label>{label}</Label>
      <span style={{ fontSize: "clamp(30px,2.6vw,40px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, color: accent ?? C.ink }}>{value}</span>
      {sub ? <span style={{ fontSize: 13, color: C.dim }}>{sub}</span> : null}
    </Panel>
  );
}

/** Horizontal bar list for a Count[]; the top value fills the row. */
export function Bars({ rows, max = 8, format = fmt, onPick }: { rows: Count[]; max?: number; format?: (n: number) => string; onPick?: (key: string) => void }) {
  const top = rows[0]?.count ?? 1;
  if (!rows.length) return <Empty />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.slice(0, max).map((r) => (
        <button key={r.key} type="button" onClick={onPick ? () => onPick(r.key) : undefined} style={{ all: "unset", cursor: onPick ? "pointer" : "default", position: "relative", display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 10px", fontSize: 14, color: C.mid, overflow: "hidden" }}>
          <span aria-hidden style={{ position: "absolute", inset: 0, width: `${(r.count / top) * 100}%`, background: "rgba(79,184,238,.12)", borderRight: `2px solid ${C.sky}`, transition: "width .6s cubic-bezier(.2,.7,.2,1)" }} />
          <span style={{ position: "relative", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.key}</span>
          <span style={{ position: "relative", fontFamily: MONO, fontSize: 13, color: C.ink, flex: "none" }}>{format(r.count)}</span>
        </button>
      ))}
    </div>
  );
}

/** Simple SVG bar chart with two series. */
export function Chart({ series }: { series: { day: string; views: number; sessions: number }[] }) {
  const W = 1000, H = 220, pad = 28;
  const max = Math.max(1, ...series.map((s) => s.views));
  const bw = (W - pad * 2) / Math.max(1, series.length);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const line = series.map((s, i) => `${i === 0 ? "M" : "L"} ${pad + i * bw + bw / 2} ${y(s.sessions)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Views and sessions per day">
      {[0, .5, 1].map((t) => <line key={t} x1={pad} x2={W - pad} y1={y(max * t)} y2={y(max * t)} stroke={C.line} strokeDasharray="3 5" />)}
      {series.map((s, i) => (
        <g key={s.day}>
          <rect x={pad + i * bw + bw * 0.18} y={y(s.views)} width={bw * 0.64} height={Math.max(0, H - pad - y(s.views))} fill="rgba(79,184,238,.35)">
            <title>{`${s.day}: ${s.views} views, ${s.sessions} sessions`}</title>
          </rect>
          {series.length <= 31 && (i % Math.ceil(series.length / 10) === 0) ? <text x={pad + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontFamily={MONO} fontSize="11" fill={C.dim}>{s.day.slice(5)}</text> : null}
        </g>
      ))}
      <path d={line} fill="none" stroke={C.sky} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <text x={pad} y={16} fontFamily={MONO} fontSize="11" fill={C.dim}>{fmt(max)} VIEWS</text>
      <text x={W - pad} y={16} textAnchor="end" fontFamily={MONO} fontSize="11" fill={C.sky}>— SESSIONS</text>
    </svg>
  );
}

export function Table({ head, rows, onRow }: { head: string[]; rows: (string | number)[][]; onRow?: (i: number) => void }) {
  if (!rows.length) return <Empty />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead><tr>{head.map((h, i) => <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "8px 10px", fontFamily: MONO, fontSize: 11, letterSpacing: ".12em", color: C.dim, fontWeight: 500, borderBottom: `1px solid ${C.line}` }}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} onClick={onRow ? () => onRow(i) : undefined} style={{ cursor: onRow ? "pointer" : "default", borderBottom: `1px solid ${C.line}` }} className={onRow ? "adm-row" : undefined}>
              {r.map((c, j) => <td key={j} style={{ textAlign: j === 0 ? "left" : "right", padding: "10px", color: j === 0 ? C.ink : C.mid, fontFamily: j === 0 ? SANS : MONO, fontSize: j === 0 ? 14 : 13, maxWidth: j === 0 ? 420 : undefined, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Empty({ text = "Nothing recorded yet for this range." }: { text?: string }) {
  return <span style={{ fontSize: 14, color: C.dim, padding: "12px 0" }}>{text}</span>;
}

export function Pill({ on, children, onClick }: { on?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ font: "inherit", fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999, border: `1px solid ${on ? C.sky : C.line}`, background: on ? C.sky : "transparent", color: on ? C.bg : C.mid, cursor: "pointer", transition: "all .2s" }}>{children}</button>
  );
}
