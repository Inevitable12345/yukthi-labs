"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { futureBranches } from "@/data/futures";
import { CAUSAL_SCALE } from "@/lib/world/layout";
import { WORLD_PALETTE, hexToRgb } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   POSSIBLE FUTURES
   ----------------------------------------------------------------------------
   Branches from the present state of the structure, one per branch in
   `data/futures.ts`.

   Each branch is drawn as three diverging strands rather than as one line. That
   is the only uncertainty encoding used here, and it is deliberately qualitative:
   the strands separate with distance because a path further out is less
   determined, not because a spread has been computed. No probability is attached
   to any branch, because no model has produced one — and a number in that
   position would be decoration wearing the costume of evidence.

   Every branch is labelled illustrative in the overlay, in the readout, and in
   the text alternative.
   ========================================================================== */

const STRANDS = 3;
const SEGMENTS = 26;

export function FutureBranch() {
  const { stateRef } = useWorld();
  const lines = useRef<THREE.LineSegments>(null);

  const { geometry, vertexCount } = useMemo(() => {
    const positions: number[] = [];
    const along: number[] = [];
    const colors: number[] = [];

    const origin = new THREE.Vector3(1.78 * CAUSAL_SCALE, 0, 0);
    const gold = hexToRgb(WORLD_PALETTE.gold);
    const steel = hexToRgb(WORLD_PALETTE.steel);

    futureBranches.forEach((branch, branchIndex) => {
      const spreadY = (branchIndex - (futureBranches.length - 1) / 2) * 0.42;
      const spreadZ = branchIndex % 2 === 0 ? 0.14 : -0.14;
      const tint = branchIndex === 0 ? gold : steel;

      for (let strand = 0; strand < STRANDS; strand += 1) {
        const wobble = (strand - (STRANDS - 1) / 2) * 0.055;

        let previous: THREE.Vector3 | null = null;
        for (let step = 0; step <= SEGMENTS; step += 1) {
          const t = step / SEGMENTS;
          const point = new THREE.Vector3(
            origin.x + t * 1.25,
            origin.y + spreadY * Math.pow(t, 1.3) + wobble * t * t * 3.2,
            origin.z + spreadZ * Math.pow(t, 1.5) + wobble * t * 1.6,
          );

          if (previous) {
            positions.push(previous.x, previous.y, previous.z, point.x, point.y, point.z);
            along.push((step - 1) / SEGMENTS, t);
            // Strands dim as they extend: further out, less determined.
            for (const fade of [1 - (step - 1) / SEGMENTS, 1 - t]) {
              const gain = 0.35 + fade * 0.65;
              colors.push(tint[0] * gain, tint[1] * gain, tint[2] * gain);
            }
          }
          previous = point;
        }
      }
    });

    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    result.setAttribute("aAlong", new THREE.Float32BufferAttribute(along, 1));
    result.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return { geometry: result, vertexCount: positions.length / 3 };
  }, []);

  useFrame(() => {
    const state = stateRef.current;
    const material = lines.current?.material as THREE.LineBasicMaterial | undefined;
    if (!lines.current || !material) return;

    // Branches also extend during the forecast phase of the operating loop, which
    // is the same act performed at a smaller scale.
    const forecast = Math.max(0, Math.min(1, state.loopPhase - 1.6)) * state.loop;
    const strength = Math.max(state.futures, forecast * 0.55);

    lines.current.visible = strength > 0.01;
    material.opacity = 0.75 * strength * state.presence;
  });

  if (vertexCount === 0) return null;

  return (
    <lineSegments ref={lines} geometry={geometry} visible={false} frustumCulled={false}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
