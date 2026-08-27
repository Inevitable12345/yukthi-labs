"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * The relations between nodes.
 *
 * One `LineSegments` for every edge in the world, rebuilt from the live node
 * positions each frame. Because the endpoints are read from the shared morph
 * buffer, the arcs reorganise with the nodes for free — the trade routes of the
 * globe and the causal edges of the graph are literally the same geometry.
 *
 * Colour carries meaning: steel for ordinary relations, gold for anything
 * touching the chokepoint. Nothing is coloured for decoration.
 */
export function CausalArc({ maxEdges }: { maxEdges: number }) {
  const frame = useWorldFrame();
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.LineBasicMaterial>(null);

  const { edges, positionAttribute, colorAttribute } = useMemo(() => {
    const list = frame.graph.edges.slice(0, maxEdges);
    const positions = new Float32Array(list.length * 6);
    const colors = new Float32Array(list.length * 6);

    const steel = new THREE.Color(WORLD_COLOR.steel);
    const gold = new THREE.Color(WORLD_COLOR.gold);
    const chokepoint = frame.graph.chokepointIndex;

    list.forEach((edge, i) => {
      const touchesChokepoint = edge.a === chokepoint || edge.b === chokepoint;
      const color = touchesChokepoint ? gold : steel;
      for (let v = 0; v < 2; v += 1) {
        colors[i * 6 + v * 3] = color.r;
        colors[i * 6 + v * 3 + 1] = color.g;
        colors[i * 6 + v * 3 + 2] = color.b;
      }
    });

    return {
      edges: list,
      positionAttribute: new THREE.BufferAttribute(positions, 3),
      colorAttribute: new THREE.BufferAttribute(colors, 3),
    };
  }, [frame.graph, maxEdges]);

  useFrame(() => {
    const buffer = geometry.current;
    if (!buffer) return;

    const source = frame.positions.current;
    const target = positionAttribute.array as Float32Array;

    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i]!;
      const a = edge.a * 3;
      const b = edge.b * 3;
      const offset = i * 6;
      target[offset] = source[a]!;
      target[offset + 1] = source[a + 1]!;
      target[offset + 2] = source[a + 2]!;
      target[offset + 3] = source[b]!;
      target[offset + 4] = source[b + 1]!;
      target[offset + 5] = source[b + 2]!;
    }

    positionAttribute.needsUpdate = true;
    buffer.computeBoundingSphere();

    if (material.current) {
      // Relations are faint while the world is geographic and firm once it is
      // causal: the reader should feel the structure resolving, not appearing.
      const { abstraction } = frame.state.current;
      material.current.opacity = 0.08 + abstraction * 0.22;
    }
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <primitive object={positionAttribute} attach="attributes-position" />
        <primitive object={colorAttribute} attach="attributes-color" />
      </bufferGeometry>
      <lineBasicMaterial
        ref={material}
        vertexColors
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
