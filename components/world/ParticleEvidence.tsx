"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * The unstructured evidence field (§14).
 *
 * Fragments — reports, filings, policy updates, observations — surrounding the
 * world before they have been resolved into anything. They drift inward as the
 * reasoning chapter progresses and fade once they have docked, which is the
 * visual form of the argument that AI made ingestion tractable and left
 * structure as the missing layer.
 *
 * Purely ambient: no fragment is labelled, because none of them stands for a
 * specific document.
 */
export function ParticleEvidence({ count }: { count: number }) {
  const frame = useWorldFrame();
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  const { geometry, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const origin = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      // Distributed on a wide shell well outside the world body.
      const theta = (i * 2.399963) % (Math.PI * 2);
      const y = 1 - (i / Math.max(1, count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y)) * (3.1 + ((i * 37) % 11) / 11);

      origin[i * 3] = Math.cos(theta) * radius;
      origin[i * 3 + 1] = y * 2.4;
      origin[i * 3 + 2] = Math.sin(theta) * radius;

      positions[i * 3] = origin[i * 3]!;
      positions[i * 3 + 1] = origin[i * 3 + 1]!;
      positions[i * 3 + 2] = origin[i * 3 + 2]!;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: buffer, seeds: origin };
  }, [count]);

  useFrame(() => {
    const object = points.current;
    if (!object || count === 0) return;

    const { evidence } = frame.state.current;
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;

    // Fragments travel from their origin shell toward the model as evidence
    // docks. They never reach it: resolution is asymptotic, not complete.
    const pull = evidence * 0.62;

    for (let i = 0; i < count; i += 1) {
      const offset = i * 3;
      array[offset] = seeds[offset]! * (1 - pull);
      array[offset + 1] = seeds[offset + 1]! * (1 - pull * 0.7);
      array[offset + 2] = seeds[offset + 2]! * (1 - pull);
    }

    attribute.needsUpdate = true;

    if (material.current) {
      // Visible only around the reasoning chapters: present as they arrive,
      // gone once they are part of the model.
      const arrival = Math.min(1, evidence * 2.4);
      const departure = Math.max(0, 1 - Math.max(0, evidence - 0.6) * 2.5);
      material.current.opacity = arrival * departure * 0.5;
      material.current.visible = material.current.opacity > 0.004;
    }
  });

  if (count === 0) return null;

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={material}
        color={WORLD_COLOR.steel}
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}
