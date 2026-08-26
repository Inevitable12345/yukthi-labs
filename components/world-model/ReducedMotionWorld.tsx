import { WorldFallback } from "./WorldFallback";

/* ============================================================================
   REDUCED MOTION
   ----------------------------------------------------------------------------
   Under `prefers-reduced-motion: reduce` no WebGL context is created at all —
   not a paused one, not a still frame of one. There is no camera travel, no
   morph, no orbit and no parallax, because none of those things exist here.

   What remains is the sequence as a series of static states: the world layer
   draws the scene belonging to the section being read, and swaps to the next one
   without transition. Every claim the animated version makes is available in the
   scene narrative, which is published as text beside it. Nothing is lost except
   the movement, which was never carrying information on its own.
   ========================================================================== */

export function ReducedMotionWorld({ index }: { index: number }) {
  return <WorldFallback index={index} />;
}
