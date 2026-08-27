"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { WORLD_COLOR } from "@/lib/world/palette";
import { useWorldFrame } from "./world-context";

/**
 * Meridians and measurement rings.
 *
 * The instrument's graticule: the marks that say this is an object being
 * measured rather than a decorative sphere. They fade with the shell, but more
 * slowly — the sense of measurement should outlive the globe itself.
 */
export function WorldMeridians({
  rings = 5,
  meridians = 8,
}: {
  rings?: number;
  meridians?: number;
}) {
  const frame = useWorldFrame();
  const material = useRef<THREE.LineBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const segments = 96;

    // Latitude rings.
    for (let r = 1; r <= rings; r += 1) {
      const phi = (r / (rings + 1)) * Math.PI;
      const radius = Math.sin(phi);
      const y = Math.cos(phi);
      for (let s = 0; s < segments; s += 1) {
        const a = (s / segments) * Math.PI * 2;
        const b = ((s + 1) / segments) * Math.PI * 2;
        points.push(Math.cos(a) * radius, y, Math.sin(a) * radius);
        points.push(Math.cos(b) * radius, y, Math.sin(b) * radius);
      }
    }

    // Meridian half-circles.
    for (let m = 0; m < meridians; m += 1) {
      const theta = (m / meridians) * Math.PI * 2;
      for (let s = 0; s < segments; s += 1) {
        const a = (s / segments) * Math.PI;
        const b = ((s + 1) / segments) * Math.PI;
        points.push(Math.sin(a) * Math.cos(theta), Math.cos(a), Math.sin(a) * Math.sin(theta));
        points.push(Math.sin(b) * Math.cos(theta), Math.cos(b), Math.sin(b) * Math.sin(theta));
      }
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return buffer;
  }, [rings, meridians]);

  useFrame((_, delta) => {
    const { abstraction } = frame.state.current;
    if (material.current) {
      material.current.opacity = Math.max(0, 0.16 * (1 - abstraction * 0.88));
      material.current.visible = material.current.opacity > 0.002;
    }
    if (group.current) {
      group.current.scale.setScalar(1.004 + abstraction * 0.9);
      // One revolution roughly every three minutes: observation, not spectacle.
      group.current.rotation.y += delta * 0.018 * (1 - abstraction);
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          ref={material}
          color={WORLD_COLOR.steelDim}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
