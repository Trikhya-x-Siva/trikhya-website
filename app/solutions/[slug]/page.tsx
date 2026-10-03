import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { SolutionDetail } from "@/components/solutions/SolutionDetail";
import { getSolution, solutions } from "@/content/solutions";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSolution((await params).slug);
  return s ? { title: `${s.title} · Trikhya Intelligence Foundry`, description: s.pitch } : {};
}

export default async function SolutionPage({ params }: Props) {
  const s = getSolution((await params).slug);
  if (!s) notFound();
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] selection:bg-electric-cobalt/30">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #333 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <SolutionDetail solution={s} />
      <Footer />
    </main>
  );
}
