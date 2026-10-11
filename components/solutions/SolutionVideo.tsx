"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { withBase } from "@/lib/paths";

export type VideoSpec = { src: string; poster?: string; title?: string };

const MONO = "'JetBrains Mono',monospace";
const SKY = "#4FB8EE";
const FRAME: React.CSSProperties = { position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#161a21", border: "1px solid #2a313c", boxShadow: "0 40px 90px rgba(0,0,0,.5)", overflow: "hidden" };
const BTN: React.CSSProperties = { background: "transparent", border: 0, padding: 6, color: "#dde2e8", cursor: "pointer", display: "flex", alignItems: "center", lineHeight: 0 };

const ICON = {
  play: "M6 4 L20 12 L6 20 Z",
  pause: "M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z",
  sound: "M4 9 H8 L13 5 V19 L8 15 H4 Z M16 8 Q19 12 16 16 M18.5 5.5 Q23 12 18.5 18.5",
  muted: "M4 9 H8 L13 5 V19 L8 15 H4 Z M16 9 L21 15 M21 9 L16 15",
  full: "M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15",
};
const Icon = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Replaces the animated demo panel once a recording exists. Local files (public/videos/*.mp4) autoplay muted and loop
 *  behind a control bar in the site's palette; a YouTube or Vimeo URL is embedded instead. Every control swallows its
 *  click, so the player also works inside the solution cards, which are links. */
export function SolutionVideo({ video }: { video: VideoSpec }) {
  const embed = /youtube\.com|youtu\.be|vimeo\.com/.test(video.src);
  if (embed) {
    return <iframe data-wipe="1" src={video.src} title={video.title ?? "Solution walkthrough"} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ ...FRAME, display: "block", border: "1px solid #2a313c" }} />;
  }
  return <Player video={video} />;
}

function Player({ video }: { video: VideoSpec }) {
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const v = ref.current; if (!v) return;
    const sync = () => { setPlaying(!v.paused); setMuted(v.muted); setT(v.currentTime); if (v.duration) setDur(v.duration); };
    for (const ev of ["play", "pause", "volumechange", "timeupdate", "loadedmetadata", "durationchange"]) v.addEventListener(ev, sync);
    sync();
    return () => { for (const ev of ["play", "pause", "volumechange", "timeupdate", "loadedmetadata", "durationchange"]) v.removeEventListener(ev, sync); };
  }, []);

  // Inside a card the whole thing sits in an <a>: keep every click on the player from following the link.
  const stop = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); };
  const toggle = () => { const v = ref.current; if (!v) return; if (v.paused) void v.play(); else v.pause(); };
  const sound = () => { const v = ref.current; if (!v) return; v.muted = !v.muted; if (!v.muted && v.paused) void v.play(); };
  const full = () => { const el = box.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen?.(); };
  const seek = (e: MouseEvent<HTMLDivElement>) => { const v = ref.current; if (!v || !dur) return; const r = e.currentTarget.getBoundingClientRect(); v.currentTime = ((e.clientX - r.left) / r.width) * dur; };

  return (
    <div ref={box} data-wipe="1" data-no-nav="" style={FRAME} onClick={stop}>
      <video ref={ref} src={withBase(video.src)} poster={video.poster ? withBase(video.poster) : undefined} autoPlay muted loop playsInline preload="metadata"
        onClick={(e) => { stop(e); toggle(); }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", background: "#161a21" }}>
        {video.title ?? "Solution walkthrough"}
      </video>

      {/* Control bar */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 12px 10px", display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(180deg, rgba(14,17,22,0) 0%, rgba(14,17,22,.88) 60%)", fontFamily: MONO, fontSize: 12, color: "#dde2e8" }}>
        <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={(e) => { stop(e); toggle(); }} style={BTN}><Icon d={playing ? ICON.pause : ICON.play} fill /></button>
        <span style={{ minWidth: 86, letterSpacing: ".04em", color: "#aab3bf" }}>{fmt(t)} / {fmt(dur)}</span>
        <div role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(dur)} aria-valuenow={Math.round(t)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); seek(e); }}
          style={{ flex: 1, height: 14, display: "flex", alignItems: "center", cursor: "pointer" }}>
          <div style={{ width: "100%", height: 3, background: "#2a313c" }}>
            <div style={{ width: `${dur ? (t / dur) * 100 : 0}%`, height: "100%", background: SKY, transition: "width .2s linear" }} />
          </div>
        </div>
        <button type="button" aria-label={muted ? "Unmute" : "Mute"} onClick={(e) => { stop(e); sound(); }} style={{ ...BTN, color: muted ? "#aab3bf" : SKY }}><Icon d={muted ? ICON.muted : ICON.sound} /></button>
        <button type="button" aria-label="Full screen" onClick={(e) => { stop(e); full(); }} style={BTN}><Icon d={ICON.full} /></button>
      </div>

      {/* Muted hint while narration is off */}
      {muted && (
        <button type="button" onClick={(e) => { stop(e); sound(); }} style={{ position: "absolute", top: 12, right: 12, border: "1px solid rgba(255,255,255,.25)", background: "rgba(14,17,22,.75)", color: "#fff", fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", padding: "6px 10px", borderRadius: 999, cursor: "pointer" }}>
          ● TAP FOR SOUND
        </button>
      )}
    </div>
  );
}
