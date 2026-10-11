"use client";

import { Arrows, DiagramHost, ICE, Label, Node, SKY, type ArrowSpec, type NodeSpec } from "./Diagram";

const W = 1140, H = 500;

const nodes: NodeSpec[] = [
  { x: 262, y: 80, w: 150, h: 64, title: "Avatar video", sub: "four languages" },
  { x: 460, y: 80, w: 150, h: 64, title: "Watch", sub: "language locked" },
  { x: 658, y: 80, w: 150, h: 64, title: "Mid-module quiz", sub: "five questions" },
  { x: 856, y: 80, w: 150, h: 64, title: "Course exam", sub: "70% to pass, timed" },
  { x: 64, y: 240, w: 150, h: 64, title: "Speech in & out", sub: "Indian-language STT / TTS" },
  { x: 262, y: 240, w: 150, h: 64, title: "Course script", sub: "one file per course", tone: "ice" },
  { x: 460, y: 240, w: 150, h: 64, title: "Ask the module", sub: "answers only from the script", tone: "brand" },
  { x: 856, y: 240, w: 150, h: 64, title: "Certificate & badge", sub: "PDF, points, record", tone: "ice" },
  { x: 262, y: 400, w: 150, h: 64, title: "Generate questions", sub: "twenty from the script", tone: "brand" },
  { x: 460, y: 400, w: 150, h: 64, title: "Refine in chat", sub: "admin edits, trims" },
  { x: 658, y: 400, w: 150, h: 64, title: "Publish exam", sub: "pass mark, time limit" },
  { x: 856, y: 400, w: 150, h: 64, title: "Compliance dashboard", sub: "passed, overdue, pending", tone: "exit" },
];

const arrows: ArrowSpec[] = [
  { pts: [[337, 240], [337, 144]], head: true, color: ICE },
  { pts: [[412, 272], [460, 272]], head: true, color: ICE },
  { pts: [[337, 304], [337, 400]], head: true, color: ICE },
  { pts: [[412, 112], [460, 112]], head: true }, { pts: [[610, 112], [658, 112]], head: true }, { pts: [[808, 112], [856, 112]], head: true },
  { pts: [[535, 144], [535, 240]], head: true, dashed: true },
  { pts: [[139, 304], [139, 352], [535, 352], [535, 304]], head: true },
  { pts: [[931, 144], [931, 240]], head: true },
  { pts: [[931, 304], [931, 400]], head: true, dashed: true },
  { pts: [[412, 432], [460, 432]], head: true }, { pts: [[610, 432], [658, 432]], head: true },
  { pts: [[808, 432], [1054, 432], [1054, 112], [1006, 112]], head: true, color: SKY, dashed: true },
];

export function TrainingDiagram() {
  return (
    <DiagramHost width={W} height={H}>
      <Arrows width={W} height={H} arrows={arrows} />
      {nodes.map((n) => <Node key={n.title} {...n} />)}
      <Label x={545} y={184} w={120} text="ask while watching" align="left" />
      <Label x={160} y={356} w={300} text="voice: transcribe · answer · speak back" align="left" />
      <Label x={1062} y={260} w={78} text="published exam" color={SKY} align="left" />
      <Label x={64} y={424} w={150} text="ADMIN SIDE →" align="left" />
    </DiagramHost>
  );
}
