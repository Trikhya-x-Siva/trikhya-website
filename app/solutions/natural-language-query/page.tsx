import type { Metadata } from "next";
import { NLQ } from "@/content/nlq";
import { SolutionPage } from "@/components/pages/SolutionPage";
import { QueryDemo } from "@/components/solutions/FeaturedSolution";
import { PipelineDiagram } from "@/components/solutions/PipelineDiagram";
import { DataFlowDiagram } from "@/components/solutions/DataFlowDiagram";

export const metadata: Metadata = {
  title: NLQ.title,
  description: "How we built a governed, read-only natural-language query assistant for a multi-plant manufacturer: the problem, the approach, the pipeline and the results.",
};

export default function Page() {
  return <SolutionPage s={NLQ} demo={<QueryDemo minHeight={320} />} pipelineDiagram={<PipelineDiagram />} dataDiagram={<DataFlowDiagram />} />;
}
