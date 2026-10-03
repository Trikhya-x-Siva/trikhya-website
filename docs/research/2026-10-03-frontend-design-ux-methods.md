# Frontend, design, UI and UX methods — research, October 2026

Compiled for the Trikhya website revamp. Two passes: frontend techniques (what the browser and our stack can do now) and design/UX methods (what credible sites do now). A shortlist of what fits Trikhya closes the document.

Legend for frontend items: **Ready** = broad support, use freely. **Progressive** = ship with a fallback. **Experimental** = one engine or behind a flag.

---

## Part A — Frontend techniques

### A1. CSS platform features

| Technique | What it is | Status | Reference |
| --- | --- | --- | --- |
| Scroll-driven animations (`animation-timeline: scroll()/view()`) | CSS animations driven by scroll or visibility, off the main thread | Progressive (Chrome, Safari 26; Firefox flagged) | webkit.org/blog/17101 |
| View Transitions, same document | Snapshot and cross-fade DOM changes | Ready | MDN View_Transition_API |
| View Transitions, cross document | Page-to-page transitions for multi-page sites | Progressive (no Firefox) | developer.chrome.com cross-document |
| Container queries | Component-relative breakpoints | Ready | MDN Container_queries |
| Style queries (`@container style(--x)`) | Branch on a custom property's value | Ready for custom-property form | MDN Container_queries |
| `:has()` | Parent and relational selector | Ready | MDN :has |
| Anchor positioning | CSS-only tooltips and menus tethered to a trigger | Progressive (Baseline 2026, uneven edges) | developer.chrome.com anchor-positioning-api |
| Popover API | Top-layer, light-dismiss overlays without JS | Ready | MDN Popover_API |
| `@starting-style` + `transition-behavior: allow-discrete` | Entry and exit transitions from `display: none` | Ready | web.dev baseline-entry-animations |
| `text-wrap: balance` / `pretty` | Balanced headlines, orphan control | Ready / Progressive | webkit.org/blog/16547 |
| `color-mix()` and `oklch()` | Perceptual colour and mixing | Ready | MDN color-mix |
| Scroll snap | Snap points for carousels and chapters | Ready | MDN CSS_scroll_snap |
| `field-sizing: content` | Auto-growing inputs | Progressive | web-features field-sizing |
| `light-dark()` | One declaration, both themes | Ready | MDN light-dark |
| `@property` | Typed, animatable custom properties (animated gradients, angles) | Ready | MDN @property |
| Masonry (`display: grid-lanes`) | Native masonry layout | Experimental (Safari only) | css-tricks grid-lanes |

### A2. Motion techniques

| Technique | What it is | Status | Reference |
| --- | --- | --- | --- |
| Scroll pinning and scrubbing (GSAP ScrollTrigger) | Pin a section and scrub a timeline to scroll | Ready | gsap.com ScrollTrigger |
| Motion `scroll()` / `useScroll` | Scroll-linked motion values, uses native ScrollTimeline where available | Ready | motion.dev use-scroll |
| Lenis smooth scroll | Inertial scroll synced to GSAP or Motion | Ready, off under reduced motion | github darkroomengineering/lenis |
| Text splitting and kinetic type (SplitText) | Per-word and per-character reveals; GSAP plugins free since April 2025, accessible | Ready | gsap.com/blog/3-13 |
| SVG morphing and path drawing | MorphSVG and DrawSVG, or CSS `stroke-dashoffset` | Ready | gsap.com MorphSVGPlugin |
| Shared-element page transitions | `view-transition-name` across routes; React `<ViewTransition>` wrapper | Native Ready, React wrapper Experimental | react.dev view-transitions |
| Magnetic and cursor-following elements | `gsap.quickTo()` on pointer move, pointer devices only | Ready | codepen GreenSock dyjywaZ |
| Custom cursors | DOM follower with blend modes, native cursor on touch | Ready | tympanus custom-cursor-effects |
| Spring physics | Motion springs, or CSS `linear()` easing baked from a spring | Ready | motion.dev transitions |
| FLIP layout animations | Motion `layout` / `layoutId`, GSAP Flip | Ready | motion.dev layout-animations |

### A3. 3D and graphics

| Technique | What it is | Status | Reference |
| --- | --- | --- | --- |
| Three.js + React Three Fiber v9 | React renderer for Three, React 19 ready | Ready | r3f.docs.pmnd.rs v9 |
| drei helpers | Environment, ScrollControls, MeshTransmissionMaterial, Float | Ready | drei.docs.pmnd.rs |
| WebGPU | Stable in all major browsers; Three auto-falls back to WebGL2 | Progressive | threejs.org webgpurenderer |
| Shader backgrounds | Noise and gradient fragment shaders; cap DPR, pause off-screen | Ready | maximeheckel TSL guide |
| Spline embeds | Designer-authored 3D scenes; heavy runtime, lazy-load | Ready with perf caveat | github splinetool/react-spline |
| Rive | WASM state-machine animations, idle at zero CPU | Ready | rive.app react |
| Lottie (dotLottie) | Compressed After Effects animations | Ready | developers.lottiefiles.com |
| CSS 3D transforms | `perspective`, `preserve-3d` for tilt and flip | Ready | MDN Using_CSS_transforms |
| Image-based lighting on a logo mesh | HDR environment, clearcoat or transmission material | Ready | drei Environment |

### A4. Rendering and performance

| Technique | What it is | Status | Reference |
| --- | --- | --- | --- |
| React Server Components | Zero client JS for static sections | Ready | react.dev server-components |
| Cache Components (`'use cache'`) | Next 16 successor to partial prerendering | Progressive | nextjs.org version-16 |
| Streaming with Suspense | HTML streams as sections resolve | Ready | nextjs.org |
| next/image and next/font | AVIF/WebP, blur placeholders, zero-CLS fonts | Ready | nextjs.org font |
| INP as a Core Web Vital | Keep interactions under 200 ms at p75 | Ready | web.dev inp |
| Speculation Rules | Prerender likely next pages | Progressive (Chromium) | developer.chrome.com prerender-pages |
| Static export vs ISR | CDN-only hosting, or revalidated pages for CMS content | Ready | nextjs.org ISR |

### A5. Component ecosystems

shadcn/ui registry protocol, Radix Primitives, Base UI 1.0 (stable Feb 2026), Aceternity UI, Magic UI, Motion Primitives, Tailwind v4.1 (CSS-first `@theme`, built-in container queries, `mask-*`, `text-shadow-*`). All Ready.

### A6. Accessibility and preferences

`prefers-reduced-motion` gating for parallax, autoplay, smooth scroll and pinning; `prefers-color-scheme` with `color-scheme` and `light-dark()`; `forced-colors` for Windows High Contrast; `:focus-visible`; keep UI motion under 500 ms, avoid large parallax and zoom, give WebGL a static fallback, keep split text readable to assistive tech. All Ready.

---

## Part B — Design, UI and UX methods

### B1. Visual trends

| Trend | Definition | Verdict in sources | Examples |
| --- | --- | --- | --- |
| Bento grids | Feature content in cards of varied sizes, 6 to 9 tiles | Held up; now the default feature pattern | apple.com, linear.app |
| Glassmorphism 2.0 | Translucent panels, backdrop blur, thin borders | Works as an accent (nav, modals), not a system | Apple Liquid Glass, Linear mobile |
| Neo-brutalism | Thick borders, hard shadows, monospace, broken grids | Cooling as a full style; survives as a bold CTA | v0.dev, The Browser Company |
| Kinetic and variable type | Text animated on scroll, hover or load | Decorative; use sparingly on heroes | linear.app hero |
| Oversized type | Headlines as the main visual | Strong for restrained brands | anthropic.com |
| Grain and noise | Film-grain overlays on gradients and surfaces | Reaction to sterile AI output | gezar.dk, Spotify |
| Gradient meshes, aurora | Drifting radial blobs, animated glow | Common, risks looking generic | stripe.com, linear.app |
| Dark mode first | Deep backgrounds, one vivid accent | Over 70% of AI sites; must have a token system | linear.app, vercel.com |
| Monochrome plus one accent, blueprint grid | Black, white, grey, hairline grid, one working colour | The "Vercel aesthetic" | vercel.com, stripe.com, resend.com |
| 3D and spatial | WebGL objects responding to input | Underdelivered; needs fallbacks | Nike, Apple |
| Editorial layouts | Print hierarchy, asymmetry, whitespace | Pairs well with grain and restraint | anthropic.com |
| Hand-drawn and organic | Doodles, sketch overlays | Pushback against machine polish | anthropic.com, huggingface.co |
| AI-slop backlash | Purple-to-blue gradients, 1 px grey borders on every card, Inter, three cards in a row | Actively avoided by credible AI sites | smoothui.dev/blog/ai-design-slop |

### B2. Interaction and motion principles

- Micro-interactions: streaming and thinking states, skeletons over spinners, optimistic updates, scroll-driven CSS, native View Transitions.
- Scrollytelling: scroll position drives narrative reveals; now possible in CSS alone.
- Progressive disclosure: defer rare content to secondary views.
- Skeleton and optimistic UI: the Doherty threshold (400 ms) matters more with AI responses.
- Motion as meaning: Material 3 Expressive (spring-based, tokenised motion; key elements found up to 4x faster in Google's studies) and Apple Liquid Glass (motion and material designed as one, auto-simplified under Reduce Motion).
- Reduced-motion ethics: scaling, panning, parallax and zoom are vestibular triggers; opacity, colour and border changes are safe.

### B3. UX methods and frameworks

- Nielsen Norman Group, State of UX 2026: AI fatigue replaces hype; trust is the design problem; differentiate by designing deeper.
- Jobs-to-be-done for page structure.
- Design tokens: W3C Design Tokens spec reached its first stable version on 28 October 2025, with theming, Oklch colour and aliases.
- Design systems with component libraries and automated tests are standard. Linear's 2026 refresh principle: structure should be felt, not seen.
- Accessibility as default: the European Accessibility Act has been enforceable since 28 June 2025; baseline WCAG 2.1 AA moving to 2.2 AA.
- B2B is desktop-first for conversion, with 68 to 86% of traffic on desktop, but mobile constraints still drive content priority.
- B2B conversion patterns: outcome headline under eight words, one primary call to action repeated, social proof in the first viewport, case studies with specific metrics outrank logos.
- AI-assisted design tools (Figma Make, v0, Lovable) speed drafts; half of surveyed designers have shipped AI-generated code.

### B4. Trust and credibility design for AI companies

- Show the real product: product UI or a live demo in the hero (Cohere, ElevenLabs, Perplexity).
- Measured claims: Anthropic praised for research citation and measured language over spectacle.
- Transparency about data and models: system cards and model cards; disclose proactively.
- Site anatomy: how it works, use cases by role, a security and trust page in the main nav, named customer results where allowed, a research or changelog feed, a founder-credible about page.
- Case-study anatomy: specific metric in the headline, quote with photo and title, structured evidence.
- Avoid: brain and robot imagery, default purple gradients, sparkle icons everywhere.

### B5. Example sites by trend

Bento: apple.com, linear.app. Glass: linear.app mobile, Arc. Neo-brutalism: v0.dev, thebrowser.company. Monochrome and blueprint grid: vercel.com, stripe.com, resend.com. Dark-first AI: runwayml.com, perplexity.ai. Editorial and restrained: anthropic.com, cohere.com. Trust-first AI B2B: harvey.ai, elevenlabs.io. Galleries: godly.website, awwwards.com, saaspo.com.

---

## Part C — What fits Trikhya

Chosen against the brief: credibility with prospects already in conversation, one real system in production, no client names, a geometric logo mark, a small team.

**Adopt**
1. Monochrome plus one accent with a blueprint hairline grid. The logo blue is the one colour. This is the credible technical look and it sidesteps the AI-slop list.
2. Oversized, editorial typography for headlines, with grain on dark surfaces so it does not read as a template.
3. Show the real product: the hero carries a sample question and sourced answer, not abstract art.
4. Scroll-driven storytelling for the pipeline: the stages light up and the retry loop draws as the reader scrolls, built on CSS scroll-driven animations with a GSAP ScrollTrigger fallback.
5. The logo as a lit 3D mesh in the hero with React Three Fiber, image-based lighting, slow idle rotation, pointer parallax, and a static SVG fallback for reduced motion and low-end devices.
6. Native View Transitions for card-to-detail navigation and the theme switch, with plain navigation as fallback.
7. Design tokens in the W3C format, exported to CSS variables, driving light and dark.
8. Bento layout for the Core and the capabilities around the agent, kept to six to nine tiles.
9. Micro-interactions with spring physics: magnetic buttons, FLIP filter chips, skeletons on the demo.
10. Accessibility as default: reduced-motion collapses everything, WCAG 2.2 AA, 44 px targets, focus-visible.

**Use sparingly**
- Kinetic type on the hero headline only. Glass only on the floating nav. Custom cursor only on desktop and only if it carries meaning, for example a "drag" cursor on the horizontal pipeline.

**Skip**
- Aurora and gradient-mesh backgrounds, neo-brutalism, Spline embeds, retro-futurism, horizontal full-page scrolling, personalisation.

**Build order that keeps the site fast**
- Server components for all static sections, client components only for motion. Lenis, Three.js and the dialog code-split and loaded on first interaction or when scrolled near. Static export stays, so GitHub Pages keeps working.
