"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * The planetary shell.
 *
 * A wireframe body that exists only while the world is still geographic. As
 * `abstraction` rises it fades and contracts — the globe does not shatter, it
 * ceases to be the relevant representation. That distinction is the whole point
 * of the reveal (§15), so the shell never breaks apart.
 */
export function WorldShell() {
  const frame = useWorldFrame();
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 3), []);

  useFrame(() => {
    const { abstraction } = frame.state.current;
    if (material.current) {
      material.current.opacity = Math.max(0, 0.13 * (1 - abstraction));
      material.current.visible = material.current.opacity > 0.002;
    }
    if (mesh.current) {
      const scale = 1 - abstraction * 0.25;
      mesh.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshBasicMaterial
        ref={material}
        color={WORLD_COLOR.steelDim}
        wireframe
        transparent
        opacity={0.13}
        depthWrite={false}
      />
    </mesh>
  );
}
