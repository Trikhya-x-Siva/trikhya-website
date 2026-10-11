import type { Metadata } from "next";
import { HIRING } from "@/content/hiring";
import { SolutionPage } from "@/components/pages/SolutionPage";
import { ScreenerDemo } from "@/components/solutions/FeaturedSolution";
import { HiringDiagram } from "@/components/solutions/HiringDiagram";

export const metadata: Metadata = {
  title: HIRING.title,
  description: "How we built an AI hiring screener that reads resume PDFs, scores candidates against declared criteria with fixed weights, explains every result, and runs the first-round phone interview in the candidate’s language.",
};

export default function Page() {
  return <SolutionPage s={HIRING} demo={<ScreenerDemo minHeight={320} />} pipelineDiagram={<HiringDiagram />} />;
}
