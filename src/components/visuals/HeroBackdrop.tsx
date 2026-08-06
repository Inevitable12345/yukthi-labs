"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * Hero backdrop.
 *
 * Deliberately abstract: a deep gradient field, soft colour blooms and a fine
 * rule grid. There is no illustrated content here — no globe, skyline or
 * floating objects — so nothing competes with the conference title or dates
 * for attention, and nothing looks like generic stock artwork.
 *
 * Everything is CSS gradients and transforms: no raster assets, no layout
 * shift, and the pointer parallax switches off entirely under
 * `prefers-reduced-motion`.
 */
export function HeroBackdrop() {
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 40, damping: 24, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 40, damping: 24, mass: 0.7 });

  // Each layer drifts a different amount — the only source of depth now.
  const farX = useTransform(springX, [-1, 1], [24, -24]);
  const farY = useTransform(springY, [-1, 1], [16, -16]);
  const nearX = useTransform(springX, [-1, 1], [-18, 18]);
  const nearY = useTransform(springY, [-1, 1], [-12, 12]);

  useEffect(() => {
    if (reduceMotion) return;
    // Pointer only — a coarse pointer would fight with scrolling.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMove(event: PointerEvent) {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base gradient field */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#061c4d_0%,#092b72_38%,#251a6b_72%,#3d1560_100%)]" />

      {/* Colour blooms */}
      <motion.div
        style={reduceMotion ? undefined : { x: farX, y: farY }}
        className="absolute inset-0"
      >
        <div className="absolute -left-40 -top-40 size-[40rem] rounded-full bg-royal/45 blur-[130px] animate-glow-breathe" />
        <div className="absolute -right-32 top-1/4 size-[36rem] rounded-full bg-violet/40 blur-[130px] animate-glow-breathe [animation-delay:-3s]" />
        <div className="absolute bottom-[-16rem] left-1/4 size-[34rem] rounded-full bg-magenta/25 blur-[140px] animate-glow-breathe [animation-delay:-5s]" />
      </motion.div>

      {/* Fine rule grid, faded out towards the edges */}
      <motion.div
        style={reduceMotion ? undefined : { x: nearX, y: nearY }}
        className="absolute inset-0"
      >
        <div className="absolute inset-[-2rem] bg-grid opacity-[0.17] mix-blend-overlay mask-fade" />
      </motion.div>

      {/* Single soft light sweep across the upper third */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_70%_100%_at_60%_0%,rgba(127,216,245,0.16),transparent_70%)]" />

      {/* Fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent" />
    </div>
  );
}
