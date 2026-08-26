"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { graticuleSegments, ringSegments } from "@/lib/world/geo";
import { GLOBE_RADIUS, buildLandPoints } from "@/lib/world/layout";
import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   THE SPHERE
   ----------------------------------------------------------------------------
   Not a photograph of the Earth. An instrument: a dark matte body, a
   cartographic graticule, coarse landmass hints, and two tilted measurement rings
   with degree ticks.

   Every part of it is procedural — there is no texture to download and no image
   to mistake for data — and every part of it fades on the same signal, so that
   when the model stops being geographic the geography actually leaves.
   ========================================================================== */

export function WorldSphere() {
  const { stateRef, quality } = useWorld();

  const surface = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const graticule = useRef<THREE.LineSegments>(null);
  const land = useRef<THREE.Points>(null);
  const rings = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const detail = quality === "high" ? 2 : 1;

    const graticuleGeometry = new THREE.BufferGeometry();
    graticuleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        graticuleSegments({
          meridians: quality === "high" ? 24 : 12,
          parallels: quality === "high" ? 11 : 7,
          radius: GLOBE_RADIUS * 1.001,
          resolution: quality === "high" ? 72 : 40,
        }),
        3,
      ),
    );

    const landGeometry = new THREE.BufferGeometry();
    landGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(buildLandPoints(quality === "high" ? 1.9 : 3.2), 3),
    );

    const outerRing = new THREE.BufferGeometry();
    outerRing.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        ringSegments({ radius: 1.42, tiltX: 0.46, tiltZ: 0.1, ticks: 72 }),
        3,
      ),
    );

    const innerRing = new THREE.BufferGeometry();
    innerRing.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        ringSegments({ radius: 1.19, tiltX: -0.3, tiltZ: 0.24, ticks: 36, tickLength: 0.03 }),
        3,
      ),
    );

    return { detail, graticuleGeometry, landGeometry, outerRing, innerRing };
  }, [quality]);

  useFrame((_, delta) => {
    const state = stateRef.current;

    const surfaceMaterial = surface.current?.material as THREE.MeshStandardMaterial | undefined;
    if (surfaceMaterial) surfaceMaterial.opacity = 0.96 * state.resolve * (1 - state.morph);

    const haloMaterial = halo.current?.material as THREE.MeshBasicMaterial | undefined;
    if (haloMaterial) haloMaterial.opacity = 0.09 * state.resolve * (1 - state.morph);

    const graticuleMaterial = graticule.current?.material as
      THREE.LineBasicMaterial | undefined;
    if (graticuleMaterial) graticuleMaterial.opacity = 0.16 * state.geoShell;

    const landMaterial = land.current?.material as THREE.PointsMaterial | undefined;
    if (landMaterial) landMaterial.opacity = 0.4 * state.geoShell;

    if (rings.current) {
      // The instrument keeps time. One revolution takes minutes, and it stops
      // entirely once the model is no longer being read as a map.
      rings.current.rotation.y += delta * 0.045 * (1 - state.morph);
      rings.current.children.forEach((child) => {
        const material = (child as THREE.LineSegments).material as THREE.LineBasicMaterial;
        material.opacity = 0.22 * state.resolve * (1 - state.morph);
      });
    }
  });

  return (
    <group>
      <mesh ref={surface}>
        <icosahedronGeometry args={[GLOBE_RADIUS, geometry.detail + 3]} />
        <meshStandardMaterial
          color={WORLD_PALETTE.deepField}
          roughness={0.94}
          metalness={0.04}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={halo} scale={1.075}>
        <icosahedronGeometry args={[GLOBE_RADIUS, 3]} />
        <meshBasicMaterial
          color={WORLD_PALETTE.steel}
          side={THREE.BackSide}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <lineSegments ref={graticule} geometry={geometry.graticuleGeometry}>
        <lineBasicMaterial
          color={WORLD_PALETTE.steelDim}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={land} geometry={geometry.landGeometry}>
        <pointsMaterial
          color={WORLD_PALETTE.mutedBone}
          size={quality === "high" ? 0.0095 : 0.013}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>

      <group ref={rings}>
        <lineSegments geometry={geometry.outerRing}>
          <lineBasicMaterial
            color={WORLD_PALETTE.goldDim}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </lineSegments>
        <lineSegments geometry={geometry.innerRing}>
          <lineBasicMaterial
            color={WORLD_PALETTE.steelDim}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </group>
  );
}
