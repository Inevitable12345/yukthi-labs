"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { buildField } from "@/lib/graph/field";
import { layoutNodes, CAUSAL_SCALE } from "@/lib/world/layout";
import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   UNRESOLVED OBSERVATIONS
   ----------------------------------------------------------------------------
   The particles in this scene are not decoration and are not a background
   texture. Each one stands for an unresolved observation — a filing, an event, a
   policy update, a price move — of which there are always more than any team can
   read.

   As the scene progresses they are resolved: each moves to the structure it
   belongs to and stops being a fragment. That is the claim about what machine
   reasoning is now good enough to do, and the reason the next scene says the
   missing layer is explicit causal structure rather than more information.
   ========================================================================== */

export function FragmentField() {
  const { stateRef, quality } = useWorld();
  const points = useRef<THREE.Points>(null);

  const { geometry, scatter, targets, count } = useMemo(() => {
    const count = quality === "high" ? 320 : 120;
    const field = buildField(count, 20260826);

    const scatter = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);

    field.nodes.forEach((node, index) => {
      // Unresolved: spread through the volume around the model.
      scatter[index * 3] = node.x * 2.1;
      scatter[index * 3 + 1] = node.y * 1.9;
      scatter[index * 3 + 2] = node.z * 2.4;

      // Resolved: attached to a node of the structure, slightly off it, so the
      // structure stays readable underneath the evidence that supports it.
      const anchor = layoutNodes[index % layoutNodes.length]!;
      targets[index * 3] = anchor.causal[0] + (node.x - 0.5) * 0.22;
      targets[index * 3 + 1] = anchor.causal[1] + (node.y - 0.5) * 0.22;
      targets[index * 3 + 2] = anchor.causal[2] + (node.z - 0.5) * 0.22;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    return { geometry, scatter, targets, count };
  }, [quality]);

  useFrame(() => {
    const state = stateRef.current;
    const attribute = points.current?.geometry.getAttribute("position") as
      THREE.BufferAttribute | undefined;
    if (!attribute) return;

    const array = attribute.array as Float32Array;
    const resolved = Math.max(state.organize, state.morph);
    const time = performance.now() / 1000;

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      // Fragments drift while unresolved and stop drifting once placed.
      const drift = (1 - resolved) * 0.045;
      const wobble = Math.sin(time * 0.35 + index) * drift;

      array[offset] =
        scatter[offset]! + (targets[offset]! - scatter[offset]!) * resolved + wobble;
      array[offset + 1] =
        scatter[offset + 1]! +
        (targets[offset + 1]! - scatter[offset + 1]!) * resolved +
        wobble * 0.6;
      array[offset + 2] =
        scatter[offset + 2]! + (targets[offset + 2]! - scatter[offset + 2]!) * resolved;
    }

    attribute.needsUpdate = true;

    const material = points.current?.material as THREE.PointsMaterial | undefined;
    if (material) {
      material.opacity =
        (0.1 + 0.42 * state.organize + 0.2 * state.morph) *
        state.presence *
        (1 - 0.7 * state.horizon);
      material.size = (0.008 + 0.006 * resolved) * CAUSAL_SCALE * 1.4;
    }
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={WORLD_PALETTE.dimBone}
        size={0.01}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}
