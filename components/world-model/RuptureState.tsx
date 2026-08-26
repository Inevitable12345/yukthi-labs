"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { latLonToVec3, toLineSegments, type Vec3 } from "@/lib/world/geo";
import { GLOBE_RADIUS } from "@/lib/world/layout";
import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   RUPTURE
   ----------------------------------------------------------------------------
   The globe is not broken, blown apart, or set on fire. Two things happen, and
   both of them are claims:

     · a seam appears where the arrangement separates — drawn as a great circle,
       because a bloc boundary is a line on a sphere and not a crack;
     · the uncertainty shell expands, because more plausible futures is the actual
       consequence of a change in structure.

   The routes themselves are rewired by `GlobalArc`. This layer is the condition
   they are rewired under.
   ========================================================================== */

export function RuptureState() {
  const { stateRef } = useWorld();
  const seam = useRef<THREE.LineSegments>(null);
  const shell = useRef<THREE.Mesh>(null);

  const seamGeometry = useMemo(() => {
    // A great circle tilted through the Atlantic and the Pacific: not a border
    // anyone drew, a separation the arrangement developed.
    const points: Vec3[] = [];
    for (let step = 0; step <= 180; step += 1) {
      const t = (step / 180) * Math.PI * 2;
      const latitude = Math.sin(t) * 62;
      const longitude = ((step / 180) * 360 - 180) * 1;
      points.push(latLonToVec3(latitude, longitude, GLOBE_RADIUS * 1.004));
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(toLineSegments(points), 3),
    );
    return geometry;
  }, []);

  useFrame(() => {
    const state = stateRef.current;
    const visible = state.rewire * (1 - state.morph) * state.presence;

    const seamMaterial = seam.current?.material as THREE.LineBasicMaterial | undefined;
    if (seamMaterial) seamMaterial.opacity = 0.5 * visible;

    if (shell.current) {
      // Wider structure, wider uncertainty. The shell grows with the rewiring and
      // never contracts, because nothing here restores the previous certainty.
      const scale = 1.02 + 0.22 * state.rewire;
      shell.current.scale.setScalar(scale);
      const material = shell.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.05 * visible;
    }
  });

  return (
    <group>
      <lineSegments ref={seam} geometry={seamGeometry}>
        <lineBasicMaterial
          color={WORLD_PALETTE.rupture}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <mesh ref={shell}>
        <icosahedronGeometry args={[GLOBE_RADIUS, 3]} />
        <meshBasicMaterial
          color={WORLD_PALETTE.steel}
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
