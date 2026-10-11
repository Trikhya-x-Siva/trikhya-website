import type { Metadata } from "next";
import { TRAINING } from "@/content/training";
import { SolutionPage } from "@/components/pages/SolutionPage";
import { TrainingDemo } from "@/components/solutions/FeaturedSolution";
import { TrainingDiagram } from "@/components/solutions/TrainingDiagram";

export const metadata: Metadata = {
  title: TRAINING.title,
  description: "How we built a multilingual AI induction training platform for a multi-plant manufacturer: avatar video, a script-grounded assistant, quizzes, exams and certificates.",
};

export default function Page() {
  return <SolutionPage s={TRAINING} demo={<TrainingDemo minHeight={320} />} pipelineDiagram={<TrainingDiagram />} />;
}
