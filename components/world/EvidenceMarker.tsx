"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * Evidence, docking into the model (§14).
 *
 * Evidence nodes are ordinary members of the world until the monitoring layer
 * appears, at which point their layout carries them into a surrounding shell.
 * This component draws the tether between each one and the structure it
 * supports — the visual claim that evidence is attached to the model rather
 * than displayed beside it.
 */
export function EvidenceMarker() {
  const frame = useWorldFrame();
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.LineBasicMaterial>(null);

  const { pairs, attribute } = useMemo(() => {
    const evidence = frame.graph.nodes.filter((node) => node.kind === "evidence");
    const anchors = frame.graph.nodes.filter((node) => node.kind !== "evidence");

    // Each evidence node tethers to the structural node nearest it in causal
    // depth — the thing it is evidence *for*.
    const list = evidence.slice(0, 48).map((node) => {
      const anchor =
        anchors.find((candidate) => candidate.layer === node.layer) ?? anchors[0] ?? node;
      return { from: node.index, to: anchor.index };
    });

    return {
      pairs: list,
      attribute: new THREE.BufferAttribute(new Float32Array(list.length * 6), 3),
    };
  }, [frame.graph]);

  useFrame(() => {
    const buffer = geometry.current;
    if (!buffer || pairs.length === 0) return;

    const source = frame.positions.current;
    const target = attribute.array as Float32Array;

    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i]!;
      const a = pair.from * 3;
      const b = pair.to * 3;
      target[i * 6] = source[a]!;
      target[i * 6 + 1] = source[a + 1]!;
      target[i * 6 + 2] = source[a + 2]!;
      target[i * 6 + 3] = source[b]!;
      target[i * 6 + 4] = source[b + 1]!;
      target[i * 6 + 5] = source[b + 2]!;
    }

    attribute.needsUpdate = true;
    buffer.computeBoundingSphere();

    if (material.current) {
      const { evidence } = frame.state.current;
      material.current.opacity = evidence * 0.16;
      material.current.visible = evidence > 0.01;
    }
  });

  if (pairs.length === 0) return null;

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <primitive object={attribute} attach="attributes-position" />
      </bufferGeometry>
      <lineBasicMaterial
        ref={material}
        color={WORLD_COLOR.steel}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </lineSegments>
  );
}
