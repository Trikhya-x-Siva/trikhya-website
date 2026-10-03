"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { withBase } from "@/lib/paths";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-600/10 blur-[100px] animate-pulse" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-amber-500/5 via-purple-600/10 to-cyan-600/10 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col justify-center items-start h-full"
                >
                    {/* Logo mark + wordmark */}
                    <div className="relative w-full max-w-2xl flex flex-col items-start gap-10">
                        <div className="relative w-56 sm:w-72 lg:w-80 aspect-square">
                            <Image
                                src={withBase("/logo.svg")}
                                alt="Trikhya Intelligence Foundry"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <div className="pl-4 border-l-2 border-electric-cobalt backdrop-blur-sm bg-black/20 p-4 rounded-r-xl">
                            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                                Trikhya Intelligence Foundry
                            </h3>
                            <p className="text-electric-cobalt font-mono text-sm tracking-[0.15em] uppercase">
                                Unlocking Vision. Engineering Reality.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Content (Headline + CTA) */}
                <div className="text-left flex flex-col items-start">

                    <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                    >
                        Force Multiply Your <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600">
                            Business with AI
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed"
                    >
                        The Foundry for <span className="text-white">Generalist Accelerators</span>, <span className="text-white">Specialized Workflows</span>, and <span className="text-white">Domain-Adapted Intelligence</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
                    >
                        <Link href="/coming-soon" className="group relative px-8 py-4 bg-electric-cobalt hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center gap-2">
                            Enter the Foundry
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link href="/solutions" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm">
                            View Solutions
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
