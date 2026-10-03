"use client";

import { useEffect, useState, type RefObject } from "react";
import { reducedMotion } from "./motion-engine";

/** Per-page behaviours from the design's page logic: reveal-on-scroll with
 *  sibling stagger, slow-spinning marks, the ticker marquee, count-ups and the
 *  scroll-drawn line. Mirrors componentDidMount in the exported pages. */
export function usePageMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = reducedMotion();
    const cleanups: (() => void)[] = [];

    const onScroll = () => {
      const line = root.querySelector<HTMLElement>("[data-line]");
      if (line && line.parentElement) {
        const r = line.parentElement.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / (r.height + window.innerHeight * 0.3)));
        line.style.transform = `scaleX(${p})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    if (reduce) {
      const io0 = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        io0.unobserve(e.target);
        (e.target as HTMLElement).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: "ease-out", fill: "backwards" });
      }), { threshold: 0.15 });
      root.querySelectorAll("[data-reveal]").forEach((el) => io0.observe(el));
      cleanups.push(() => io0.disconnect());
      return () => cleanups.forEach((c) => c());
    }

    root.querySelectorAll<HTMLElement>("[data-spin]").forEach((el) => {
      const d = Number(el.dataset.spin);
      el.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${360 * d}deg)` }], { duration: d > 0 ? 90000 : 60000, iterations: Infinity });
    });
    const tk = root.querySelector<HTMLElement>("[data-ticker]");
    if (tk) tk.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], { duration: 40000, iterations: Infinity });

    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target as HTMLElement;
      const sibs = [...(el.parentElement?.children ?? [])].filter((c) => c.hasAttribute("data-reveal"));
      const idx = Math.max(0, sibs.indexOf(el));
      el.animate([{ opacity: 0, transform: "translateY(36px)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: idx * 90, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => {
        const end = Number(c.dataset.count), t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / 1400);
          c.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }), { threshold: 0.15 });
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    return () => cleanups.forEach((c) => c());
  }, [rootRef]);
}

/** The typing demo in the analytics card: types the question, then reveals the answer. */
export function useTyped(q: string) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((s) => (s >= q.length + 150 ? 0 : s + 1)), 45);
    return () => clearInterval(id);
  }, [q]);
  const show = t > q.length + 18;
  return { typed: q.slice(0, Math.min(t, q.length)), ansOpacity: show ? 1 : 0, ansShift: show ? 0 : 12 };
}
