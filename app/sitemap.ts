import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/content/insights";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const PAGES: [string, number][] = [["/", 1], ["/services/", 0.9], ["/solutions/", 0.9], ["/solutions/natural-language-query/", 0.8], ["/solutions/ai-training/", 0.8], ["/solutions/ai-hiring/", 0.8], ["/about/", 0.7], ["/insights/", 0.7], ["/careers/", 0.6], ["/contact/", 0.8], ["/privacy/", 0.2], ["/terms/", 0.2]];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...PAGES.map(([p, priority]) => ({ url: `${SITE_URL}${p}`, lastModified: now, priority })),
    ...INSIGHTS.map((i) => ({ url: `${SITE_URL}/insights/${i.slug}/`, lastModified: now, priority: 0.6 })),
  ];
}
