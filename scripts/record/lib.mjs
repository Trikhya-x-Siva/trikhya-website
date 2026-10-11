// Shared recorder: drives a product in headless Chromium, records the session, converts it to MP4 + poster.
// Demo polish: a drawn cursor with click ripples, zoom-ins on the active area, step captions, and a voice-over
// generated from those captions and mixed under the clip.
// Usage from a scenario file:  await record({ name, url, scrub, narration, run: async (page, say) => { ... } })
// Output: public/videos/<name>.mp4 and public/videos/<name>.jpg, which the site picks up via `video` on the solution content.
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import ffmpeg from "ffmpeg-static";
import fs from "node:fs";
import path from "node:path";

const VIEWPORT = { width: 1280, height: 720 };
const SECRETS = path.resolve("supabase/.env.secrets"); // SARVAM_API_KEY lives here
const VOICE_LEAD_MS = 350; // the video starts a beat before our clock

/** Runs inside the page before any app script. Rewrites brand text everywhere it appears and hides brand images.
 *  `rules` = [{ pattern, flags, replace }]; `hideSelector` = CSS selector for logos. Keeps up with React re-renders. */
export function scrubScript({ rules, hideSelector }) {
  const regs = rules.map((r) => [new RegExp(r.pattern, r.flags), r.replace]);
  const fix = (s) => regs.reduce((acc, [re, rep]) => acc.replace(re, rep), s);
  const ATTRS = ["placeholder", "title", "alt", "aria-label"];
  const visit = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n = walker.currentNode;
    while (n) {
      if (n.nodeType === 3) { const v = fix(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
      else if (n.nodeType === 1) {
        for (const a of ATTRS) { const v = n.getAttribute(a); if (v) { const w = fix(v); if (w !== v) n.setAttribute(a, w); } }
        if (n.tagName === "INPUT" && n.value) { const w = fix(n.value); if (w !== n.value) n.value = w; }
      }
      n = walker.nextNode();
    }
    if (document.title) { const t = fix(document.title); if (t !== document.title) document.title = t; }
  };
  const start = () => {
    // Always drop the Next.js dev overlay badge; hide brand images when asked.
    const st = document.createElement("style");
    st.textContent = `nextjs-portal{display:none !important}` + (hideSelector ? `${hideSelector}{visibility:hidden !important}` : "");
    const keep = () => { if (!st.isConnected) document.documentElement.appendChild(st); };
    keep(); setInterval(keep, 200); // React hydration drops nodes it did not render
    visit(document.documentElement);
    new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "characterData") { const v = fix(m.target.nodeValue); if (v !== m.target.nodeValue) m.target.nodeValue = v; }
        else if (m.type === "attributes") { const v = m.target.getAttribute(m.attributeName); if (v) { const w = fix(v); if (w !== v) m.target.setAttribute(m.attributeName, w); } }
        else m.addedNodes.forEach((x) => visit(x));
      }
    }).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
}

/** Runs inside the page: a drawn cursor that follows the real pointer, a ripple on every click, and a caption pill.
 *  All three hang off <html>, not <body>, so zooming the body never moves them. Position and caption survive navigation. */
function overlayScript({ captionPos }) {
  const css = `
#__cur{position:fixed;left:0;top:0;width:22px;height:30px;z-index:2147483646;pointer-events:none;opacity:0;transition:opacity .3s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
.__rip{position:fixed;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;border:3px solid #4FB8EE;z-index:2147483645;pointer-events:none;animation:__rip .6s ease-out forwards}
@keyframes __rip{from{transform:scale(.3);opacity:.95}to{transform:scale(1.5);opacity:0}}
#__cap{position:fixed;left:50%;${captionPos};transform:translate(-50%,12px);max-width:70%;padding:12px 22px;border-radius:999px;background:rgba(14,17,22,.9);color:#fff;font:600 19px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;z-index:2147483646;pointer-events:none;opacity:0;transition:opacity .35s,transform .35s;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.35)}
#__cap.on{opacity:1;transform:translate(-50%,0)}
body{transition:transform .9s cubic-bezier(.2,.7,.2,1)}`;
  const start = () => {
    const root = document.documentElement;
    const st = document.createElement("style"); st.textContent = css;
    const cur = document.createElement("div"); cur.id = "__cur";
    cur.innerHTML = '<svg viewBox="0 0 22 30" width="22" height="30"><path d="M2 2 L2 24 L8 18.5 L12.5 28 L16 26.4 L11.6 17 L20 17 Z" fill="#fff" stroke="#0E1116" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const cap = document.createElement("div"); cap.id = "__cap";
    // React hydrates the whole document and throws away nodes it did not render, so re-attach ours whenever they vanish.
    const ensure = () => { for (const el of [st, cur, cap]) if (!el.isConnected) root.appendChild(el); };
    ensure(); setInterval(ensure, 200);
    const place = (x, y) => { cur.style.transform = `translate(${x - 2}px,${y - 1}px)`; cur.style.opacity = "1"; };
    const caption = (t) => { ensure(); if (t) { cap.textContent = t; cap.classList.add("on"); } else cap.classList.remove("on"); try { t ? sessionStorage.setItem("__cap", t) : sessionStorage.removeItem("__cap"); } catch {} };
    window.__overlay = { ensure, caption };
    try {
      const p = JSON.parse(sessionStorage.getItem("__curpos") || "null"); if (p) place(p.x, p.y);
      const t = sessionStorage.getItem("__cap"); if (t) caption(t);
    } catch {}
    document.addEventListener("mousemove", (e) => { ensure(); place(e.clientX, e.clientY); try { sessionStorage.setItem("__curpos", JSON.stringify({ x: e.clientX, y: e.clientY })); } catch {} }, true);
    document.addEventListener("mousedown", (e) => {
      ensure();
      const r = document.createElement("div"); r.className = "__rip"; r.style.left = `${e.clientX}px`; r.style.top = `${e.clientY}px`;
      root.appendChild(r); setTimeout(() => r.remove(), 650);
    }, true);
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
}

export async function record({ name, url, scrub, hideSelector, narration = [], run, viewport = VIEWPORT, outDir = "public/videos", captionPos = "bottom:36px" }) {
  const tmp = path.resolve(".record-tmp", name);
  fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  fs.mkdirSync(path.resolve(outDir), { recursive: true });

  // Voice lines are synthesised up front so the scenario knows how long each one takes to say.
  const voice = new Map();
  for (const line of narration) voice.set(line, await tts(line));

  // Let module videos autoplay in the headless browser so the player is not a frozen frame on film.
  const browser = await chromium.launch({ headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, recordVideo: { dir: tmp, size: viewport }, ignoreHTTPSErrors: true });
  if (scrub?.length || hideSelector) await ctx.addInitScript(scrubScript, { rules: scrub ?? [], hideSelector: hideSelector ?? "" });
  await ctx.addInitScript(overlayScript, { captionPos });
  const page = await ctx.newPage();
  page.setDefaultTimeout(60_000);
  const t0 = Date.now();
  const spoken = []; // { at: ms into the video, wav, ms }

  /** Show a caption and queue its voice line. Returns how long the line takes to say, so the scenario can dwell. */
  const say = async (text) => {
    const v = voice.get(text) ?? (voice.set(text, await tts(text)), voice.get(text));
    spoken.push({ at: Date.now() - t0 + VOICE_LEAD_MS, ...v });
    await page.evaluate((t) => window.__overlay?.caption(t), text);
    say.voiceEnd = Date.now() + v.ms;
    return v.ms;
  };
  say.voiceEnd = 0;
  say.clear = () => page.evaluate(() => window.__overlay?.caption(""));
  /** Dwell until the current voice line has finished, plus a beat. */
  say.settle = async (extra = 700) => { const w = say.voiceEnd - Date.now() + extra; if (w > 0) await page.waitForTimeout(w); };
  /** Run a long wait (model call, upload) and cut most of it from the final video: the first `keepMs` after the
   *  narration ends stays on screen, then the clip jumps to the moment the wait finished. */
  const cuts = []; // [from, to] in ms on the voice clock
  say.skipWhile = async (fn, keepMs = 1200) => {
    const start = Date.now();
    await fn();
    const end = Date.now();
    const from = Math.max(start, say.voiceEnd) + keepMs, to = end - 300;
    if (to - from > 1500) cuts.push([from - t0 + VOICE_LEAD_MS, to - t0 + VOICE_LEAD_MS]);
  };

  let failure;
  try {
    await page.goto(url, { waitUntil: "load" });
    await run(page, say);
    await page.waitForTimeout(1800);
  } catch (e) {
    failure = e; // still convert whatever was captured, then rethrow so the run is reported as failed
  } finally {
    const video = page.video();
    await ctx.close(); await browser.close();
    if (failure) console.error(`\n${name}: scenario failed — ${failure.message?.split("\n")[0]}`);
    const webm = await video.path().catch(() => null);
    if (!webm) { if (failure) throw failure; throw new Error("no video captured"); }
    const silent = path.join(tmp, "silent.mp4");
    const mp4 = path.resolve(outDir, `${name}.mp4`), poster = path.resolve(outDir, `${name}.jpg`);
    // Drop the dead stretches, then re-time every voice line by the cut material before it.
    const cutExpr = cuts.length ? `not(${cuts.map(([a, b]) => `between(t,${(a / 1000).toFixed(3)},${(b / 1000).toFixed(3)})`).join("+")})` : null;
    const vf = cutExpr ? ["-vf", `select='${cutExpr}',setpts=N/FRAME_RATE/TB`, "-r", "25"] : [];
    run_ffmpeg(["-y", "-i", webm, ...vf, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", silent]);
    const removedBefore = (at) => cuts.reduce((sum, [a, b]) => sum + (b <= at ? b - a : a < at ? at - a : 0), 0);
    const timed = spoken.map((s) => ({ ...s, at: Math.max(0, s.at - removedBefore(s.at)) }));
    if (cuts.length) console.log(`${name}: cut ${(cuts.reduce((n, [a, b]) => n + b - a, 0) / 1000).toFixed(1)}s of waiting across ${cuts.length} stretch(es)`);
    mixVoice(silent, timed, mp4);
    run_ffmpeg(["-y", "-ss", "12", "-i", mp4, "-frames:v", "1", "-update", "1", "-q:v", "3", poster]); // past the sign-in slate
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`\n${name}: ${mp4} (${(fs.statSync(mp4).size / 1e6).toFixed(1)} MB, ${spoken.length} voice lines), poster ${poster}`);
    if (failure) throw failure;
  }
}

/** Lay each voice line at the moment its caption appeared, under the silent video. */
function mixVoice(silent, spoken, out) {
  if (!spoken.length) { fs.copyFileSync(silent, out); return; }
  const inputs = spoken.flatMap((s) => ["-i", s.wav]);
  const delays = spoken.map((s, i) => `[${i + 1}:a]adelay=${s.at}|${s.at},volume=1.0[a${i}]`).join(";");
  const mix = spoken.map((_, i) => `[a${i}]`).join("") + `amix=inputs=${spoken.length}:normalize=0:dropout_transition=0,apad[a]`;
  run_ffmpeg(["-y", "-i", silent, ...inputs, "-filter_complex", `${delays};${mix}`, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", out]);
}

/** Text → WAV. Sarvam (Indian-English voice) when the key is around, Windows speech otherwise. Cached by text. */
export async function tts(text) {
  const dir = path.resolve(".record-tmp/voice"); fs.mkdirSync(dir, { recursive: true });
  const wav = path.join(dir, `${createHash("sha1").update(text).digest("hex").slice(0, 16)}.wav`);
  if (!fs.existsSync(wav)) {
    const key = process.env.SARVAM_API_KEY ?? (fs.existsSync(SECRETS) ? dotenv(SECRETS).SARVAM_API_KEY : undefined);
    let done = false;
    if (key) {
      try {
        const r = await fetch("https://api.sarvam.ai/text-to-speech", {
          method: "POST", headers: { "api-subscription-key": key, "content-type": "application/json" },
          body: JSON.stringify({ inputs: [text], target_language_code: "en-IN", speaker: "ishita", model: "bulbul:v3", output_audio_codec: "wav", pace: 1.0 }),
        });
        if (r.ok) { const j = await r.json(); fs.writeFileSync(wav, Buffer.from(j.audios[0], "base64")); done = true; }
        else console.warn(`sarvam tts ${r.status}: ${(await r.text()).slice(0, 160)}`);
      } catch (e) { console.warn(`sarvam tts failed: ${e.message}`); }
    }
    if (!done) {
      const esc = (s) => s.replace(/'/g, "''");
      spawnSync("powershell", ["-NoProfile", "-Command", `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = 0; $s.SetOutputToWaveFile('${esc(wav)}'); $s.Speak('${esc(text)}'); $s.Dispose()`], { stdio: "ignore" });
    }
  }
  return { wav, ms: wavMs(wav) };
}
function wavMs(file) {
  const b = fs.readFileSync(file);
  const byteRate = b.readUInt32LE(28) || 1;
  return Math.round(((b.length - 44) / byteRate) * 1000);
}

function run_ffmpeg(args) {
  const r = spawnSync(ffmpeg, args, { stdio: ["ignore", "ignore", "inherit"] });
  if (r.status !== 0) throw new Error(`ffmpeg failed (${r.status})`);
}

/** Full-screen slate shown while signing in, so credentials and account emails never appear on film.
 *  pointer-events:none so clicks still reach the form underneath; it only hides, it does not block. */
export async function curtain(page, text = "Signing in…") {
  await page.evaluate((t) => {
    const d = document.createElement("div"); d.id = "__curtain";
    d.style.cssText = "position:fixed;inset:0;z-index:2147483640;pointer-events:none;background:#0E1116;color:#fff;display:flex;align-items:center;justify-content:center;font:600 22px/1 system-ui,sans-serif;letter-spacing:.02em";
    d.textContent = t; document.documentElement.appendChild(d);
  }, text);
}
export const uncurtain = (page) => page.evaluate(() => document.getElementById("__curtain")?.remove());

/** Move the pointer to an element's centre in a smooth arc of small steps, then press. */
export async function moveTo(page, target, steps = 28) {
  const loc = typeof target === "string" ? page.locator(target).first() : target;
  await loc.scrollIntoViewIfNeeded();
  const box = await loc.boundingBox();
  if (!box) throw new Error(`no box for ${target}`);
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.mouse.move(x, y, { steps });
  return { x, y };
}
export async function click(page, target) {
  await moveTo(page, target);
  await page.waitForTimeout(220);
  await page.mouse.down(); await page.waitForTimeout(90); await page.mouse.up();
}
export async function typeInto(page, selector, text, delay = 45) {
  await click(page, selector);
  await page.locator(selector).first().pressSequentially(text, { delay });
}

/** Zoom the page in on an element (the body scales around its centre), and back out. */
export async function zoomTo(page, target, scale = 1.5) {
  const loc = typeof target === "string" ? page.locator(target).first() : target;
  // A missing zoom target must never sink a recording: just skip the zoom.
  const ok = await loc.scrollIntoViewIfNeeded({ timeout: 5000 }).then(() => true, () => false);
  if (!ok) return;
  await page.evaluate(() => { document.body.style.transform = "none"; });
  await page.waitForTimeout(60);
  const box = await loc.boundingBox();
  if (!box) return;
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.evaluate(([x, y, s]) => {
    // Scale from the document origin and translate so the focus point lands at the viewport centre,
    // clamped so the page edges never show through.
    const W = innerWidth, H = innerHeight, sx = scrollX, sy = scrollY;
    const bodyH = Math.max(document.body.scrollHeight, H), bodyW = Math.max(document.body.scrollWidth, W);
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const tx = clamp(W / 2 + sx - s * (x + sx), sx + W - s * bodyW, sx);
    const ty = clamp(H / 2 + sy - s * (y + sy), sy + H - s * bodyH, sy);
    const b = document.body;
    b.style.transformOrigin = "0 0";
    b.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    document.documentElement.style.overflow = "hidden";
  }, [cx, cy, scale]);
  await page.waitForTimeout(950);
}
export async function zoomOut(page) {
  await page.evaluate(() => { document.body.style.transform = "none"; document.documentElement.style.overflow = ""; });
  await page.waitForTimeout(950);
}

/** Slow wheel scroll so the viewer can follow. */
export async function wheel(page, dy, steps = 8, every = 90) {
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await page.waitForTimeout(every); }
}

/** Read KEY=value pairs from a dotenv file without exporting them anywhere. */
export function dotenv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => /^[A-Za-z_][A-Za-z0-9_]*\s*=/.test(l))
      .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, "$2")]; }),
  );
}

export const pause = (page, ms) => page.waitForTimeout(ms);
