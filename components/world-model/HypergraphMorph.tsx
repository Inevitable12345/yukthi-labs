"use client";

import { useFrame } from "@react-three/fiber";

import { writePositions } from "@/lib/world/layout";

import { CausalNode3D } from "./CausalNode3D";
import { Hyperedge3D } from "./Hyperedge3D";
import { StrategicNode } from "./StrategicNode";
import { useWorld } from "./world-state-context";

/* ============================================================================
   WORLD → CAUSAL STRUCTURE
   ----------------------------------------------------------------------------
   The signature transition, and the one place in the scene where a single number
   does the arguing.

   At morph 0 every node sits at its real coordinates and the model is a map. At
   morph 1 the same nodes sit where their causal relationships put them: upstream
   conditions on the left, mechanisms and shared constraints in the middle,
   outcomes on the right — and the nodes that never had coordinates at all, the
   licence queue and the shared constraint, are now visible among them.

   Nothing is created or destroyed across the transition. It is the same set of
   objects, read a different way, which is exactly the claim being made.

   This component writes the frame's positions before any layer reads them.
   ========================================================================== */

export function HypergraphMorph() {
  const { stateRef, positionsRef } = useWorld();

  useFrame(() => {
    const positions = positionsRef.current;
    if (!positions) return;
    const state = stateRef.current;
    writePositions(positions, state.morph, state.remap);
  }, -1);

  return (
    <group>
      <Hyperedge3D />
      <StrategicNode subset="geographic" />
      <CausalNode3D />
    </group>
  );
}
