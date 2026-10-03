"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { pillarTitle, type Solution } from "@/content/solutions";
import { DataFlowDiagram } from "./DataFlowDiagram";
import { DemoVideo } from "./DemoVideo";
import { PipelineDiagram } from "./PipelineDiagram";

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="text-xs uppercase tracking-[0.1em] text-cyan-400">{children}</span>;
}

const section = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

export function SolutionDetail({ solution: s }: { solution: Solution }) {
  return (
    <article className="relative z-10 text-white">
      <section className={`${section} flex flex-col gap-6 pb-14 pt-32 md:pt-36`}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2.5 text-[13px] text-white/50">
          <Link href="/" className="hover:text-white">Home</Link><span>/</span>
          <Link href="/solutions" className="hover:text-white">Solutions</Link><span>/</span>
          <span className="text-white">{s.title}</span>
        </nav>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.1em] text-cyan-400">
          <span>{pillarTitle(s.pillar)}</span><span className="text-white/35">·</span><span className="text-white/60">{s.status}</span>
        </div>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-tighter sm:text-5xl lg:text-6xl">{s.title}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-white/65 sm:text-xl">{s.pitch}</p>
        <dl className="grid grid-cols-2 gap-5 border-t border-white/10 pt-6 lg:grid-cols-4">
          {s.stats.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <dd className="text-4xl font-bold leading-none tracking-tighter">{m.value}</dd>
              <dt className="text-[13px] text-white/60">{m.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${section} grid gap-8 py-10 md:grid-cols-2`}>
        <Reveal className="flex flex-col gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-7">
          <Eyebrow>The problem</Eyebrow>
          <p className="leading-relaxed text-white/75">{s.problem}</p>
        </Reveal>
        <Reveal className="flex flex-col gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-7">
          <Eyebrow>What we built</Eyebrow>
          <p className="leading-relaxed text-white/75">{s.built}</p>
        </Reveal>
      </section>

      <section className={`${section} flex flex-col gap-7 pb-10 pt-16`}>
        <Reveal className="flex flex-col gap-3">
          <Eyebrow>Pipeline</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How a question becomes an answer</h2>
          <p className="max-w-3xl leading-relaxed text-white/65">{s.pipelineIntro}</p>
        </Reveal>
        <Reveal><PipelineDiagram /></Reveal>
      </section>

      <section className={`${section} flex flex-col gap-7 pb-10 pt-16`}>
        <Reveal className="flex flex-col gap-3">
          <Eyebrow>Data workflow</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Where the data comes from and where answers go</h2>
          <p className="max-w-3xl leading-relaxed text-white/65">{s.dataIntro}</p>
        </Reveal>
        <Reveal><DataFlowDiagram /></Reveal>
      </section>

      <section className={`${section} flex flex-col gap-7 pb-10 pt-16`}>
        <Reveal className="flex flex-col gap-3">
          <Eyebrow>Beyond the query agent</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What else we built around it</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.around.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-[15px] leading-relaxed text-white/65">{a.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={`${section} flex flex-col gap-4 pb-10 pt-14`}>
        <Eyebrow>Built with</Eyebrow>
        <ul className="flex flex-wrap gap-2.5 text-sm">
          {s.stack.map((t) => <li key={t} className="rounded-full border border-white/[0.14] px-3.5 py-2 text-white/85">{t}</li>)}
        </ul>
      </section>

      <section id="demo" className={`${section} flex flex-col gap-7 pb-24 pt-16`}>
        <Reveal className="flex flex-col gap-3">
          <Eyebrow>Demo</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Watch it answer a real question</h2>
          <p className="max-w-3xl leading-relaxed text-white/65">{s.demo.intro}</p>
        </Reveal>
        <Reveal><DemoVideo src={s.demo.videoUrl} poster={s.demo.poster} /></Reveal>
        <div className="flex flex-wrap gap-3.5">
          <a href="mailto:[EMAIL]" className="rounded-[10px] bg-electric-cobalt px-7 py-4 font-semibold text-white transition-colors hover:bg-blue-600">Talk to us about your data</a>
          <Link href="/solutions" className="rounded-[10px] border border-white/15 bg-white/5 px-7 py-4 text-white transition-colors hover:bg-white/10">All solutions</Link>
        </div>
      </section>
    </article>
  );
}
