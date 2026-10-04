"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { C, Empty, fmt, Kpi, Label, MONO, Panel, Pill, Table } from "./ui";

const input: React.CSSProperties = { font: "inherit", fontSize: 15, padding: "11px 13px", background: C.bg, border: `1px solid ${C.line}`, color: C.ink, outline: "none", width: "100%", boxSizing: "border-box", borderRadius: 0 };
const btn: React.CSSProperties = { font: "inherit", fontWeight: 700, fontSize: 15, padding: "11px 20px", borderRadius: 999, border: "none", background: C.sky, color: C.bg, cursor: "pointer" };
const grid = (min: number): React.CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 20 });

type Settings = { enabled: boolean; provider: string; model: string; knowledge: string; refusal: string; handoff: string; starter_questions: string[]; daily_cap: number; max_turns: number; updated_at?: string };
type Conv = { id: number; ts: string; session_id: string; path: string | null; question: string; answer: string; in_scope: boolean; latency_ms: number | null; model: string | null; flagged: boolean; flag_note: string | null };

/** Godseye management: what it knows, how it refuses, whether it is on, and every conversation it has had. */
export function GodseyeAdmin({ onBack }: { onBack: () => void }) {
  const [s, setS] = useState<Settings | null>(null);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState("");
  const [convs, setConvs] = useState<Conv[] | null>(null);
  const [tab, setTab] = useState<"Conversations" | "Knowledge" | "Documents" | "Behaviour">("Conversations");
  const [flagging, setFlagging] = useState<Conv | null>(null);
  const [note, setNote] = useState("");

  const load = () => {
    const sb = supabase()!;
    sb.from("godseye_settings").select("*").eq("id", 1).single().then(({ data, error }) => { if (error) setMsg(error.message); else { const row = data as Settings; if (row.model === "sarvam-m") { row.model = "sarvam-105b"; setDirty(true); } else setDirty(false); setS(row); } });
    sb.from("godseye_conversations").select("*").order("ts", { ascending: false }).limit(500).then(({ data }) => setConvs((data ?? []) as Conv[]));
  };
  useEffect(load, []);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => { setS((x) => (x ? { ...x, [k]: v } : x)); setDirty(true); };
  const save = async () => {
    if (!s) return; setMsg("");
    const { updated_at, ...data } = s; void updated_at;
    const { error } = await supabase()!.from("godseye_settings").update(data).eq("id", 1);
    setMsg(error ? error.message : "Saved. Live immediately."); if (!error) setDirty(false);
  };
  const flag = async (c: Conv, flagged: boolean) => {
    await supabase()!.from("godseye_conversations").update({ flagged, flag_note: flagged ? note : null }).eq("id", c.id);
    setFlagging(null); setNote(""); load();
  };

  const today = (convs ?? []).filter((c) => c.ts.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
  const out = (convs ?? []).filter((c) => !c.in_scope).length;
  const flagged = (convs ?? []).filter((c) => c.flagged).length;
  const avgMs = (() => { const xs = (convs ?? []).map((c) => c.latency_ms ?? 0).filter(Boolean); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0; })();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Pill onClick={onBack}>← Analytics</Pill>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>Godseye management</span>
          {s ? <span style={{ fontFamily: MONO, fontSize: 11, color: s.enabled ? C.green : C.amber, border: `1px solid ${s.enabled ? C.green : C.amber}`, padding: "4px 10px", borderRadius: 999 }}>{s.enabled ? "LIVE · MODEL ANSWERS" : "OFF · FIXED ANSWERS"}</span> : null}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg ? <span style={{ fontSize: 13, color: msg.startsWith("Saved") ? C.green : C.amber }}>{msg}</span> : null}
          {s ? <button type="button" onClick={() => set("enabled", !s.enabled)} style={{ ...btn, background: s.enabled ? "transparent" : C.green, color: s.enabled ? C.ink : C.bg, border: s.enabled ? `1px solid ${C.line}` : "none" }}>{s.enabled ? "Switch off" : "Switch on"}</button> : null}
          <button type="button" disabled={!dirty} onClick={save} style={{ ...btn, opacity: dirty ? 1 : .5 }}>Save changes</button>
        </div>
      </div>
      <div style={grid(200)}>
        <Kpi label="Conversations" value={fmt((convs ?? []).length)} sub="last 500" />
        <Kpi label="Today" value={fmt(today)} sub={s ? `cap ${s.daily_cap} per day` : ""} />
        <Kpi label="Out of scope" value={fmt(out)} sub="refused politely" />
        <Kpi label="Flagged wrong" value={fmt(flagged)} accent={flagged ? C.amber : undefined} />
        <Kpi label="Avg response" value={`${(avgMs / 1000).toFixed(1)}s`} />
      </div>
      <nav style={{ display: "flex", gap: 24, borderBottom: `1px solid ${C.line}` }}>
        {(["Conversations", "Knowledge", "Documents", "Behaviour"] as const).map((t) => <button key={t} className="adm-tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>)}
      </nav>

      {tab === "Conversations" ? (
        <Panel title="Every question and the answer given" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>CLICK A ROW TO FLAG OR UNFLAG</span>}>
          {flagging ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, border: `1px solid ${C.amber}` }}>
              <span style={{ fontSize: 14, color: C.mid }}><b style={{ color: C.ink }}>Q:</b> {flagging.question}</span>
              <span style={{ fontSize: 14, color: C.mid, whiteSpace: "pre-wrap" }}><b style={{ color: C.ink }}>A:</b> {flagging.answer}</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was wrong, and what should it have said?" className="adm-in" style={input} />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => flag(flagging, true)} style={{ ...btn, background: C.amber }}>Flag as wrong</button>
                {flagging.flagged ? <Pill onClick={() => flag(flagging, false)}>Clear flag</Pill> : null}
                <Pill onClick={() => setFlagging(null)}>Cancel</Pill>
              </div>
            </div>
          ) : null}
          {!convs ? <Empty text="Loading…" /> : !convs.length ? <Empty text="No conversations yet. Switch Godseye on and ask it something on the site." /> : (
            <Table head={["Question", "Answer", "Scope", "When"]} rows={convs.map((c) => [`${c.flagged ? "⚑ " : ""}${c.question}`, c.answer.slice(0, 90) + (c.answer.length > 90 ? "…" : ""), c.in_scope ? "in" : "out", new Date(c.ts).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })])} onRow={(i) => { setFlagging(convs[i]); setNote(convs[i].flag_note ?? ""); }} />
          )}
        </Panel>
      ) : null}

      {tab === "Knowledge" && s ? (
        <Panel title="What Godseye knows" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{s.knowledge.length.toLocaleString()} CHARACTERS</span>}>
          <span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>Plain text. Everything Godseye is allowed to say comes from here. Write facts, not marketing. Never include client names. When a flagged answer shows a gap, fix it here.</span>
          <textarea rows={26} value={s.knowledge} onChange={(e) => set("knowledge", e.target.value)} className="adm-in" style={{ ...input, resize: "vertical", lineHeight: 1.55, fontFamily: MONO, fontSize: 13 }} />
        </Panel>
      ) : null}

      {tab === "Documents" ? <Documents /> : null}

      {tab === "Behaviour" && s ? (
        <div style={grid(420)}>
          <Panel title="Scope and refusals">
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: C.mid }}>Refusal for anything not about Trikhya</span>
              <textarea rows={4} value={s.refusal} onChange={(e) => set("refusal", e.target.value)} className="adm-in" style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: C.mid }}>Handoff when someone wants a person</span>
              <textarea rows={3} value={s.handoff} onChange={(e) => set("handoff", e.target.value)} className="adm-in" style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: C.mid }}>Starter questions <span style={{ color: C.dim }}>· one per line, shown as chips</span></span>
              <textarea rows={4} value={s.starter_questions.join("\n")} onChange={(e) => set("starter_questions", e.target.value.split("\n"))} onBlur={(e) => set("starter_questions", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} className="adm-in" style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />
            </label>
          </Panel>
          <Panel title="Model and limits">
            <div style={grid(180)}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.mid }}>Provider</span>
                <select value={s.provider} onChange={(e) => { set("provider", e.target.value); set("model", e.target.value === "sarvam" ? "sarvam-105b" : "claude-haiku-4-5"); }} className="adm-in" style={{ ...input, appearance: "none" }}><option value="sarvam">Sarvam</option><option value="anthropic">Anthropic</option></select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.mid }}>Model</span>
                <input value={s.model} onChange={(e) => set("model", e.target.value)} className="adm-in" style={input} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.mid }}>Daily cap <span style={{ color: C.dim }}>· answers per day</span></span>
                <input type="number" min={0} value={s.daily_cap} onChange={(e) => set("daily_cap", Number(e.target.value))} className="adm-in" style={input} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.mid }}>Max turns per visitor</span>
                <input type="number" min={1} value={s.max_turns} onChange={(e) => set("max_turns", Number(e.target.value))} className="adm-in" style={input} />
              </label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label>How it works</Label>
              <span style={{ fontSize: 14, lineHeight: 1.55, color: C.mid }}>Each question goes to a small server function with the knowledge text and the rules above. The model first decides whether the question is about Trikhya. If not, the refusal is returned word for word. If the cap is reached, or the key is missing, the widget falls back to its fixed answers so it never goes dead. Only a single secret, the provider API key, lives on the server.</span>
            </div>
          </Panel>
        </div>
      ) : null}
    </>
  );
}

type Doc = { id: string; title: string; kind: "pdf" | "text" | "markdown"; storage_path: string | null; chars: number; enabled: boolean; status: "pending" | "ready" | "failed"; error: string | null; created_at: string };

/** Knowledge documents: PDFs, text or markdown that Godseye may quote facts from. */
function Documents() {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const load = () => { supabase()!.from("godseye_documents").select("*").order("created_at", { ascending: false }).then(({ data, error }) => { if (error) setMsg(error.message); else setDocs((data ?? []) as Doc[]); }); };
  useEffect(load, []);
  const upload = async (file: File) => {
    setBusy(true); setMsg("");
    const sb = supabase()!;
    const kind: Doc["kind"] = file.type === "application/pdf" || /\.pdf$/i.test(file.name) ? "pdf" : /\.md$/i.test(file.name) ? "markdown" : "text";
    if (file.size > 15 * 1024 * 1024) { setMsg("Files must be 15 MB or smaller."); setBusy(false); return; }
    const id = crypto.randomUUID(); const path = `docs/${id}.${kind === "pdf" ? "pdf" : kind === "markdown" ? "md" : "txt"}`;
    const { error: up } = await sb.storage.from("godseye-docs").upload(path, file, { contentType: kind === "pdf" ? "application/pdf" : kind === "markdown" ? "text/markdown" : "text/plain" });
    if (up) { setMsg(`Upload failed: ${up.message}`); setBusy(false); return; }
    const { error: ins } = await sb.from("godseye_documents").insert({ id, title: file.name.replace(/\.[^.]+$/, ""), kind, storage_path: path });
    if (ins) { setMsg(ins.message); setBusy(false); return; }
    const { data, error } = await sb.functions.invoke("ingest-document", { body: { document_id: id } });
    setMsg(error || data?.error ? `Saved, but reading it failed: ${error?.message ?? data?.error}` : `Added “${file.name}” · ${data?.chars?.toLocaleString?.() ?? ""} characters of text.`);
    setBusy(false); load();
  };
  const toggle = async (d: Doc) => { await supabase()!.from("godseye_documents").update({ enabled: !d.enabled }).eq("id", d.id); load(); };
  const remove = async (d: Doc) => {
    if (!confirm(`Remove “${d.title}” from Godseye's knowledge?`)) return;
    const sb = supabase()!; if (d.storage_path) await sb.storage.from("godseye-docs").remove([d.storage_path]);
    await sb.from("godseye_documents").delete().eq("id", d.id); load();
  };
  const retry = async (d: Doc) => { setBusy(true); const { data, error } = await supabase()!.functions.invoke("ingest-document", { body: { document_id: d.id } }); setMsg(error || data?.error ? `Reading failed: ${error?.message ?? data?.error}` : "Read successfully."); setBusy(false); load(); };
  const total = (docs ?? []).filter((d) => d.enabled && d.status === "ready").reduce((t, d) => t + d.chars, 0);
  return (
    <div style={grid(420)}>
      <Panel title="Add a document">
        <span style={{ fontSize: 14, lineHeight: 1.5, color: C.mid }}>Upload a PDF, text or markdown file: a company deck, a service description, a case write-up without client names. The text is extracted once and given to Godseye as facts alongside the knowledge page. Up to about 40,000 characters are used per answer, newest documents first.</span>
        <label style={{ ...input, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, cursor: busy ? "wait" : "pointer", borderStyle: "dashed" }}>
          <span style={{ color: C.dim }}>{busy ? "Working…" : "Choose a PDF, .txt or .md file…"}</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.sky }}>BROWSE</span>
          <input type="file" accept="application/pdf,.pdf,.txt,.md,text/plain,text/markdown" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} style={{ display: "none" }} />
        </label>
        {msg ? <span style={{ fontSize: 13, lineHeight: 1.5, color: msg.startsWith("Added") || msg.startsWith("Read") ? C.green : C.amber }}>{msg}</span> : null}
      </Panel>
      <Panel title="Documents" right={<span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{total.toLocaleString()} CHARACTERS IN USE</span>}>
        {!docs ? <Empty text="Loading…" /> : !docs.length ? <Empty text="No documents yet." /> : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {docs.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: `1px solid ${C.line}`, opacity: d.enabled ? 1 : .55 }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                  <span style={{ fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: d.status === "failed" ? C.amber : C.dim }}>{d.kind.toUpperCase()} · {d.status === "ready" ? `${d.chars.toLocaleString()} CHARS` : d.status.toUpperCase()}{d.error ? ` · ${d.error}` : ""} · {new Date(d.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase()}</span>
                </span>
                <span style={{ display: "flex", gap: 6, flex: "none" }}>
                  {d.status !== "ready" ? <Pill onClick={() => retry(d)}>Retry</Pill> : null}
                  <Pill on={d.enabled} onClick={() => toggle(d)}>{d.enabled ? "In use" : "Off"}</Pill>
                  <Pill onClick={() => remove(d)}>Remove</Pill>
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
