"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { C, Empty, MONO, Panel, Pill } from "./ui";

type Msg = { id: string; ts: string; name: string; email: string; company: string | null; message: string; status: "new" | "replied" | "archived"; notes: string | null };

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/** Messages sent from the Contact page. Reply from your mail app; mark them here so the team sees what is handled. */
export function Messages() {
  const [rows, setRows] = useState<Msg[] | null>(null);
  const [err, setErr] = useState("");
  const [show, setShow] = useState<"new" | "replied" | "archived">("new");
  const load = () => { supabase()!.from("messages").select("*").order("ts", { ascending: false }).limit(500).then(({ data, error }) => { if (error) setErr(error.message); else setRows((data ?? []) as Msg[]); }); };
  useEffect(load, []);
  const set = async (m: Msg, status: Msg["status"]) => { await supabase()!.from("messages").update({ status }).eq("id", m.id); load(); };
  const remove = async (m: Msg) => { if (!confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return; await supabase()!.from("messages").delete().eq("id", m.id); load(); };

  if (err) return <Panel><Empty text={`Could not load messages: ${err}. Has migration 0010 been run?`} /></Panel>;
  if (!rows) return <Empty text="Loading messages…" />;
  const counts = { new: rows.filter((r) => r.status === "new").length, replied: rows.filter((r) => r.status === "replied").length, archived: rows.filter((r) => r.status === "archived").length };
  const list = rows.filter((r) => r.status === show);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, color: C.mid }}>Everything sent through the Contact page. Reply from your mail app, then mark it replied.</span>
        <div style={{ display: "flex", gap: 8 }}>
          {(["new", "replied", "archived"] as const).map((s) => <Pill key={s} on={show === s} onClick={() => setShow(s)}>{s[0].toUpperCase() + s.slice(1)} · {counts[s]}</Pill>)}
        </div>
      </div>
      {list.length === 0 ? <Panel><Empty text={show === "new" ? "No new messages." : `Nothing ${show}.`} /></Panel> : list.map((m) => (
        <Panel key={m.id} title={<span>{m.name} <span style={{ color: C.dim, fontWeight: 400 }}>· {m.company || "no company given"}</span></span>} right={<span style={{ fontFamily: MONO, fontSize: 12, color: C.dim }}>{when(m.ts)}</span>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Trikhya")}`} style={{ color: C.sky, fontSize: 15, alignSelf: "flex-start" }}>{m.email}</a>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: C.ink, whiteSpace: "pre-wrap" }}>{m.message}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {m.status !== "replied" ? <Pill onClick={() => set(m, "replied")}>Mark replied</Pill> : null}
              {m.status !== "archived" ? <Pill onClick={() => set(m, "archived")}>Archive</Pill> : null}
              {m.status !== "new" ? <Pill onClick={() => set(m, "new")}>Back to new</Pill> : null}
              <Pill onClick={() => remove(m)}>Delete</Pill>
            </div>
          </div>
        </Panel>
      ))}
    </>
  );
}
