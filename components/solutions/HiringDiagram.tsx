"use client";

import { Arrows, DiagramHost, ICE, Label, Node, SKY, type ArrowSpec, type NodeSpec } from "./Diagram";

const W = 1140, H = 560;

const nodes: NodeSpec[] = [
  { x: 64, y: 80, w: 150, h: 64, title: "Job description", sub: "criteria as fields", tone: "ice" },
  { x: 262, y: 80, w: 150, h: 64, title: "Resume batch", sub: "up to 25 PDFs" },
  { x: 460, y: 80, w: 150, h: 64, title: "Read the PDF", sub: "model → structured profile", tone: "brand" },
  { x: 658, y: 80, w: 150, h: 64, title: "Hard filter", sub: "must-haves, education, years, languages" },
  { x: 856, y: 80, w: 150, h: 64, title: "Weighted score", sub: "0–100, fixed weights" },
  { x: 262, y: 240, w: 150, h: 64, title: "Shortlist / reject", sub: "recruiter’s call, on record" },
  { x: 460, y: 240, w: 150, h: 64, title: "Recruiter review", sub: "profile beside the PDF", tone: "ice" },
  { x: 658, y: 240, w: 150, h: 64, title: "Fails", sub: "shown, not hidden", tone: "exit" },
  { x: 856, y: 240, w: 150, h: 64, title: "Explain", sub: "3 strengths, 3 gaps", tone: "brand" },
  { x: 64, y: 400, w: 150, h: 64, title: "Queue & dial", sub: "one live call per candidate" },
  { x: 262, y: 400, w: 150, h: 64, title: "Phone call", sub: "speech in, speech out" },
  { x: 460, y: 400, w: 150, h: 64, title: "Interviewer model", sub: "holds the job brief", tone: "brand" },
  { x: 658, y: 400, w: 150, h: 64, title: "Transcript", sub: "every turn, timestamped" },
  { x: 856, y: 400, w: 150, h: 64, title: "Summary & score", sub: "written from the transcript", tone: "brand" },
];

const arrows: ArrowSpec[] = [
  { pts: [[214, 112], [262, 112]], head: true },
  { pts: [[139, 144], [139, 192], [733, 192], [733, 144]], head: true, color: ICE },
  { pts: [[412, 112], [460, 112]], head: true }, { pts: [[610, 112], [658, 112]], head: true }, { pts: [[808, 112], [856, 112]], head: true },
  { pts: [[733, 144], [733, 240]], head: true, dashed: true },
  { pts: [[931, 144], [931, 240]], head: true },
  { pts: [[931, 304], [931, 352], [535, 352], [535, 304]], head: true, color: SKY },
  { pts: [[658, 272], [610, 272]], head: true, dashed: true },
  { pts: [[460, 272], [412, 272]], head: true },
  { pts: [[337, 304], [337, 368], [139, 368], [139, 400]], head: true },
  { pts: [[214, 432], [262, 432]], head: true },
  { pts: [[412, 420], [460, 420]], head: true }, { pts: [[460, 444], [412, 444]], head: true },
  { pts: [[610, 432], [658, 432]], head: true }, { pts: [[808, 432], [856, 432]], head: true },
  { pts: [[931, 464], [931, 500], [535, 500]], head: false, color: SKY },
];

export function HiringDiagram() {
  return (
    <DiagramHost width={W} height={H}>
      <Arrows width={W} height={H} arrows={arrows} />
      {nodes.map((n) => <Node key={n.title} {...n} />)}
      <Label x={300} y={172} w={300} text="criteria drive the filter and the weights" color={ICE} align="left" />
      <Label x={560} y={358} w={340} text="score + breakdown + rationale, per candidate" color={SKY} align="left" />
      <Label x={150} y={374} w={260} text="shortlisted → first-round call" align="left" />
      <Label x={380} y={470} w={300} text="turn by turn · candidate’s language" align="left" />
      <Label x={545} y={506} w={520} text="transcript + summary + score on the same candidate record" color={SKY} align="left" />
    </DiagramHost>
  );
}
