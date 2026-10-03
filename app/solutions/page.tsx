import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SolutionCard } from "@/components/solutions/SolutionCard";
import { pillars, solutions } from "@/content/solutions";

export const metadata: Metadata = {
  title: "Solutions · Trikhya Intelligence Foundry",
  description: "Systems we have built and run with real users. See how each was built, how its pipeline works, and how the data flows.",
};

export default function SolutionsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white selection:bg-electric-cobalt/30">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #333 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-12 pt-32 sm:px-6 md:pt-36 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex gap-2.5 text-[13px] text-white/50">
          <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Solutions</span>
        </nav>
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tighter sm:text-5xl lg:text-6xl">Solutions forged in the Foundry</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
          Systems we have built and run with real users. Open one to see how it was built, how the pipeline works, and how the data flows.
        </p>
      </section>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 pb-32 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter by pillar">
          <span className="rounded-full border border-electric-cobalt bg-electric-cobalt px-4 py-2.5 text-sm text-white">All</span>
          {pillars.map((p) => (
            <span key={p.id} className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/80">{p.title}</span>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6">
          {solutions.map((s, i) => <SolutionCard key={s.slug} solution={s} index={i} />)}
        </div>
      </section>

      <Footer />
    </main>
  );
}
