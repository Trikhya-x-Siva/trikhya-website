"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { pillarTitle, type Solution } from "@/content/solutions";

export function SolutionCard({ solution: s, index = 0 }: { solution: Solution; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="col-span-full"
    >
      <Link
        href={`/solutions/${s.slug}`}
        className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 text-white transition-colors hover:bg-white/[0.07] sm:p-8"
      >
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.1em] text-cyan-400">
              <span>{pillarTitle(s.pillar)}</span>
              <span className="text-white/35">·</span>
              <span className="text-white/60">{s.status}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h2>
            <p className="text-base leading-relaxed text-white/65">{s.summary}</p>
            <ul className="flex flex-wrap gap-2 text-[13px]">
              {s.chips.map((c) => (
                <li key={c} className="rounded-full border border-white/[0.12] px-3 py-1.5 text-white/80">{c}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-black/35 p-6">
            <div className="flex flex-col gap-1">
              <span className="text-5xl font-bold leading-none tracking-tighter">{s.metric.value}</span>
              <span className="text-[13px] text-white/60">{s.metric.label}</span>
            </div>
            <dl className="flex flex-col gap-2.5 border-t border-white/[0.08] pt-3.5 text-sm text-white/75">
              {s.facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4">
                  <dt className="text-white/50">{f.label}</dt>
                  <dd className="text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-[15px] font-semibold text-electric-cobalt">
          <span>View how it was built</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </div>
      </Link>
    </motion.div>
  );
}
