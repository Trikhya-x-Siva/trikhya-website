"use client";

import { withBase } from "@/lib/paths";

export type VideoSpec = { src: string; poster?: string; title?: string };

const FRAME: React.CSSProperties = { width: "100%", aspectRatio: "16 / 9", display: "block", background: "#161a21", border: "1px solid #2a313c", boxShadow: "0 40px 90px rgba(0,0,0,.5)" };

/** Replaces the animated demo panel once a recording exists. Local files (public/videos/*.mp4) play inline, muted and
 *  looping; a YouTube or Vimeo URL is embedded. Set `video` on the solution's content to switch it on. */
export function SolutionVideo({ video }: { video: VideoSpec }) {
  const embed = /youtube\.com|youtu\.be|vimeo\.com/.test(video.src);
  if (embed) {
    return <iframe data-wipe="1" src={video.src} title={video.title ?? "Solution walkthrough"} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ ...FRAME, border: "1px solid #2a313c" }} />;
  }
  return (
    <video data-wipe="1" src={withBase(video.src)} poster={video.poster ? withBase(video.poster) : undefined} autoPlay muted loop playsInline controls preload="metadata" style={{ ...FRAME, objectFit: "cover" }}>
      {video.title ?? "Solution walkthrough"}
    </video>
  );
}
