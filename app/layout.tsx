import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MotionRoot } from "@/components/site/MotionRoot";
import { CookieBanner } from "@/components/site/CookieBanner";
import { withBase } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Trikhya Intelligence Foundry", template: "%s · Trikhya Intelligence Foundry" },
  description: "Where AI ambition becomes working machinery. We design and engineer AI with people at both ends.",
  icons: { icon: withBase("/trikhya-mark.png") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; object-src 'self' blob: https://*.supabase.co; frame-src 'self' blob: https://*.supabase.co; base-uri 'self'; form-action 'self' mailto:" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Start covered when arriving via the page wipe, before anything paints. The motion engine takes over and slides the cover away. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem('trikhya-wipe')==='1'){document.documentElement.classList.add('wipe-in');document.documentElement.style.setProperty('--wipe-mark','url(${withBase("/trikhya-mark-white.png")})')}}catch(e){}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <MotionRoot />
        <CookieBanner />
      </body>
    </html>
  );
}
