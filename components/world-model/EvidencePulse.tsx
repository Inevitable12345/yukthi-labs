"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { layoutIndex, layoutNodes } from "@/lib/world/layout";
import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   EVIDENCE
   ----------------------------------------------------------------------------
   Evidence is not ambience here. Each marker corresponds to a real record in the
   evidence library, and it docks onto the specific node that record is cited
   against — with a visible tether, because the association between a claim and
   the thing it supports is the whole point of keeping an evidence layer at all.

   Markers arrive from outside the model and stay attached once they land, which
   is the behaviour of a citation rather than of a particle.
   ========================================================================== */

type Marker = {
  nodeIndex: number;
  evidenceId: string;
  /** Where the marker comes in from, before it docks. */
  origin: [number, number, number];
  phase: number;
};

export function EvidencePulse() {
  const { stateRef, positionsRef, quality } = useWorld();
  const points = useRef<THREE.Points>(null);
  const tethers = useRef<THREE.LineSegments>(null);

  const markers = useMemo<Marker[]>(() => {
    const result: Marker[] = [];

    layoutNodes.forEach((node) => {
      const index = layoutIndex.get(node.id);
      if (index === undefined) return;
      // One marker per evidence record actually cited against this node.
      node.evidenceIds.slice(0, quality === "high" ? 3 : 1).forEach((evidenceId, slot) => {
        const angle = (result.length * 2.39996) % (Math.PI * 2); // golden angle
        const lift = 1.85 + slot * 0.18;
        result.push({
          nodeIndex: index,
          evidenceId,
          origin: [
            Math.cos(angle) * lift,
            Math.sin(angle * 1.7) * lift * 0.55,
            Math.sin(angle) * lift,
          ],
          phase: (result.length % 7) / 7,
        });
      });
    });

    return result;
  }, [quality]);

  const geometry = useMemo(() => {
    const markerGeometry = new THREE.BufferGeometry();
    markerGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(markers.length * 3), 3),
    );

    const tetherGeometry = new THREE.BufferGeometry();
    tetherGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(markers.length * 6), 3),
    );

    return { markerGeometry, tetherGeometry };
  }, [markers.length]);

  useFrame(() => {
    const state = stateRef.current;
    const positions = positionsRef.current;
    if (!positions) return;

    const markerAttribute = points.current?.geometry.getAttribute("position") as
      THREE.BufferAttribute | undefined;
    const tetherAttribute = tethers.current?.geometry.getAttribute("position") as
      THREE.BufferAttribute | undefined;
    if (!markerAttribute || !tetherAttribute) return;

    const markerArray = markerAttribute.array as Float32Array;
    const tetherArray = tetherAttribute.array as Float32Array;

    markers.forEach((marker, slot) => {
      // Records arrive in sequence rather than in a shower.
      const dock = Math.min(1, Math.max(0, state.evidence * 1.6 - marker.phase * 0.55));
      const eased = dock * dock * (3 - 2 * dock);

      const offset = marker.nodeIndex * 3;
      const nx = positions[offset]!;
      const ny = positions[offset + 1]!;
      const nz = positions[offset + 2]!;

      // Docked markers sit just off the node they are cited against.
      const anchorScale = 1.11;
      const targetX = nx * anchorScale;
      const targetY = ny * anchorScale;
      const targetZ = nz * anchorScale;

      const x = marker.origin[0] + (targetX - marker.origin[0]) * eased;
      const y = marker.origin[1] + (targetY - marker.origin[1]) * eased;
      const z = marker.origin[2] + (targetZ - marker.origin[2]) * eased;

      markerArray[slot * 3] = x;
      markerArray[slot * 3 + 1] = y;
      markerArray[slot * 3 + 2] = z;

      // The tether only exists once the marker has arrived: an unattached claim
      // is not evidence for anything.
      const tetherStrength = eased > 0.9 ? 1 : 0;
      tetherArray[slot * 6] = x;
      tetherArray[slot * 6 + 1] = y;
      tetherArray[slot * 6 + 2] = z;
      tetherArray[slot * 6 + 3] = tetherStrength ? nx : x;
      tetherArray[slot * 6 + 4] = tetherStrength ? ny : y;
      tetherArray[slot * 6 + 5] = tetherStrength ? nz : z;
    });

    markerAttribute.needsUpdate = true;
    tetherAttribute.needsUpdate = true;

    // MONITOR, in the operating loop: evidence is not a thing that arrived once.
    // The docked records brighten again as the loop re-reads them.
    const monitoring =
      state.loop > 0.05 ? Math.max(0, 1 - Math.abs(state.loopPhase - 1.2)) * state.loop : 0;

    const visible =
      Math.max(state.evidence, monitoring) * state.presence * (1 - 0.85 * state.horizon);
    const markerMaterial = points.current?.material as THREE.PointsMaterial | undefined;
    if (markerMaterial) {
      markerMaterial.opacity = 0.85 * visible;
      markerMaterial.size = 0.024 + 0.014 * monitoring;
    }
    const tetherMaterial = tethers.current?.material as THREE.LineBasicMaterial | undefined;
    if (tetherMaterial) tetherMaterial.opacity = (0.3 + 0.35 * monitoring) * visible;
  });

  if (markers.length === 0) return null;

  return (
    <group>
      <lineSegments ref={tethers} geometry={geometry.tetherGeometry} frustumCulled={false}>
        <lineBasicMaterial
          color={WORLD_PALETTE.steel}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={points} geometry={geometry.markerGeometry} frustumCulled={false}>
        <pointsMaterial
          color={WORLD_PALETTE.steel}
          size={0.024}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
