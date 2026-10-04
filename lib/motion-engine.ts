/* Site-wide motion engine, ported from the Claude Design export.
 * Scans the DOM for data-* hooks (word, assemble, wipe, fill, parallax, pin,
 * htrack, magnet, spot, tilt, sweep, blueprint, flow, menu, hover, focus),
 * and adds the global progress bar, cursor ring, magnetic buttons and the
 * page-wipe transition between routes. Desktop-first by design. */

type Opts = { markWhite: string; markBlue: string };

declare global {
  interface Window { __trikhyaMotion?: boolean; __trikhyaReduce?: boolean }
}

/** Motion policy: always play the full choreography. The OS "reduce motion"
 *  preference is intentionally ignored (client decision, 2026-10-04). Setting
 *  localStorage "trikhya-motion" = "reduce" restores the calm fallback for testing. */
export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem("trikhya-motion") === "reduce"; } catch { return false; }
}

export function initMotion({ markWhite, markBlue }: Opts) {
  if (typeof window === "undefined" || window.__trikhyaMotion) return;
  window.__trikhyaMotion = true;

  const reduce = reducedMotion();
  window.__trikhyaReduce = reduce;
  const fine = matchMedia("(pointer: fine)").matches;
  const E = "cubic-bezier(.2,.7,.2,1)", L = "#4FB8EE", B = "#1670A6";
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const fresh = (el: HTMLElement, k: string) => { const key = "m" + k; if (el.dataset[key]) return false; el.dataset[key] = "1"; return true; };
  type Viewable = HTMLElement & { __onView?: () => void };
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); (e.target as Viewable).__onView?.(); } }), { threshold: 0.2 });
  const onView = (el: HTMLElement, fn: () => void) => { (el as Viewable).__onView = fn; io.observe(el); };
  const ARROW = /→\s*$/;
  let wipeDelay = 0;

  const parseCss = (s: string) => s.split(";").map((d) => d.split(":")).filter((p) => p.length >= 2).map(([k, ...v]) => [k.trim(), v.join(":").trim()] as const);

  const scrollers = new Set<HTMLElement>();
  const magnets: HTMLElement[] = [];

  const init: Record<string, (el: HTMLElement) => void> = {
    word(el) {
      const sec = el.closest("section") || document.body;
      const all = [...sec.querySelectorAll("[data-word]")], i = Math.max(0, all.indexOf(el));
      if (reduce) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 100 + i * 70, easing: "ease-out", fill: "backwards" }); return; }
      el.animate([{ opacity: 0, transform: "translateY(48px)", filter: "blur(6px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }], { duration: 1000, delay: wipeDelay + 200 + i * 90, easing: E, fill: "backwards" });
    },
    assemble(el) {
      const polys = ["polygon(0% 80%,43% 5%,52% 45%,9% 99%)", "polygon(46% 1%,61% 6%,99% 79%,58% 70%)", "polygon(12% 100%,36% 67%,99% 84%,89% 100%)"];
      el.style.position = "relative";
      el.innerHTML = polys.map((c) => `<img src="${markBlue}" alt="" style="position:absolute;inset:0;width:100%;height:100%;clip-path:${c};">`).join("");
      if (reduce) return;
      const fr: [string, number][] = [["-120px,-50px", -40], ["120px,-60px", 40], ["0,110px", 25]];
      const imgs = el.querySelectorAll<HTMLElement>("img"); imgs.forEach((i) => (i.style.opacity = "0"));
      onView(el, () => imgs.forEach((im, i) => im.animate([{ opacity: 0, transform: `translate(${fr[i][0]}) rotate(${fr[i][1]}deg)` }, { opacity: 1, transform: "none" }], { duration: 1200, delay: 150 + i * 180, easing: "cubic-bezier(.3,1.4,.4,1)", fill: "both" })));
    },
    wipe(el) {
      if (reduce) return;
      // A fully clipped element never "intersects", so the reveal is driven by the scroll loop.
      el.style.clipPath = "inset(0 100% 0 0)";
      el.dataset.wipePending = "1";
      scrollers.add(el);
    },
    fill(el) {
      el.innerHTML = (el.textContent || "").trim().split(/\s+/).map((w) => `<span data-fw style="transition:opacity .25s;opacity:.18;">${w}</span>`).join(" ");
      if (reduce) el.querySelectorAll<HTMLElement>("[data-fw]").forEach((s) => (s.style.opacity = "1"));
      scrollers.add(el);
    },
    parallax(el) { if (!reduce) scrollers.add(el); },
    pin(el) {
      // Autoplay instead of scroll-scrubbing: no sticky runway, no blank space to scroll through.
      const steps = el.querySelectorAll<HTMLElement>("[data-pin-step]"), line = el.querySelector<HTMLElement>("[data-pin-line]");
      el.style.height = "auto";
      const sticky = el.firstElementChild as HTMLElement | null;
      if (sticky) { sticky.style.position = "static"; sticky.style.top = ""; }
      if (reduce) { steps.forEach((st) => (st.style.opacity = "1")); if (line) line.style.transform = "scaleX(1)"; return; }
      steps.forEach((st) => { st.style.opacity = "0.28"; st.style.transition = "opacity .5s, transform .5s"; });
      if (line) line.style.transform = "scaleX(0)";
      onView(el, () => {
        if (line) line.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 1600, easing: E, fill: "forwards" });
        steps.forEach((st, i) => setTimeout(() => {
          st.style.opacity = "1"; st.style.transform = "translateY(-6px)";
          setTimeout(() => (st.style.transform = "none"), 600);
        }, 200 + i * 480));
      });
    },
    htrack(el) { scrollers.add(el); },
    magnet(el) {
      if (!fine || reduce) return;
      magnets.push(el); el.style.transition = "transform .3s " + E; el.style.display = el.style.display || "inline-block";
    },
    spot(el) {
      if (!fine) return;
      el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); el.style.backgroundImage = `radial-gradient(260px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(79,184,238,.16), transparent 70%)`; });
      el.addEventListener("mouseleave", () => { el.style.backgroundImage = ""; });
    },
    tilt(el) {
      if (!fine || reduce) return;
      el.style.transition = (el.style.transition ? el.style.transition + "," : "") + "transform .25s ease-out";
      el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`; });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    },
    sweep(el) {
      const col = el.dataset.sweep && el.dataset.sweep !== "1" ? el.dataset.sweep : L, ink = el.dataset.sweepInk || "#0E1116";
      Object.assign(el.style, { position: "relative", overflow: "hidden", isolation: "isolate" });
      const f = document.createElement("span");
      Object.assign(f.style, { position: "absolute", inset: "0", background: col, transform: "translateX(-101%)", transition: "transform .45s " + E, zIndex: "-1", pointerEvents: "none" });
      el.prepend(f);
      const orig = el.style.color;
      el.addEventListener("mouseenter", () => { f.style.transform = "none"; el.style.color = ink; });
      el.addEventListener("mouseleave", () => { f.style.transform = "translateX(101%)"; el.style.color = orig; setTimeout(() => { f.style.transition = "none"; f.style.transform = "translateX(-101%)"; void f.offsetWidth; f.style.transition = "transform .45s " + E; }, 450); });
    },
    arrow(el) {
      const last = [...el.childNodes].reverse().find((n) => (n.nodeType === 3 ? (n.nodeValue || "").trim() : true));
      if (!last) return;
      const target = last.nodeType === 3 ? last : [...last.childNodes].reverse().find((n) => n.nodeType === 3 && ARROW.test(n.nodeValue || ""));
      if (!target || !ARROW.test(target.nodeValue || "")) return;
      target.nodeValue = (target.nodeValue || "").replace(ARROW, "");
      const s = document.createElement("span"); s.textContent = "→";
      Object.assign(s.style, { display: "inline-block", transition: "transform .3s " + E, marginLeft: ".25em" });
      (target as ChildNode).after(s);
      el.addEventListener("mouseenter", () => (s.style.transform = "translateX(6px)"));
      el.addEventListener("mouseleave", () => (s.style.transform = ""));
    },
    blueprint(el) {
      Object.assign(el.style, { backgroundImage: "linear-gradient(rgba(79,184,238,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(79,184,238,.07) 1px,transparent 1px)", backgroundSize: "64px 64px", overflow: "hidden" });
      if (reduce) return;
      for (let i = 0; i < 6; i++) {
        const hz = i % 2 === 0, d = document.createElement("div");
        Object.assign(d.style, hz
          ? { position: "absolute", left: "0", top: 64 * (2 + i * 2) + "px", width: "120px", height: "1px", background: `linear-gradient(90deg,transparent,${L})` }
          : { position: "absolute", top: "0", left: 64 * (3 + i * 3) + "px", width: "1px", height: "120px", background: `linear-gradient(transparent,${L})` });
        el.appendChild(d);
        d.animate(hz ? [{ transform: "translateX(-140px)" }, { transform: "translateX(110vw)" }] : [{ transform: "translateY(-140px)" }, { transform: "translateY(1400px)" }], { duration: 5000 + i * 900, delay: i * 700, iterations: Infinity, easing: "linear" });
      }
    },
    flow(el) {
      el.innerHTML = `<div style="position:absolute;left:28px;right:28px;top:50%;height:2px;background:#232a34;"></div>` +
        ["H", "AI", "H"].map((t, i) => `<div ${i === 1 ? "data-ai" : ""} style="position:absolute;top:50%;${i === 0 ? "left:0;" : i === 1 ? "left:50%;" : "right:0;"}transform:translate(${i === 1 ? "-50%" : "0"},-50%);width:60px;height:60px;border-radius:50%;${i === 1 ? `background:${L};color:#0E1116;` : `border:2px solid ${L};color:${L};background:#0E1116;`}display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;z-index:1;">${t}</div>`).join("") +
        [0, 1, 2, 3, 4].map(() => `<div data-p style="position:absolute;top:50%;left:30px;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:${L};box-shadow:0 0 14px ${L};opacity:0;"></div>`).join("");
      if (reduce) return;
      onView(el, () => {
        const w = el.clientWidth - 68;
        el.querySelectorAll<HTMLElement>("[data-p]").forEach((p, i) => p.animate([{ transform: "translateX(0)", opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: 0.92 }, { transform: `translateX(${w}px)`, opacity: 0 }], { duration: 3200, delay: i * 640, iterations: Infinity, easing: "cubic-bezier(.5,0,.5,1)" }));
        el.querySelector<HTMLElement>("[data-ai]")?.animate([{ boxShadow: "0 0 0 0 rgba(79,184,238,.5)" }, { boxShadow: "0 0 0 22px rgba(79,184,238,0)" }], { duration: 1400, iterations: Infinity });
      });
    },
    menu(el) {
      if (reduce) return;
      [...el.children].forEach((c, i) => (c as HTMLElement).animate([{ opacity: 0, transform: "translateX(-30px)" }, { opacity: 1, transform: "none" }], { duration: 450, delay: 40 + i * 60, easing: E, fill: "backwards" }));
    },
    hover(el) {
      // the design's style-hover="…" attribute
      const rules = parseCss(el.dataset.hover || "");
      const saved: Record<string, string> = {};
      el.addEventListener("mouseenter", () => rules.forEach(([k, v]) => { saved[k] = el.style.getPropertyValue(k); el.style.setProperty(k, v); }));
      el.addEventListener("mouseleave", () => rules.forEach(([k]) => el.style.setProperty(k, saved[k] || "")));
    },
    focus(el) {
      const rules = parseCss(el.dataset.focus || "");
      const saved: Record<string, string> = {};
      el.addEventListener("focus", () => rules.forEach(([k, v]) => { saved[k] = el.style.getPropertyValue(k); el.style.setProperty(k, v); }));
      el.addEventListener("blur", () => rules.forEach(([k]) => el.style.setProperty(k, saved[k] || "")));
    },
  };

  /* ---------- scroll-driven ---------- */
  let bar: HTMLElement | null = null, brand: HTMLElement | null = null, ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight, narrow = innerWidth < 900;
    const doc = document.documentElement, max = doc.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (brand) brand.style.transform = scrollY > 40 ? "scale(.9)" : "";
    document.querySelectorAll<HTMLElement>("[data-hide-sm]").forEach((h) => (h.style.display = innerWidth < 640 ? "none" : ""));
    scrollers.forEach((el) => {
      if (!el.isConnected) { scrollers.delete(el); return; }
      const r = el.getBoundingClientRect();
      if (el.dataset.wipePending) {
        if (r.top < vh * 0.85 && r.bottom > vh * 0.1) {
          delete el.dataset.wipePending; scrollers.delete(el);
          el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 1000, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }).finished.then(() => (el.style.clipPath = "none"));
        }
      } else if (el.dataset.parallax) {
        const f = parseFloat(el.dataset.parallax) || 0.15;
        el.style.translate = `0 ${(r.top + r.height / 2 - vh / 2) * -f}px`;
      } else if (el.hasAttribute("data-fill")) {
        const p = clamp((vh * 0.85 - r.top) / (vh * 0.5));
        const ws = el.querySelectorAll<HTMLElement>("[data-fw]");
        ws.forEach((w, i) => (w.style.opacity = (i + 1) / ws.length <= p + 0.02 ? "1" : "0.18"));
      } else if (el.hasAttribute("data-htrack")) {
        const row = el.querySelector<HTMLElement>("[data-htrack-row]"); if (!row || !row.parentElement) return;
        const vis = row.parentElement.clientWidth, dist = Math.max(0, row.scrollWidth - vis);
        el.style.height = vh + dist + "px";
        const p = clamp(-r.top / Math.max(1, el.offsetHeight - vh));
        row.style.transform = `translateX(${-dist * p}px)`;
      }
    });
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", req, { passive: true }); addEventListener("resize", req);

  /* ---------- globals: progress bar, cursor ring, magnets, page wipe ---------- */
  const globals = () => {
    if (!bar) {
      bar = document.createElement("div");
      Object.assign(bar.style, { position: "fixed", left: "0", top: "0", height: "3px", width: "100%", background: L, transformOrigin: "left", transform: "scaleX(0)", zIndex: "200", pointerEvents: "none" });
      document.body.appendChild(bar);
    }
    if (fine && !reduce && !document.querySelector("[data-cursor-ring]")) {
      const ring = document.createElement("div"); ring.setAttribute("data-cursor-ring", "");
      Object.assign(ring.style, { position: "fixed", left: "0", top: "0", width: "34px", height: "34px", margin: "-17px 0 0 -17px", border: `1.5px solid ${L}`, borderRadius: "50%", pointerEvents: "none", zIndex: "300", opacity: "0", transition: "width .25s, height .25s, margin .25s, background .25s, opacity .2s" });
      document.body.appendChild(ring);
      let tx = 0, ty = 0, x = 0, y = 0;
      addEventListener("mousemove", (e) => {
        tx = e.clientX; ty = e.clientY; ring.style.opacity = "1";
        const t = e.target as Element | null;
        const over = t && t.closest && t.closest("a,button,input,textarea,[data-hit]");
        Object.assign(ring.style, over ? { width: "60px", height: "60px", margin: "-30px 0 0 -30px", background: "rgba(79,184,238,.14)" } : { width: "34px", height: "34px", margin: "-17px 0 0 -17px", background: "transparent" });
        for (const m of magnets) {
          if (!m.isConnected) continue;
          const r = m.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          m.style.transform = Math.hypot(dx, dy) < Math.max(110, r.width) ? `translate(${dx * 0.25}px,${dy * 0.3}px)` : "";
        }
      });
      document.addEventListener("mouseleave", () => (ring.style.opacity = "0"));
      (function loop() { x += (tx - x) * 0.2; y += (ty - y) * 0.2; ring.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
    }
    if (!document.querySelector("[data-page-wipe]")) {
      const w = document.createElement("div"); w.setAttribute("data-page-wipe", "");
      Object.assign(w.style, { position: "fixed", inset: "0", background: B, zIndex: "400", display: "flex", alignItems: "center", justifyContent: "center", transform: "translateY(100%)", pointerEvents: "none" });
      w.innerHTML = `<img src="${markWhite}" alt="" style="width:72px;">`;
      document.body.appendChild(w);
      let came = false;
      try { came = sessionStorage.getItem("trikhya-wipe") === "1"; sessionStorage.removeItem("trikhya-wipe"); } catch { /* ignore */ }
      if (came && !reduce) {
        wipeDelay = 650; w.style.transform = "none";
        // The JS overlay is now covering the page; drop the pre-paint CSS cover in the same frame, then slide out.
        const dropCover = () => document.documentElement.classList.remove("wipe-in");
        requestAnimationFrame(dropCover); setTimeout(dropCover, 100);
        setTimeout(() => w.animate([{ transform: "none" }, { transform: "translateY(-100%)" }], { duration: 700, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }), 120);
      } else {
        document.documentElement.classList.remove("wipe-in");
      }
      document.addEventListener("click", (e) => {
        const t = e.target as Element | null;
        const a = t && t.closest && (t.closest("a[href]") as HTMLAnchorElement | null);
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || a.target === "_blank") return;
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("/") || href.startsWith("//")) return;
        const url = new URL(href, location.href);
        if (url.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "")) return;
        if (reduce) return;
        e.preventDefault();
        try { sessionStorage.setItem("trikhya-wipe", "1"); } catch { /* ignore */ }
        let gone = false; const go = () => { if (!gone) { gone = true; location.href = url.href; } };
        w.animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 550, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }).finished.then(go, go);
        setTimeout(go, 800); // never leave the visitor stuck if the animation is throttled
      }, true);
      addEventListener("pageshow", (ev) => { if ((ev as PageTransitionEvent).persisted) w.getAnimations().forEach((a) => a.cancel()); });
    }
  };

  /* ---------- scan ---------- */
  const map: Record<string, string> = { word: "[data-word]", assemble: "[data-assemble]", wipe: "[data-wipe]", fill: "[data-fill]", parallax: "[data-parallax]", pin: "[data-pin]", htrack: "[data-htrack]", magnet: "[data-magnet]", spot: "[data-spot]", tilt: "[data-tilt]", sweep: "[data-sweep]", blueprint: "[data-blueprint]", flow: "[data-flow]", menu: "[data-menu]", hover: "[data-hover]", focus: "[data-focus]" };
  const scan = () => {
    if (!document.body) return;
    globals();
    for (const k in map) document.querySelectorAll<HTMLElement>(map[k]).forEach((el) => { if (fresh(el, k)) init[k](el); });
    document.querySelectorAll<HTMLElement>("a").forEach((a) => { if (ARROW.test(a.textContent || "") && fresh(a, "arrow")) init.arrow(a); });
    if (!brand || !brand.isConnected) { brand = document.querySelector<HTMLElement>("[data-brand]"); if (brand) { brand.style.transition = "transform .3s " + E; brand.style.transformOrigin = "left center"; } }
    req();
  };
  let pend = false;
  const mo = new MutationObserver(() => { if (!pend) { pend = true; requestAnimationFrame(() => { pend = false; scan(); }); } });
  scan();
  mo.observe(document.body, { childList: true, subtree: true });
}
