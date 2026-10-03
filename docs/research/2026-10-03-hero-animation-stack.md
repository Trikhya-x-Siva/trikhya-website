# Hero-section animation stack research (as of 2026-10-03)

Target: Next.js 16.3.8 (2026-09-30) / React 19.3.0 (2026-09-09) / Tailwind 4.3.3 (2026-07-16) on Vercel. Versions below were read from the npm registry on 2026-10-03 unless noted.

## 1. GSAP
- **gsap 3.15.0** (2026-04-13). 3.13 (2025-04-29) made the whole library free; 3.14 (2025-12-08) added MorphSVG `smooth`/`curveMode`; 3.15 added `easeReverse` (deprecates `yoyoEase`). https://gsap.com/blog/archive/ , https://gsap.com/blog/3-15/
- **All plugins are free** (ScrollTrigger, SplitText, DrawSVG, MorphSVG, ScrollSmoother). https://gsap.com/pricing/ (commercial licence fine print not re-verified.)
- **@gsap/react 2.1.2** (2025-01-15, peer react >=17). `useGSAP(cb, { scope, dependencies, revertOnUpdate })`, `contextSafe` for handlers, auto-reverts ScrollTriggers on unmount; needs `"use client"` and plugin registration at module scope. https://gsap.com/resources/React/
- **Pinned-scrub pattern for disassemble/reassemble**: `ScrollTrigger.create({ trigger: hero, pin: true, scrub: 1, start: "top top", end: "+=150%", anticipatePin: 1, invalidateOnRefresh: true })` driving a timeline that tweens each polygon group's `x/y/rotation/scale` (use `transformOrigin`, `svgOrigin`). Wrap in `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` branch. https://gsap.com/docs/v3/Plugins/ScrollTrigger/ , https://gsap.com/resources/a11y/
- ScrollSmoother (~26 KB) exists; Lenis is the smaller, more common choice.

## 2. Motion (motion.dev)
- **motion 14.0.0** (2026-10-02). 13.4.0 added `AnimateView` (React 19.3 View Transitions); 12.43 added hardware acceleration for SVG elements. https://github.com/motiondivision/motion/blob/main/CHANGELOG.md
- **Native ScrollTimeline is nuanced.** Changelog: 13.4.4 removed ScrollTimeline for JS callbacks; **13.5.0 (2026-10-01) "scroll/useScroll: use main thread for all offset animations."** Only simple viewport `scrollYProgress` to `opacity/transform` is likely GPU-driven. Verify in-browser.
- **layout/layoutId**: "SVG components aren't currently supported with layout animations" — logo-to-nav via `layoutId` must wrap the SVG in a `motion.div`. https://motion.dev/docs/react-layout-animations
- SVG: `pathLength/pathSpacing/pathOffset` line drawing; `d` morph only for same-structure paths. https://motion.dev/docs/react-svg-animation
- No pin/scrub primitive: pinning is `position: sticky` + tall wrapper + `useScroll({ target })`.

## 3. Native CSS scroll-driven animations
- `animation-timeline: scroll()/view()`: Chrome/Edge 115+, Safari 26+, Firefox 160+. ~87% global, not Baseline. https://caniuse.com/mdn-css_properties_animation-timeline
- Tailwind v4 core has no utilities for it; use arbitrary properties (`[animation-timeline:view()]`). `motion-safe:`/`motion-reduce:` variants exist.
- Good for parallax/fade on the logo; cannot do pinned choreography cleanly; needs a JS fallback.

## 4. Lenis
- **lenis 1.3.26** (2026-08-05), adds `respectReducedMotion`. React: `import { ReactLenis, useLenis } from 'lenis/react'`. https://lenis.dev/
- GSAP sync: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);`. `position: sticky` works.
- With Motion: works but avoid two RAF loops.

## 5. 3D options
- **@react-three/fiber 9.8.1**, **@react-three/drei 10.7.9**, **three 0.186.1**. Pipeline: `SVGLoader.parse` → `createShapes` → `ExtrudeGeometry`. `MeshTransmissionMaterial` costs an extra render pass; `Environment` adds an HDR download; `ScrollControls` conflicts with page scroll, drive camera from GSAP/Lenis instead.
- Cost: ~250–350 KB gzip client JS, `next/dynamic({ ssr:false })`. Worth it only if real lighting/depth is needed. Vercel's hero pattern (SVG + CSS first, shader fades in later, hardware-gated) is the model: https://rauno.me/craft/vercel
- Rive: @rive-app/react-canvas 4.36.0, ~100 KB wasm, scrubbable state machines. Spline: stale, heavy for a 3-polygon logo.

## 6. Kinetic typography
- GSAP SplitText (free): default `aria: "auto"`. https://gsap.com/docs/v3/Plugins/SplitText/
- Motion `splitText` is Motion+ paid-only; use manual word spans otherwise.
- `text-wrap: balance` is Baseline → Tailwind `text-balance`.

## 7. Notable landing pages
- **Vercel homepage**: six stacked layers (heading, SVG triangle, CSS grid, SVG rays, CSS gradient, GLSL shader); shader code-split and skipped on low-power devices. https://rauno.me/craft/vercel
- Vercel Ship 2024: regl particle shader with SVG letters shown until ready. https://basement.studio/post/shipping-ship-behind-the-particle-shader-effect-for-vercels-conf
- Resend: Three.js cube. Linear, Raycast, Clerk, Cursor: no documented technique found.

## 8. Performance and accessibility
- Inline `<svg>` is not an LCP candidate; the headline text will be LCP, so server-render it and do not hold it at `opacity:0` long. https://web.dev/articles/lcp
- INP ≤200 ms: scrub only transform/opacity, no per-frame React state, one RAF loop.
- CLS: explicit `width/height` or `aspect-ratio` on the SVG; `invalidateOnRefresh` on pins; reserve the nav-mark slot.
- Reduced motion: `gsap.matchMedia()`, `<MotionConfig reducedMotion="user">`, Lenis `respectReducedMotion`, Tailwind `motion-safe:`.

## Recommended stack for the Trikhya hero
1. **GSAP 3.15 + @gsap/react + ScrollTrigger (pin + scrub) + Lenis, 2D inline SVG, SplitText headline, `text-balance`.** Most control over choreography, all free, SSR-friendly, ~40 KB gzip. Trade-off: all scroll work on the main thread.
2. **Motion 14 only** (`useScroll` on a sticky hero, `layoutId` wrapper for logo-to-nav, `pathLength` reveal) + CSS `animation-timeline` for decorative parallax. One dependency, smaller. Trade-off: no pin/scrub primitive, SVG can't use `layout`, ScrollTimeline acceleration just changed.
3. **Option 1 + R3F extruded logo** loaded after first paint with SVG fallback. Premium depth. Trade-off: +250–350 KB, WebGL variability on mobile.

**Unverified:** `animation-trigger` browser list; `text-wrap: pretty` Firefox status; Motion ScrollTimeline behaviour after 13.5.0; Linear/Raycast/Clerk/Cursor techniques; GSAP commercial licence fine print.
