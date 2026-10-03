"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/#core", label: "Core" },
    { href: "/solutions", label: "Solutions" },
    { href: "/coming-soon", label: "About" },
];

export function Navbar() {
    const pathname = usePathname();
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        >
            <div className="pointer-events-auto flex items-center gap-6 pl-4 pr-2 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                <Link href="/" className="flex items-center gap-2.5 text-white">
                    <Image src="/logo.svg" alt="" width={28} height={28} priority />
                    <span className="text-[15px] font-semibold tracking-tight">Trikhya Intelligence Foundry</span>
                </Link>
                <div className="hidden items-center gap-5 text-sm md:flex">
                    {links.map((l) => {
                        const active = pathname === l.href || (l.href !== "/" && l.href.startsWith("/") && !l.href.includes("#") && pathname.startsWith(l.href));
                        return (
                            <Link key={l.href} href={l.href} className={`pb-0.5 transition-colors ${active ? "text-white border-b-2 border-electric-cobalt" : "text-white/70 hover:text-white"}`}>
                                {l.label}
                            </Link>
                        );
                    })}
                    <a href="mailto:[EMAIL]" className="rounded-full bg-electric-cobalt px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600">Talk to us</a>
                </div>
            </div>
        </motion.nav>
    );
}
