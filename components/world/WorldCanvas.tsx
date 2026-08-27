"use client";

import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { TIER_BUDGET } from "@/lib/utils/capability";
import { useCapabilityTier } from "@/lib/utils/use-capability";

import { WorldFallback } from "./WorldFallback";

/* ============================================================================
   THE PERSISTENT WORLD (§5, §31, §32)
   ----------------------------------------------------------------------------
   One canvas for the entire narrative, fixed behind the prose. It is created
   once and never remounted between chapters — remounting would rebuild the
   geometry and reset the morph, which is the one thing that must never happen to
   a persistent protagonist.

   Progressive enhancement, in order:
     1. the server renders the SVG world; it is what a crawler and a
        no-JavaScript visitor see, and it is the first paint for everyone;
     2. the device tier is resolved after mount;
     3. the 3D scene is imported only if the tier warrants it, and fades in over
        the SVG rather than replacing it abruptly.

   The canvas is `aria-hidden` and non-interactive throughout: every claim it
   illustrates is written in the DOM beside it (§33).
   ========================================================================== */

const CausalWorld = dynamic(
  () => import("./CausalWorld").then((module) => module.CausalWorld),
  { ssr: false, loading: () => null },
);

export function WorldCanvas() {
  const tier = useCapabilityTier();
  const [mounted, setMounted] = useState(false);

  // One frame of delay after the tier resolves, so the browser paints the DOM
  // narrative before it parses a 3D chunk.
  useEffect(() => {
    if (tier === "none") return;
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, [tier]);

  const showScene = mounted && tier !== "none";
  const budget = TIER_BUDGET[tier];

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      data-world-tier={tier}
    >
      {/* The static world. Stays mounted underneath: if the WebGL context is
          lost, the composition does not vanish. */}
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
        style={{ opacity: showScene ? 0 : 0.85 }}
      >
        <WorldFallback />
      </div>

      {showScene ? (
        <div className="absolute inset-0 animate-[world-in_2000ms_ease-out_forwards] opacity-0">
          <Canvas
            dpr={budget.dpr}
            gl={{
              antialias: tier === "full",
              alpha: true,
              powerPreference: tier === "full" ? "high-performance" : "low-power",
              // The world is drawn on the page background; a depth buffer costs
              // memory for geometry that is almost entirely additive lines.
              stencil: false,
            }}
            camera={{ position: [0, 0.35, 5.2], fov: 38, near: 0.1, far: 60 }}
            // `demand` under reduced motion: the scene renders when the story
            // state changes and stands still otherwise.
            frameloop={tier === "reduced" ? "demand" : "always"}
            style={{ pointerEvents: "none" }}
          >
            <CausalWorld tier={tier} />
          </Canvas>
        </div>
      ) : null}

      {/* A vignette that seats the world behind the type at every scroll
          position, so copy never lands on a bright cluster of nodes. */}
      <div className="u-world-vignette absolute inset-0" />
    </div>
  );
}
