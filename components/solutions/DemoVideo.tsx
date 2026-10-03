import { Play } from "lucide-react";

export function DemoVideo({ src, poster }: { src: string; poster?: string }) {
  if (!src) {
    return (
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.04]">
        <div className="flex flex-col items-center gap-3.5">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-electric-cobalt">
            <Play className="h-7 w-7 fill-white text-white" aria-hidden />
          </span>
          <span className="text-sm text-white/70">Demo video coming soon</span>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-black">
      <video controls preload="metadata" poster={poster} className="aspect-video w-full" aria-label="Product demo video">
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
