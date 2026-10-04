/** First-party analytics. Events go straight to Supabase over REST with the publishable key.
 *  Anonymous by default: a per-tab session id. A persistent visitor id is set only after the
 *  cookie notice is accepted. No third-party scripts. */

import { SUPABASE_KEY, SUPABASE_URL } from "./supabase";

type Props = Record<string, string | number | boolean | null | undefined>;

const SESSION_KEY = "trikhya-session";
const VISITOR_KEY = "trikhya-visitor";
const CONSENT_KEY = "trikhya-consent";

const rid = () => (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "").slice(0, 24) : Math.random().toString(36).slice(2) + Date.now().toString(36));

function sessionId() {
  try { let s = sessionStorage.getItem(SESSION_KEY); if (!s) { s = rid(); sessionStorage.setItem(SESSION_KEY, s); } return s; } catch { return "anon-" + rid(); }
}
function consentAll() {
  try { const c = localStorage.getItem(CONSENT_KEY); return !!c && JSON.parse(c).choice === "all"; } catch { return false; }
}
function visitorId(): string | null {
  if (!consentAll()) return null;
  try { let v = localStorage.getItem(VISITOR_KEY); if (!v) { v = rid(); localStorage.setItem(VISITOR_KEY, v); } return v; } catch { return null; }
}

const queue: Record<string, unknown>[] = [];
let timer: number | undefined;
let enabled = false;

function flush(sync = false) {
  if (!queue.length || !SUPABASE_URL) return;
  const body = JSON.stringify(queue.splice(0, queue.length));
  const url = `${SUPABASE_URL}/rest/v1/events`;
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" };
  try {
    fetch(url, { method: "POST", headers, body, keepalive: sync }).catch(() => undefined);
  } catch { /* offline */ }
}

/** Record one event. Cheap to call; batched and sent within a second. */
export function track(name: string, props: Props = {}) {
  if (!enabled) return;
  const clean: Props = {};
  for (const [k, v] of Object.entries(props)) if (v !== undefined && v !== null) clean[k] = typeof v === "string" ? v.slice(0, 300) : v;
  queue.push({
    session_id: sessionId(), visitor_id: visitorId(), name, path: location.pathname, title: document.title.slice(0, 200),
    referrer: document.referrer ? document.referrer.slice(0, 300) : null, props: clean, lang: navigator.language, screen_w: innerWidth,
    ua: navigator.userAgent.slice(0, 200),
  });
  clearTimeout(timer); timer = window.setTimeout(() => flush(), 800);
}

/** Boot once per page load: page view, time on page, scroll depth, and a delegated click tracker. */
export function initAnalytics() {
  if (enabled || typeof window === "undefined" || !SUPABASE_URL) return;
  if (location.pathname.includes("/admin")) return; // never count ourselves
  enabled = true;
  const start = performance.now();
  let maxScroll = 0;
  const depth = () => { const h = document.documentElement; const d = (scrollY + innerHeight) / Math.max(1, h.scrollHeight); maxScroll = Math.max(maxScroll, Math.min(1, d)); };
  addEventListener("scroll", depth, { passive: true }); depth();

  track("page_view", { w: innerWidth, h: innerHeight, dpr: devicePixelRatio, from: sessionStorage.getItem("trikhya-from") || null });
  try { sessionStorage.setItem("trikhya-from", location.pathname); } catch { /* ignore */ }

  // Every link and button, labelled by its text, so page-wise interactions need no manual tagging.
  addEventListener("click", (e) => {
    const el = (e.target as Element | null)?.closest("a,button,[data-track]");
    if (!el) return;
    const explicit = (el as HTMLElement).dataset.track;
    const a = el as HTMLAnchorElement;
    const label = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
    const href = a.href ? a.getAttribute("href") || "" : "";
    const outbound = !!a.href && /^https?:/.test(href) && !href.startsWith(location.origin);
    track(explicit || "click", { label, href: href.slice(0, 200), outbound, tag: el.tagName.toLowerCase(), job: (el as HTMLElement).dataset.job });
  }, { capture: true });

  const leave = () => {
    track("page_leave", { seconds: Math.round((performance.now() - start) / 1000), scroll: Math.round(maxScroll * 100) });
    flush(true);
  };
  addEventListener("pagehide", leave);
  addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });
}
