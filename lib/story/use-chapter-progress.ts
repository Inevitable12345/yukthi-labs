"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter } from "./chapters";
import { readProgress } from "./store";

/**
 * Polls one room's scroll progress on animation frames, re-rendering only when
 * it moves by more than `step`. Used by the few DOM scenes that are genuinely
 * scrubbed — a propagating cascade, a tightening feedback loop — rather than
 * simply revealed.
 *
 * `step` trades smoothness for renders. The default of 1/60 is imperceptible
 * on a progress-driven transform and keeps React out of the hot path.
 */
export function useChapterProgress(chapter: Chapter, step = 1 / 60): number {
  const [value, setValue] = useState(0);
  const latest = useRef(0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const next = readProgress(chapter);
      if (
        Math.abs(next - latest.current) >= step ||
        (next !== latest.current && (next === 0 || next === 1))
      ) {
        latest.current = next;
        setValue(next);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [chapter, step]);

  return value;
}
