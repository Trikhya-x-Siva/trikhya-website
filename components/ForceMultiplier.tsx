"use client";

import { motion } from "framer-motion";

export function ForceMultiplier() {
    return (
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-cobalt/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tighter">The Force Multiplier Effect</h2>
                    <p className="text-white/60 mb-20 text-xl font-light">Accelerate your output exponentially.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        <div className="flex flex-col items-center">
                            <div className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 animate-pulse tracking-tighter">
                                10x
                            </div>
                            <div className="text-base text-cyan-400 font-bold tracking-widest uppercase">Efficiency</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 tracking-tighter">
                                24/7
                            </div>
                            <div className="text-base text-cyan-400 font-bold tracking-widest uppercase">Operations</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 tracking-tighter">
                                3-Way
                            </div>
                            <div className="text-base text-cyan-400 font-bold tracking-widest uppercase">Interaction</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
