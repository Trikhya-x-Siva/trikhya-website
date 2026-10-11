// Synthetic resumes for the hiring demo recording. Fictional people, plant-floor roles, varied fit against the
// demo job (Production Engineer: Diploma+, 2+ years, Hindi + Marathi, must-have 5S + Kaizen, nice-to-have AutoCAD + Lean).
// Usage: node scripts/record/make-resumes.mjs <path-to-sparkminda-backend>   (borrows its pdfkit)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const backend = process.argv[2];
if (!backend) throw new Error("pass the sparkminda backend path (for pdfkit)");
const PDFDocument = createRequire(path.join(backend, "package.json"))("pdfkit");

const OUT = path.resolve(".record-tmp/resumes");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const people = [
  { file: "arjun-verma", name: "Arjun Verma", email: "arjun.verma@example.com", phone: "+91 98200 11001", edu: "Diploma in Mechanical Engineering, Government Polytechnic, 2018",
    exp: [["Line Engineer, Precision Castings Pvt Ltd", "2019 to present (5 years)", "Ran a 14-station assembly line. Led two Kaizen events that cut changeover time by 18%. Maintained 5S audits above 90%."]],
    skills: "5S, Kaizen, PDCA, AutoCAD, Lean Manufacturing, SAP PP, Root cause analysis", langs: "Hindi (read, write, speak), Marathi (read, write, speak), English (read, write)" },
  { file: "priya-nair", name: "Priya Nair", email: "priya.nair@example.com", phone: "+91 98200 11002", edu: "B.Tech in Production Engineering, 2020",
    exp: [["Production Engineer, Auto Harness Works", "2020 to 2024 (3.5 years)", "Owned shift output targets. Introduced 5S boards on three lines and ran daily Kaizen huddles."]],
    skills: "5S, Kaizen, Kanban, Six Sigma Green Belt, MS Excel", langs: "Hindi (read, write), Marathi (read, write), English" },
  { file: "rahul-deshmukh", name: "Rahul Deshmukh", email: "rahul.d@example.com", phone: "+91 98200 11003", edu: "ITI Fitter, 2016",
    exp: [["Machine Operator, Gear Components Ltd", "2017 to present (7 years)", "Operated CNC turning centres. Trained new operators on 5S housekeeping."]],
    skills: "5S, CNC operation, Preventive maintenance, AutoCAD basics", langs: "Marathi (read, write), Hindi (spoken)" },
  { file: "sneha-iyer", name: "Sneha Iyer", email: "sneha.iyer@example.com", phone: "+91 98200 11004", edu: "Diploma in Industrial Engineering, 2021",
    exp: [["Quality Trainee, Brake Systems Co", "2022 to 2023 (1 year)", "Supported incoming inspection and 5S audits. Documented one Kaizen improvement on the packing line."]],
    skills: "5S, Kaizen, Quality inspection, Minitab", langs: "Tamil (read, write), English (read, write), Hindi (spoken)" },
  { file: "vikram-patil", name: "Vikram Patil", email: "vikram.patil@example.com", phone: "+91 98200 11005", edu: "Diploma in Mechanical Engineering, 2015",
    exp: [["Shift Supervisor, Wiring Harness Division", "2016 to present (8 years)", "Supervised 40 operators across two shifts. Drove Kaizen and 5S programmes; plant 5S champion 2023."],
          ["Trainee Engineer, Sheet Metal Works", "2015 to 2016 (1 year)", "Press shop support."]],
    skills: "Kaizen, 5S, Lean, AutoCAD, Team leadership, TPM", langs: "Marathi (read, write), Hindi (read, write), English (read)" },
];

for (const p of people) {
  const doc = new PDFDocument({ margin: 56 });
  doc.pipe(fs.createWriteStream(path.join(OUT, `${p.file}.pdf`)));
  doc.fontSize(20).text(p.name).moveDown(0.2);
  doc.fontSize(10).fillColor("#444").text(`${p.email}  ·  ${p.phone}`).moveDown(1).fillColor("#000");
  doc.fontSize(13).text("Education").moveDown(0.3).fontSize(10.5).text(p.edu).moveDown(0.9);
  doc.fontSize(13).text("Experience").moveDown(0.3);
  for (const [title, when, body] of p.exp) { doc.fontSize(11).text(title).fontSize(9.5).fillColor("#444").text(when).fillColor("#000").fontSize(10.5).text(body).moveDown(0.6); }
  doc.moveDown(0.3).fontSize(13).text("Skills").moveDown(0.3).fontSize(10.5).text(p.skills).moveDown(0.9);
  doc.fontSize(13).text("Languages").moveDown(0.3).fontSize(10.5).text(p.langs);
  doc.end();
}
console.log(`${people.length} resumes in ${OUT}`);
