import type { Metadata } from "next";
import { NlqSolutionPage } from "@/components/pages/NlqSolutionPage";

export const metadata: Metadata = {
  title: "Natural Language Query Assistant",
  description: "How we built a governed, read-only natural-language query assistant for a multi-plant manufacturer: the problem, the approach, the pipeline and the results.",
};

export default function Page() {
  return <NlqSolutionPage />;
}
