"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Renders a fixed-size diagram and scales it down to fit its container,
 *  so phones see the whole picture instead of a horizontal scrollbar. */
export function ScaledDiagram({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div style={{ height: height * scale }}>
        <div className="relative origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
