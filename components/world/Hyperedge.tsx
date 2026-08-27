"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * Many-to-many relations, drawn through a junction (§10, §15).
 *
 * A hyperedge is not a bundle of arrows. Several sources converge on a single
 * waist and several targets emerge from it, so the *conjunction* is visible: it
 * takes all of these together to produce all of those.
 *
 * These stay invisible until the argument has earned them — `hyper` only rises
 * once the linear chain has been shown to be inadequate.
 */
export function Hyperedge() {
  const frame = useWorldFrame();
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.LineBasicMaterial>(null);

  const { hyperedges, attribute, segmentCount } = useMemo(() => {
    const list = frame.graph.hyperedges;
    const segments = list.reduce(
      (sum, edge) => sum + edge.sources.length + edge.targets.length,
      0,
    );
    return {
      hyperedges: list,
      attribute: new THREE.BufferAttribute(new Float32Array(segments * 6), 3),
      segmentCount: segments,
    };
  }, [frame.graph]);

  const centroid = useMemo(() => new THREE.Vector3(), []);
  const waist = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const buffer = geometry.current;
    if (!buffer || segmentCount === 0) return;

    const source = frame.positions.current;
    const target = attribute.array as Float32Array;
    let cursor = 0;

    for (const edge of hyperedges) {
      // The junction sits between the centroid of the sources and that of the
      // targets — so it moves with the graph as the world morphs.
      centroid.set(0, 0, 0);
      for (const index of edge.sources) {
        centroid.x += source[index * 3]!;
        centroid.y += source[index * 3 + 1]!;
        centroid.z += source[index * 3 + 2]!;
      }
      centroid.divideScalar(edge.sources.length);

      waist.set(0, 0, 0);
      for (const index of edge.targets) {
        waist.x += source[index * 3]!;
        waist.y += source[index * 3 + 1]!;
        waist.z += source[index * 3 + 2]!;
      }
      waist.divideScalar(edge.targets.length);

      const jx = centroid.x + (waist.x - centroid.x) * edge.waist;
      const jy = centroid.y + (waist.y - centroid.y) * edge.waist;
      const jz = centroid.z + (waist.z - centroid.z) * edge.waist;

      for (const index of [...edge.sources, ...edge.targets]) {
        target[cursor] = source[index * 3]!;
        target[cursor + 1] = source[index * 3 + 1]!;
        target[cursor + 2] = source[index * 3 + 2]!;
        target[cursor + 3] = jx;
        target[cursor + 4] = jy;
        target[cursor + 5] = jz;
        cursor += 6;
      }
    }

    attribute.needsUpdate = true;
    buffer.computeBoundingSphere();

    if (material.current) {
      const { hyper } = frame.state.current;
      material.current.opacity = hyper * 0.42;
      material.current.visible = hyper > 0.01;
    }
  });

  if (segmentCount === 0) return null;

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <primitive object={attribute} attach="attributes-position" />
      </bufferGeometry>
      <lineBasicMaterial
        ref={material}
        color={WORLD_COLOR.gold}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
