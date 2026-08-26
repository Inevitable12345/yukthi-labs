"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/**
 * The horizon.
 *
 * It opens the sequence and it closes it: a single line, far off, with the world
 * either not yet resolved above it or having receded back to it. It is the only
 * element present in both the first scene and the last, which is the point —
 * the argument returns to where it started, having said something in between.
 */
export function WorldHorizon() {
  const { stateRef } = useWorld();
  const line = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    // A slight curve, so it reads as the edge of something round.
    const values: number[] = [];
    const span = 9;
    const steps = 60;
    for (let step = 0; step < steps; step += 1) {
      const t0 = step / steps;
      const t1 = (step + 1) / steps;
      const x0 = -span / 2 + t0 * span;
      const x1 = -span / 2 + t1 * span;
      const curve = (x: number) => -Math.pow(x / (span / 2), 2) * 0.16;
      values.push(x0, curve(x0), 0, x1, curve(x1), 0);
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(values, 3));
    return geometry;
  }, []);

  useFrame(() => {
    const state = stateRef.current;
    if (!line.current) return;

    line.current.position.set(0, -1.45, -2.6);
    const material = line.current.material as THREE.LineBasicMaterial;
    material.opacity = 0.46 * Math.max(1 - state.resolve, state.horizon);
  });

  return (
    <lineSegments ref={line} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        color={WORLD_PALETTE.gold}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </lineSegments>
  );
}
