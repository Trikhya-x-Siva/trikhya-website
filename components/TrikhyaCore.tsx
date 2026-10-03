"use client";

import { motion } from "framer-motion";
import { Zap, Workflow, Brain } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
    {
        title: "Generalist AI Accelerators",
        description: "Speed up core business processes with adaptable, high-speed intelligence designed for broad applicability. Our accelerators integrate seamlessly into your existing stack.",
        icon: Zap,
        className: "md:col-span-2 md:row-span-2 h-full min-h-[400px] flex flex-col justify-center",
        align: "center" as const,
    },
    {
        title: "Specialized AI Workflows",
        description: "End-to-end automation pipelines custom-built for complex, multi-step operations in your specific stack.",
        icon: Workflow,
        className: "md:col-span-1 h-full",
    },
    {
        title: "Domain Adapted Intelligence",
        description: "Fine-tuned models that understand the nuance, jargon, and specific constraints of your industry.",
        icon: Brain,
        className: "md:col-span-1 h-full",
    },
];

export function TrikhyaCore() {
    return (
        <section id="core" className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">The Trikhya Core</h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        Three pillars of intelligence designed to transform your operational capacity.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={feature.className}
                        >
                            <FeatureCard {...feature} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
