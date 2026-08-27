"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * Every node in the world, drawn as points.
 *
 * Three point clouds rather than one, because they carry different meanings and
 * need different sizes and colours: ordinary nodes, strategic nodes, and the
 * single chokepoint. Splitting them costs two extra draw calls and saves a
 * per-vertex size attribute plus a custom shader.
 *
 * All three read the same shared morph buffer, so they move as one object.
 */
export function StrategicNode() {
  const frame = useWorldFrame();

  const groups = useMemo(() => {
    const ordinary: number[] = [];
    const strategic: number[] = [];
    const chokepoint: number[] = [];

    for (const node of frame.graph.nodes) {
      if (node.kind === "chokepoint") chokepoint.push(node.index);
      else if (node.kind === "strategic") strategic.push(node.index);
      else ordinary.push(node.index);
    }

    return { ordinary, strategic, chokepoint };
  }, [frame.graph]);

  return (
    <>
      <NodeCloud
        indices={groups.ordinary}
        color={WORLD_COLOR.bone}
        size={0.019}
        baseOpacity={0.5}
      />
      <NodeCloud
        indices={groups.strategic}
        color={WORLD_COLOR.gold}
        size={0.038}
        baseOpacity={0.85}
      />
      <NodeCloud
        indices={groups.chokepoint}
        color={WORLD_COLOR.gold}
        size={0.075}
        baseOpacity={1}
        pulse
      />
    </>
  );
}

function NodeCloud({
  indices,
  color,
  size,
  baseOpacity,
  pulse = false,
}: {
  indices: number[];
  color: string;
  size: number;
  baseOpacity: number;
  pulse?: boolean;
}) {
  const frame = useWorldFrame();
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  const attribute = useMemo(
    () => new THREE.BufferAttribute(new Float32Array(indices.length * 3), 3),
    [indices.length],
  );

  useFrame(() => {
    const buffer = geometry.current;
    if (!buffer || indices.length === 0) return;

    const source = frame.positions.current;
    const target = attribute.array as Float32Array;

    for (let i = 0; i < indices.length; i += 1) {
      const offset = indices[i]! * 3;
      target[i * 3] = source[offset]!;
      target[i * 3 + 1] = source[offset + 1]!;
      target[i * 3 + 2] = source[offset + 2]!;
    }

    attribute.needsUpdate = true;
    buffer.computeBoundingSphere();

    if (material.current && pulse) {
      // The chokepoint is the only element on screen permitted to pulse, and it
      // does so slowly. It is a warning light, not an animation.
      const { chokepoint } = frame.state.current;
      const beat = 0.82 + Math.sin((performance.now() / 1000) * 1.1) * 0.18;
      material.current.opacity = baseOpacity * (0.4 + chokepoint * 0.6) * beat;
    }
  });

  if (indices.length === 0) return null;

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <primitive object={attribute} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={baseOpacity}
        depthWrite={false}
      />
    </points>
  );
}
