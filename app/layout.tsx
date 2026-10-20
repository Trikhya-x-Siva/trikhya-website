import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MotionRoot } from "@/components/site/MotionRoot";
import { CookieBanner } from "@/components/site/CookieBanner";
import { withBase } from "@/lib/paths";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const DESCRIPTION = "Where AI ambition becomes working machinery. We design and engineer AI with people at both ends.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  icons: { icon: withBase("/trikhya-mark.png") },
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_NAME, description: DESCRIPTION, url: SITE_URL, locale: "en_IN", images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }] },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: DESCRIPTION, images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The Content-Security-Policy and the other security headers are sent by the host; see vercel.json. */}
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
