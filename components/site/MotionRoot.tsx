"use client";

import { useEffect } from "react";
import { MARK_BLUE, MARK_WHITE } from "@/lib/assets";
import { initAskTrikhya } from "@/lib/ask-trikhya";
import { initMotion } from "@/lib/motion-engine";
import { initAnalytics } from "@/lib/analytics";

/** Boots the site-wide motion engine and the Ask Trikhya assistant once per page load. */
export function MotionRoot() {
  useEffect(() => {
    initMotion({ markWhite: MARK_WHITE, markBlue: MARK_BLUE });
    if (location.pathname.includes("/admin")) return;
    initAskTrikhya({ markWhite: MARK_WHITE, markBlue: MARK_BLUE });
    initAnalytics();
  }, []);
  return null;
}
