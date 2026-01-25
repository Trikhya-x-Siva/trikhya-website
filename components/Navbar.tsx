"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        >
            <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/5 hover:bg-white/10 transition-colors">
                <Link href="/" className="flex items-center">
                    {/* Logo from public/logo.jpg */}
                    <div className="relative h-12 w-auto aspect-[3/1] min-w-[120px]">
                        <Image
                            src="/logo.jpg"
                            alt="Trikhya Intelligence Foundry"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>
            </div>
        </motion.nav>
    );
}
