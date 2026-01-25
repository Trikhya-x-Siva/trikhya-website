import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ComingSoon() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden text-center selection:bg-electric-cobalt/30">

            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-cobalt/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />
            <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 max-w-2xl px-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
                    Coming <span className="text-electric-cobalt">Soon</span>
                </h1>

                <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
                    The Foundry is currently forging new intelligence. <br />
                    Check back later for specialized workflows and generalist accelerators.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-electric-cobalt hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Return to Base
                </Link>
            </div>

        </main>
    );
}
