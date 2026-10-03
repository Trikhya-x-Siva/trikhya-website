"use client";

import { useEffect } from "react";
import { MARK_BLUE, MARK_WHITE } from "@/lib/assets";
import { initGodseye } from "@/lib/godseye";
import { initMotion } from "@/lib/motion-engine";

/** Boots the site-wide motion engine and the Godseye assistant once per page load. */
export function MotionRoot() {
  useEffect(() => {
    initMotion({ markWhite: MARK_WHITE, markBlue: MARK_BLUE });
    initGodseye({ markWhite: MARK_WHITE, markBlue: MARK_BLUE });
  }, []);
  return null;
}
