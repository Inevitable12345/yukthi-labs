"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * Possible futures (§22).
 *
 * Branches extend forward from the downstream layers and thin out rather than
 * terminating in outcomes. Nothing here carries a probability, a label or a
 * ranking — the geometry says "these are paths the structure permits", which is
 * the strongest claim the evidence supports.
 */
export function FutureBranch({ maxBranches = 26 }: { maxBranches?: number }) {
  const frame = useWorldFrame();
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.LineBasicMaterial>(null);

  const SEGMENTS = 5;

  const { origins, attribute } = useMemo(() => {
    const downstream = frame.graph.nodes
      .filter((node) => node.layer >= 4)
      .slice(0, maxBranches)
      .map((node) => node.index);

    return {
      origins: downstream,
      attribute: new THREE.BufferAttribute(
        new Float32Array(downstream.length * SEGMENTS * 6),
        3,
      ),
    };
  }, [frame.graph, maxBranches]);

  useFrame(() => {
    const buffer = geometry.current;
    if (!buffer || origins.length === 0) return;

    const source = frame.positions.current;
    const target = attribute.array as Float32Array;
    const { futures } = frame.state.current;
    let cursor = 0;

    for (let i = 0; i < origins.length; i += 1) {
      const offset = origins[i]! * 3;
      const ox = source[offset]!;
      const oy = source[offset + 1]!;
      const oz = source[offset + 2]!;

      // Deterministic per-branch direction: the same node always sends its
      // branch the same way, so scrolling back and forth is stable.
      const spread = ((i % 7) - 3) * 0.16;
      const rise = ((i % 3) - 1) * 0.1;

      let px = ox;
      let py = oy;
      let pz = oz;

      for (let s = 1; s <= SEGMENTS; s += 1) {
        const t = (s / SEGMENTS) * futures;
        const nx = ox + spread * t * 2.1;
        const ny = oy + rise * t * 1.6 - t * 0.22;
        const nz = oz + t * 2.6;

        target[cursor] = px;
        target[cursor + 1] = py;
        target[cursor + 2] = pz;
        target[cursor + 3] = nx;
        target[cursor + 4] = ny;
        target[cursor + 5] = nz;
        cursor += 6;

        px = nx;
        py = ny;
        pz = nz;
      }
    }

    attribute.needsUpdate = true;
    buffer.computeBoundingSphere();

    if (material.current) {
      material.current.opacity = futures * 0.3;
      material.current.visible = futures > 0.01;
    }
  });

  if (origins.length === 0) return null;

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <primitive object={attribute} attach="attributes-position" />
      </bufferGeometry>
      <lineBasicMaterial
        ref={material}
        color={WORLD_COLOR.bone}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
