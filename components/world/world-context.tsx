"use client";

import { createContext, useContext } from "react";

import type { WorldGraph } from "@/lib/world/geometry";

/* ============================================================================
   WORLD FRAME CONTEXT
   ----------------------------------------------------------------------------
   The morphed node positions are computed once per frame by `CausalWorld` and
   read by every child that draws something anchored to a node — arcs, hyperedge
   junctions, markers, branches.

   The context carries a *ref to a mutable Float32Array*, not the array itself.
   Children read `positions.current` inside their own `useFrame`; nothing here
   ever triggers a React render. Passing the buffer through React state instead
   would re-render the scene graph on every frame, which is precisely the cost
   this design exists to avoid.
   ========================================================================== */

export type WorldFrame = {
  graph: WorldGraph;
  /** Live interpolated positions, `nodes.length * 3` floats. Mutated in place. */
  positions: { current: Float32Array };
  /** Shared per-frame scalars, so children need not recompute them. */
  state: {
    current: {
      /** 0 while the world is a globe, 1 once it is pure causal structure. */
      abstraction: number;
      /** 0–1 across the chokepoint chapter. */
      chokepoint: number;
      /** 0–1 as hyperedges resolve. */
      hyper: number;
      /** 0–1 as evidence docks into the model. */
      evidence: number;
      /** 0–1 as futures branch. */
      futures: number;
      /** Overall timeline position, in chapter units. */
      timeline: number;
    };
  };
};

const WorldFrameContext = createContext<WorldFrame | null>(null);

export const WorldFrameProvider = WorldFrameContext.Provider;

export function useWorldFrame(): WorldFrame {
  const value = useContext(WorldFrameContext);
  if (!value) {
    throw new Error("useWorldFrame must be used inside <CausalWorld>.");
  }
  return value;
}
