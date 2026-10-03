import type { Metadata } from "next";
import { InsightsPage } from "@/components/pages/InsightsPage";

export const metadata: Metadata = { title: "Insights" };

export default function Page() {
  return <InsightsPage />;
}
