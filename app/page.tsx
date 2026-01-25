import { Hero } from "@/components/Hero";
import { TrikhyaCore } from "@/components/TrikhyaCore";
import { ForceMultiplier } from "@/components/ForceMultiplier";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-hidden selection:bg-electric-cobalt/30 relative">

      {/* Global Logo Background */}
      {/* Global Pattern Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <Hero />
      <TrikhyaCore />
      <ForceMultiplier />
      <Footer />

      {/* Global decorative gradients */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-electric-cobalt via-purple-500 to-molten-gold opacity-50 z-50 pointer-events-none" />
    </main>
  );
}
