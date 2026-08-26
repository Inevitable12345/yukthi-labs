"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { layoutIndex } from "@/lib/world/layout";
import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   STRATEGIC CHOKEPOINT
   ----------------------------------------------------------------------------
   One upstream node, and a widening region behind it.

   The rings expand from the point where separation and refining capacity is
   concentrated. They are not an explosion: they are the reach of a constraint,
   and the reason they matter is that the node at their centre never grows. A
   small thing keeps being small while the area it can stop keeps getting larger.

   The downstream sectors light in the order the mechanism runs — licensing, then
   the queue, then the constraint, then the tiers, then the sectors — because that
   order is the argument. `chokepointWave` in the data holds it.
   ========================================================================== */

const RING_COUNT = 3;

export function ChokepointScene() {
  const { stateRef, positionsRef } = useWorld();
  const group = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  const sourceIndex = useMemo(() => layoutIndex.get("rare-earth-refining"), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);

  useFrame(() => {
    const state = stateRef.current;
    const positions = positionsRef.current;
    if (!group.current || !positions || sourceIndex === undefined) return;

    const offset = sourceIndex * 3;
    scratch.set(positions[offset]!, positions[offset + 1]!, positions[offset + 2]!);
    group.current.position.copy(scratch);

    // Rings lie tangent to the surface at the node they originate from.
    const normal = scratch.clone().normalize();
    quaternion.setFromUnitVectors(up, normal);
    group.current.quaternion.copy(quaternion);

    for (let index = 0; index < RING_COUNT; index += 1) {
      const ring = rings.current[index];
      if (!ring) continue;

      const stagger = index / RING_COUNT;
      const wave = (state.chokepoint * 1.5 - stagger) % 1.0;
      const progress = wave < 0 ? 0 : wave;
      const scale = 0.06 + progress * 0.85;
      ring.scale.setScalar(scale);

      const material = ring.material as THREE.MeshBasicMaterial;
      // Fading with distance is the honest encoding: the further the constraint
      // travels, the less certain any single downstream consequence is.
      material.opacity = 0.42 * state.chokepoint * (1 - progress) * state.presence;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: RING_COUNT }, (_, index) => (
        <mesh
          key={index}
          ref={(instance) => {
            rings.current[index] = instance;
          }}
        >
          <ringGeometry args={[0.92, 1, 64]} />
          <meshBasicMaterial
            color={index === 0 ? WORLD_PALETTE.gold : WORLD_PALETTE.goldDim}
            side={THREE.DoubleSide}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
