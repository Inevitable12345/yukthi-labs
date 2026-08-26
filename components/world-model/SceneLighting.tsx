"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

import { useWorld } from "./world-state-context";

/**
 * Two lights and no more.
 *
 * A single key from the upper left gives the sphere its matte terminator — the
 * thing that makes it read as a body rather than as a disc — and a very low fill
 * keeps the unlit side from going completely to paper black. The key dims as the
 * geographic shell is dropped, because past that point the scene is a structure,
 * not an object, and a lit surface would be a lie about what is being shown.
 */
export function SceneLighting() {
  const { stateRef } = useWorld();
  const key = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const state = stateRef.current;
    if (key.current) key.current.intensity = 1.25 * state.resolve * (1 - 0.8 * state.morph);
  });

  return (
    <>
      <ambientLight intensity={0.32} color="#7d98a7" />
      <directionalLight
        ref={key}
        position={[-2.6, 2.2, 3.4]}
        intensity={1.25}
        color="#ece7dc"
      />
    </>
  );
}
