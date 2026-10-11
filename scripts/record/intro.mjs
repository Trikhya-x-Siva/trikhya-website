// Prepend the branded title card to already-recorded clips, without re-recording.
// node scripts/record/intro.mjs                 # all three
// node scripts/record/intro.mjs ai-hiring       # one
import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import { CARDS, addIntro } from "./lib.mjs";

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CARDS);
for (const name of names) {
  const card = CARDS[name];
  if (!card) throw new Error(`no card for ${name}; known: ${Object.keys(CARDS).join(", ")}`);
  const mp4 = path.resolve("public/videos", `${name}.mp4`), poster = path.resolve("public/videos", `${name}.jpg`);
  if (!fs.existsSync(mp4)) throw new Error(`missing ${mp4}`);
  await addIntro(mp4, card);
  spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-ss", "1.6", "-i", mp4, "-frames:v", "1", "-update", "1", "-q:v", "3", poster], { stdio: "inherit" });
  console.log(`${name}: intro added (${(fs.statSync(mp4).size / 1e6).toFixed(1)} MB)`);
}
