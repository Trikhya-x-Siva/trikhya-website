/* Godseye, the floating site assistant from the design. Answers from a small
 * knowledge base; a model-backed answer is used only if window.claude exists. */

type Opts = { markWhite: string; markBlue: string };

declare global {
  interface Window { __godseye?: boolean; claude?: { complete?: (prompt: string) => Promise<string> } }
}

export function initGodseye({ markWhite, markBlue }: Opts) {
  if (typeof window === "undefined" || window.__godseye) return;
  window.__godseye = true;
  const L = "#4FB8EE", INK = "#0E1116", PANEL = "#161a21", LINE = "#2a313c", F = "'Hanken Grotesk',sans-serif", M = "'JetBrains Mono',monospace";
  const reduce = window.__trikhyaReduce ?? false;
  const KB: [RegExp, string][] = [
    [/service|offer|do you do|help/i, "We take AI from first idea to everyday use: strategy and discovery, data and systems integration, custom assistants and agents, and deployment with ongoing support."],
    [/solution|built|example|case/i, "Our first solution in production is a Natural Language Query Assistant: plant staff ask questions about orders, materials and finance in plain words and get a checked, sourced answer in seconds. Client names stay private."],
    [/long|time|week|month|timeline/i, "Typically 2 weeks to discover, about 4 more to a working prototype, and around 3 months to deploy across the organisation."],
    [/h-?ai-?h|human|b-?ai/i, "Human, AI, Human: people set the intent, we engineer the intelligence, and people act on the result. B-AI-B serves your teams; B-AI-C serves your customers."],
    [/data|secur|privacy|safe/i, "Systems run in your environment or a private cloud and follow your existing access rules. People keep the final say."],
    [/job|career|hiring|role|work with/i, "We hire engineers, data people and product thinkers. See the Careers page or write to careers@trikhya.ai."],
    [/contact|email|talk|call|price|cost/i, "The quickest way is hello@trikhya.ai, or the form on our Contact page. We reply within two working days."],
    [/^(hi|hello|hey)/i, "Hello. I'm Godseye, Trikhya's assistant. Ask me about our services, solutions or how a project runs."],
  ];
  const SYSTEM = "You are Godseye, the website assistant for Trikhya Intelligence Foundry, an AI engineering company. They build AI with a Human-AI-Human approach (B-AI-B for internal teams, B-AI-C for customers). Offerings: Generalist AI Accelerators, Specialized AI Workflows, Domain Adapted Intelligence. Services: AI strategy & discovery, data & systems integration, custom assistants & agents, deployment & operations. Engagement: discover (weeks 0-2), prototype (2-6), deploy (6-18), evolve. Contact: hello@trikhya.ai. Never name clients. Reply in 1-3 short sentences.";
  const SUGG = ["What do you build?", "How long does a project take?", "What is H-AI-H?", "How do I get in touch?"];
  const css = (el: HTMLElement, s: Partial<CSSStyleDeclaration>) => Object.assign(el.style, s);

  const mount = () => {
    if (!document.body || document.querySelector("[data-godseye]")) return;
    const root = document.createElement("div"); root.setAttribute("data-godseye", "");
    css(root, { position: "fixed", right: "24px", bottom: "24px", zIndex: "350", fontFamily: F, color: "#fff" });
    root.innerHTML = `
<div data-g-panel style="position:absolute;right:0;bottom:76px;width:min(370px,calc(100vw - 32px));height:min(520px,calc(100vh - 140px));background:${PANEL};border:1px solid ${LINE};border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right;opacity:0;transform:translateY(12px) scale(.96);pointer-events:none;transition:opacity .25s, transform .3s cubic-bezier(.2,.7,.2,1);">
  <div style="display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid ${LINE};background:#1670A6;">
    <div style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;"><img src="${markWhite}" alt="" style="width:22px;"></div>
    <div style="display:flex;flex-direction:column;flex:1;line-height:1.2;"><span style="font-weight:800;font-size:17px;">Godseye</span><span style="font-family:${M};font-size:11px;letter-spacing:.08em;color:#d9eefb;">● TRIKHYA ASSISTANT</span></div>
    <button data-g-close aria-label="Close chat" style="width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff;font-size:16px;">✕</button>
  </div>
  <div data-g-log style="flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;"></div>
  <div data-g-sugg style="display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 12px;"></div>
  <form data-g-form style="display:flex;gap:8px;padding:12px;border-top:1px solid ${LINE};">
    <input data-g-in placeholder="Ask Godseye…" aria-label="Message" style="flex:1;min-width:0;background:${INK};border:1px solid ${LINE};border-radius:999px;color:#fff;font:400 15px ${F};padding:12px 16px;outline:none;">
    <button type="submit" aria-label="Send" style="width:44px;height:44px;flex:none;border-radius:50%;border:none;background:${L};color:${INK};font-weight:800;font-size:18px;">↑</button>
  </form>
</div>
<button data-g-btn aria-label="Chat with Godseye" style="display:flex;align-items:center;gap:10px;height:56px;padding:0 20px 0 8px;border-radius:999px;border:none;background:${L};color:${INK};font:800 16px ${F};box-shadow:0 14px 40px rgba(0,0,0,.35);">
  <span style="width:40px;height:40px;border-radius:50%;background:${INK};display:flex;align-items:center;justify-content:center;"><img src="${markBlue}" alt="" style="width:22px;height:22px;object-fit:contain;transform-origin:49.5% 61.6%;"></span>
  <span data-g-lbl>Ask Godseye</span>
</button>`;
    document.body.appendChild(root);
    const $ = <T extends HTMLElement>(s: string) => root.querySelector(s) as T;
    const panel = $<HTMLElement>("[data-g-panel]"), log = $<HTMLElement>("[data-g-log]"), sugg = $<HTMLElement>("[data-g-sugg]"), input = $<HTMLInputElement>("[data-g-in]");
    let open = false, busy = false; const history: [string, string][] = [];
    const setOpen = (v: boolean) => {
      open = v;
      css(panel, v ? { opacity: "1", transform: "none", pointerEvents: "auto" } : { opacity: "0", transform: "translateY(12px) scale(.96)", pointerEvents: "none" });
      $("[data-g-lbl]").textContent = v ? "Close" : "Ask Godseye";
      if (v) setTimeout(() => input.focus(), 200);
    };
    const bubble = (who: "me" | "bot", text: string) => {
      const b = document.createElement("div"); const me = who === "me";
      css(b, { alignSelf: me ? "flex-end" : "flex-start", maxWidth: "85%", padding: "11px 14px", borderRadius: me ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: me ? L : "#232a34", color: me ? INK : "#e6eaef", fontSize: "15px", lineHeight: "1.45" });
      b.textContent = text; log.appendChild(b);
      if (!reduce) b.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "ease-out" });
      log.scrollTop = log.scrollHeight; return b;
    };
    const typing = () => {
      const b = bubble("bot", "");
      b.innerHTML = [0, 1, 2].map(() => `<span style="display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:#8a94a1;"></span>`).join("");
      if (!reduce) b.querySelectorAll("span").forEach((d, i) => d.animate([{ opacity: 0.3 }, { opacity: 1 }, { opacity: 0.3 }], { duration: 900, delay: i * 150, iterations: Infinity }));
      return b;
    };
    const canned = (q: string) => (KB.find(([r]) => r.test(q)) || [0, "Good question. A person from our team can answer that properly: write to hello@trikhya.ai and we'll reply within two working days."])[1] as string;
    const ask = async (q: string) => {
      if (!q.trim() || busy) return;
      busy = true; sugg.style.display = "none"; bubble("me", q); input.value = ""; const t = typing();
      let a: string | null = null;
      try { if (window.claude?.complete) { const convo = history.slice(-6).map((h) => `${h[0]}: ${h[1]}`).join("\n"); a = await window.claude.complete(`${SYSTEM}\n\n${convo}\nVisitor: ${q}\nGodseye:`); } } catch { a = null; }
      if (!a) { await new Promise((r) => setTimeout(r, 700)); a = canned(q); }
      a = String(a).trim(); history.push(["Visitor", q], ["Godseye", a]); t.remove(); bubble("bot", a); busy = false;
    };
    SUGG.forEach((s) => {
      const c = document.createElement("button"); c.type = "button"; c.textContent = s;
      css(c, { background: "transparent", border: `1px solid ${LINE}`, color: "#d4dae2", borderRadius: "999px", padding: "8px 12px", font: `500 13px ${F}` });
      c.onmouseenter = () => css(c, { borderColor: L, color: L }); c.onmouseleave = () => css(c, { borderColor: LINE, color: "#d4dae2" }); c.onclick = () => ask(s);
      sugg.appendChild(c);
    });
    const fit = () => {
      const sm = innerWidth < 640;
      $("[data-g-lbl]").style.display = sm ? "none" : "";
      Object.assign($("[data-g-btn]").style, sm ? { padding: "0 8px", height: "56px" } : { padding: "0 20px 0 8px" });
      Object.assign(root.style, sm ? { right: "16px", bottom: "16px" } : { right: "24px", bottom: "24px" });
      Object.assign(panel.style, sm ? { width: "calc(100vw - 32px)", height: "calc(100vh - 110px)" } : { width: "min(370px,calc(100vw - 32px))", height: "min(520px,calc(100vh - 140px))" });
    };
    fit(); addEventListener("resize", fit);
    bubble("bot", "Hi, I'm Godseye. Ask me anything about Trikhya Intelligence Foundry.");
    $("[data-g-btn]").onclick = () => setOpen(!open); $("[data-g-close]").onclick = () => setOpen(false);
    ($("[data-g-form]") as HTMLFormElement).onsubmit = (e) => { e.preventDefault(); ask(input.value); };
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) setOpen(false); });
    const mark = $("[data-g-btn] img");
    if (mark && !reduce) mark.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 12000, iterations: Infinity, easing: "linear" });
    if (!reduce) $("[data-g-btn]").animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 1200, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
  };
  mount();
}
