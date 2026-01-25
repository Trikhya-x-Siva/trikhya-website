"use client";

import { LucideIcon } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    className?: string;
    align?: "left" | "center";
}

export function FeatureCard({ title, description, icon: Icon, className = "", align = "left" }: FeatureCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group relative rounded-2xl border border-white/10 bg-white/5 px-8 py-10 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            {/* Content */}
            {/* Content */}
            <div className={`relative z-10 flex flex-col h-full ${align === "center" ? "items-center text-center justify-center" : "items-start text-left"}`}>
                {/* Large Background Glyph */}
                <div className="absolute -right-4 -top-4 text-white/5 transform scale-[2.5] rotate-12 pointer-events-none transition-transform duration-500 group-hover:rotate-0">
                    <Icon strokeWidth={1} />
                </div>

                <div className={`mb-6 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 w-fit ${align === "center" ? "mx-auto" : ""}`}>
                    <Icon className="w-6 h-6 text-cyan-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 font-sans tracking-tight">
                    {title}
                </h3>

                <p className={`text-white/60 leading-relaxed text-sm ${align === "center" ? "max-w-lg mx-auto" : "flex-grow"}`}>
                    {description}
                </p>
            </div>
        </div>
    );
}
