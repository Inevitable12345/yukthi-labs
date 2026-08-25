"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { buildField } from "@/lib/graph/field";
import { usePrefersReducedMotion } from "@/lib/utils/use-reduced-motion";

/**
 * The causal field in WebGL.
 *
 * Loaded only when it is on screen, only where WebGL exists, and only on a device
 * that is not asking for lightweight rendering. Under reduced motion the frame
 * loop runs on demand and the field stands still.
 *
 * Geometry is built once and never re-allocated; the only per-frame work is a
 * rotation on a single group.
 */
export function CausalFieldScene({
  count = 220,
  intensity = 0.6,
  paused = false,
}: {
  count?: number;
  intensity?: number;
  paused?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 2.6], fov: 42 }}
      frameloop={reducedMotion || paused ? "demand" : "always"}
      style={{ pointerEvents: "none" }}
    >
      <FieldMesh count={count} intensity={intensity} still={reducedMotion || paused} />
    </Canvas>
  );
}

function FieldMesh({
  count,
  intensity,
  still,
}: {
  count: number;
  intensity: number;
  still: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  const { pointGeometry, lineGeometry, keyGeometry } = useMemo(() => {
    const field = buildField(count);

    const ordinary: number[] = [];
    const key: number[] = [];
    for (const node of field.nodes) {
      const target = node.weight > 0.74 ? key : ordinary;
      target.push(node.x, node.y, node.z);
    }

    const segments: number[] = [];
    for (const edge of field.edges) {
      const a = field.nodes[edge.a]!;
      const b = field.nodes[edge.b]!;
      segments.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }

    const make = (values: number[]) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(values, 3));
      return geometry;
    };

    return {
      pointGeometry: make(ordinary),
      keyGeometry: make(key),
      lineGeometry: make(segments),
    };
  }, [count]);

  useFrame((_, delta) => {
    if (still || !group.current) return;
    // One slow revolution roughly every three minutes. Observation, not spectacle.
    group.current.rotation.y += delta * 0.034;
    group.current.rotation.x = Math.sin(group.current.rotation.y * 0.34) * 0.06;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#7d98a7"
          transparent
          opacity={0.1 + intensity * 0.16}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={pointGeometry}>
        <pointsMaterial
          color="#ece7dc"
          size={0.012}
          sizeAttenuation
          transparent
          opacity={0.35 + intensity * 0.3}
          depthWrite={false}
        />
      </points>
      <points geometry={keyGeometry}>
        <pointsMaterial
          color="#bba36a"
          size={0.026}
          sizeAttenuation
          transparent
          opacity={0.6 + intensity * 0.4}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
