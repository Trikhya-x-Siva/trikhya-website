import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MotionRoot } from "@/components/site/MotionRoot";
import { withBase } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Trikhya Intelligence Foundry", template: "%s · Trikhya Intelligence Foundry" },
  description: "Where AI ambition becomes working machinery. We design and engineer AI with people at both ends.",
  icons: { icon: withBase("/trikhya-mark.png") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <MotionRoot />
      </body>
    </html>
  );
}
