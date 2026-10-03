"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
    { href: "/#core", label: "Core" },
    { href: "/solutions", label: "Solutions" },
    { href: "/coming-soon", label: "About" },
];

function isActive(pathname: string, href: string) {
    if (href.includes("#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center gap-2 pt-4 px-4 pointer-events-none sm:pt-6"
        >
            <div className="pointer-events-auto flex w-full max-w-fit items-center gap-3 pl-4 pr-2 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/5 sm:gap-6">
                <Link href="/" className="flex items-center gap-2.5 text-white">
                    <Image src="/logo.svg" alt="" width={28} height={28} priority />
                    <span className="text-[15px] font-semibold tracking-tight">Trikhya Intelligence Foundry</span>
                </Link>
                <div className="hidden items-center gap-5 text-sm md:flex">
                    {links.map((l) => (
                        <Link key={l.href} href={l.href} className={`pb-0.5 transition-colors ${isActive(pathname, l.href) ? "text-white border-b-2 border-electric-cobalt" : "text-white/70 hover:text-white"}`}>
                            {l.label}
                        </Link>
                    ))}
                    <a href="mailto:[EMAIL]" className="rounded-full bg-electric-cobalt px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600">Talk to us</a>
                </div>
                <button
                    type="button"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
                >
                    {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                </button>
            </div>

            <AnimatePresence>
                {open ? (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto flex w-full max-w-sm flex-col gap-1 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-3 backdrop-blur-xl md:hidden"
                    >
                        {links.map((l) => (
                            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`flex h-12 items-center rounded-xl px-4 text-base ${isActive(pathname, l.href) ? "bg-white/10 text-white" : "text-white/80"}`}>
                                {l.label}
                            </Link>
                        ))}
                        <a href="mailto:[EMAIL]" className="mt-1 flex h-12 items-center justify-center rounded-xl bg-electric-cobalt px-4 font-semibold text-white">Talk to us</a>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </motion.nav>
    );
}
