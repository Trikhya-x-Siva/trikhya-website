import type { Metadata } from "next";
import { INSIGHTS, bySlug } from "@/content/insights";
import { InsightArticlePage } from "@/components/pages/InsightArticlePage";

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = bySlug(slug);
  return { title: i?.title ?? "Insights", description: i?.dek };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <InsightArticlePage slug={slug} />;
}
