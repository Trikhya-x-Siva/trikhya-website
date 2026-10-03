import { Arrows, DiagramHost, Label, Node, type ArrowSpec, type NodeSpec } from "./Diagram";

const W = 1140, H = 544;
const BLUE = "#3b82f6", CYAN = "#22d3ee";

const nodes: NodeSpec[] = [
  { x: 64, y: 96, w: 150, h: 64, title: "Question", sub: "text or voice" },
  { x: 262, y: 96, w: 150, h: 64, title: "Normalize", sub: "clean the wording" },
  { x: 460, y: 96, w: 150, h: 64, title: "Resolve context", sub: "follow-ups stand alone" },
  { x: 658, y: 96, w: 150, h: 64, title: "Scope & route", sub: "pick the domain" },
  { x: 856, y: 96, w: 150, h: 64, title: "Out of scope", sub: "say so, stop", tone: "exit" },

  { x: 64, y: 256, w: 150, h: 64, title: "Clarity check", sub: "anything missing?" },
  { x: 262, y: 256, w: 150, h: 64, title: "Semantic cache", sub: "seen this before?" },
  { x: 460, y: 256, w: 150, h: 64, title: "Select tables", sub: "approved set only" },
  { x: 658, y: 256, w: 150, h: 64, title: "Generate SQL", sub: "glossary, rules, joins", tone: "brand" },
  { x: 856, y: 256, w: 150, h: 64, title: "Execute", sub: "read-only, time budget" },

  { x: 64, y: 416, w: 150, h: 64, title: "Ask to clarify", sub: "“did you mean…?”", tone: "exit" },
  { x: 460, y: 416, w: 150, h: 64, title: "Answer", sub: "sources + chart", tone: "cyan" },
  { x: 658, y: 416, w: 150, h: 64, title: "Insight & chart", sub: "narrative, card" },
  { x: 856, y: 416, w: 150, h: 64, title: "Validate", sub: "second model checks", tone: "brand" },
];

const arrows: ArrowSpec[] = [
  // row A
  { pts: [[214, 128], [262, 128]], head: true },
  { pts: [[412, 128], [460, 128]], head: true },
  { pts: [[610, 128], [658, 128]], head: true },
  { pts: [[808, 128], [856, 128]], head: true, dashed: true },
  // scope -> row B
  { pts: [[733, 160], [733, 208], [139, 208], [139, 256]], head: true },
  // row B
  { pts: [[214, 288], [262, 288]], head: true },
  { pts: [[412, 288], [460, 288]], head: true },
  { pts: [[610, 288], [658, 288]], head: true },
  { pts: [[808, 288], [856, 288]], head: true },
  // clarity -> ask to clarify
  { pts: [[139, 320], [139, 416]], head: true, dashed: true },
  // cache hit -> validate
  { pts: [[337, 320], [337, 368], [906, 368], [906, 416]], head: true, color: CYAN },
  // execute -> validate
  { pts: [[956, 320], [956, 416]], head: true },
  // validate -> insight -> answer
  { pts: [[856, 448], [808, 448]], head: true },
  { pts: [[658, 448], [610, 448]], head: true },
  // retry loop
  { pts: [[1006, 448], [1054, 448], [1054, 232], [758, 232], [758, 256]], head: true, color: BLUE, dashed: true },
];

export function PipelineDiagram() {
  return (
    <DiagramHost width={W} height={H}>
      <Arrows width={W} height={H} arrows={arrows} />
      {nodes.map((n) => <Node key={n.title} {...n} />)}
      <Label x={151} y={359} w={64} text="unclear" align="left" />
      <Label x={535} y={336} w={170} text="cache hit · replay SQL" color={CYAN} />
      <Label x={790} y={180} w={280} text="retry with feedback · max 2 attempts" color={BLUE} />
    </DiagramHost>
  );
}
