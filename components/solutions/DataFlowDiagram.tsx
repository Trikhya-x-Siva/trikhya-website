"use client";

import { Arrows, DiagramHost, ICE, Label, Node, type ArrowSpec, type NodeSpec } from "./Diagram";

const W = 1084, H = 460;

const nodes: NodeSpec[] = [
  { x: 32, y: 60, w: 140, h: 72, title: "ERP", sub: "commercial, finance" },
  { x: 32, y: 156, w: 140, h: 72, title: "Warehouse system", sub: "BOM, jobcards, material" },
  { x: 32, y: 252, w: 140, h: 72, title: "Order management", sub: "output, QC, dispatch" },
  { x: 252, y: 160, w: 140, h: 64, title: "Hourly ingest", sub: "incremental loads" },
  { x: 472, y: 152, w: 140, h: 80, title: "Governed warehouse", sub: "bronze → silver → gold → reference" },
  { x: 692, y: 160, w: 140, h: 64, title: "Query assistant", tone: "brand" },
  { x: 912, y: 60, w: 140, h: 72, title: "Web app", sub: "chat, role dashboards" },
  { x: 912, y: 156, w: 140, h: 72, title: "WhatsApp alerts", sub: "acknowledge, resolve" },
  { x: 912, y: 252, w: 140, h: 72, title: "Voice", sub: "Tamil, Hindi, English" },
  { x: 252, y: 352, w: 200, h: 80, title: "Control-plane DB", sub: "catalogue, glossary, join registry, examples, users, feedback", tone: "ice" },
  { x: 692, y: 352, w: 140, h: 80, title: "Tracing & evaluation", sub: "every answer rated", tone: "exit" },
];

const arrows: ArrowSpec[] = [
  { pts: [[172, 96], [212, 96]] }, { pts: [[172, 192], [212, 192]] }, { pts: [[172, 288], [212, 288]] }, { pts: [[212, 96], [212, 288]] }, { pts: [[212, 192], [252, 192]], head: true },
  { pts: [[392, 192], [472, 192]], head: true }, { pts: [[612, 192], [692, 192]], head: true },
  { pts: [[832, 192], [872, 192]] }, { pts: [[872, 96], [872, 288]] }, { pts: [[872, 96], [912, 96]], head: true }, { pts: [[872, 192], [912, 192]], head: true }, { pts: [[872, 288], [912, 288]], head: true },
  { pts: [[452, 392], [520, 392], [520, 300], [739, 300], [739, 224]], head: true, color: ICE },
  { pts: [[785, 224], [785, 352]], head: true, dashed: true },
];

export function DataFlowDiagram() {
  return (
    <DiagramHost width={W} height={H}>
      <Arrows width={W} height={H} arrows={arrows} />
      {nodes.map((n) => <Node key={n.title} {...n} />)}
      <Label x={615} y={164} w={72} text="read-only" />
      <Label x={540} y={272} w={230} text="catalogue · glossary · joins · examples" color={ICE} />
      <Label x={797} y={300} w={128} text="traces & ratings" align="left" />
    </DiagramHost>
  );
}
