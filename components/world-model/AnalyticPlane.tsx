"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { toLineSegments, type Vec3 } from "@/lib/world/geo";
import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   STRUCTURAL BREAK
   ----------------------------------------------------------------------------
   For one scene the scene stops being spatial and becomes analytic: a plane, a
   fitted path, an observed path, and the divergence between them.

   The geometry carries no numbers and no scale, exactly as the SVG version of
   this figure does. It is a picture of a mechanism — a model fitted on one causal
   regime continuing to project after the regime changed — and not a plot of the
   ECB series. Attaching axis values to a schematic would be inventing data.
   ========================================================================== */

const BREAK_AT = 0.42;

function buildPaths() {
  const history: Vec3[] = [];
  const projection: Vec3[] = [];
  const actual: Vec3[] = [];
  const coneUpper: Vec3[] = [];
  const coneLower: Vec3[] = [];

  const width = 2.6;
  const x = (t: number) => -width / 2 + t * width;

  // History: a narrow, regular band. The regime a model is fitted on.
  for (let step = 0; step <= 60; step += 1) {
    const t = (step / 60) * BREAK_AT;
    history.push([x(t), Math.sin(t * 26) * 0.022 - 0.16, 0]);
  }

  const breakY = Math.sin(BREAK_AT * 26) * 0.022 - 0.16;

  for (let step = 0; step <= 60; step += 1) {
    const t = BREAK_AT + (step / 60) * (1 - BREAK_AT);
    const forward = (t - BREAK_AT) / (1 - BREAK_AT);

    // The projection extrapolates what it learned: almost flat.
    projection.push([x(t), breakY + forward * 0.05, 0]);
    // The path actually taken.
    actual.push([x(t), breakY + Math.pow(forward, 1.35) * 0.92, 0]);
    // The model's own stated uncertainty, which the actual path leaves entirely.
    coneUpper.push([x(t), breakY + forward * 0.05 + forward * 0.1, 0]);
    coneLower.push([x(t), breakY + forward * 0.05 - forward * 0.08, 0]);
  }

  const marker: Vec3[] = [
    [x(BREAK_AT), breakY - 0.34, 0],
    [x(BREAK_AT), breakY + 0.92, 0],
  ];

  return { history, projection, actual, coneUpper, coneLower, marker };
}

function geometryFrom(points: Vec3[]) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(toLineSegments(points), 3),
  );
  return geometry;
}

export function AnalyticPlane() {
  const { stateRef } = useWorld();
  const group = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    const paths = buildPaths();
    return {
      history: geometryFrom(paths.history),
      projection: geometryFrom(paths.projection),
      actual: geometryFrom(paths.actual),
      coneUpper: geometryFrom(paths.coneUpper),
      coneLower: geometryFrom(paths.coneLower),
      marker: geometryFrom(paths.marker),
    };
  }, []);

  useFrame(() => {
    const state = stateRef.current;
    if (!group.current) return;

    const visible = state.analytic;
    group.current.visible = visible > 0.01;
    if (!group.current.visible) return;

    // The plane arrives edge-on and rotates flat: the scene becoming analytical.
    group.current.rotation.x = (1 - visible) * -0.9;
    group.current.position.z = 1.15 + (1 - visible) * 0.5;
    group.current.position.y = 0.05;

    group.current.children.forEach((child) => {
      const material = (child as THREE.LineSegments).material as THREE.LineBasicMaterial;
      const weight = (child.userData.weight as number) ?? 1;
      const delay = (child.userData.delay as number) ?? 0;
      material.opacity =
        weight * Math.min(1, Math.max(0, visible * 1.5 - delay)) * state.presence;
    });
  });

  return (
    <group ref={group} visible={false}>
      <lineSegments geometry={geometries.history} userData={{ weight: 0.8, delay: 0 }}>
        <lineBasicMaterial color={WORLD_PALETTE.mutedBone} transparent opacity={0} />
      </lineSegments>
      <lineSegments geometry={geometries.marker} userData={{ weight: 0.5, delay: 0.15 }}>
        <lineBasicMaterial color={WORLD_PALETTE.dimBone} transparent opacity={0} />
      </lineSegments>
      <lineSegments geometry={geometries.coneUpper} userData={{ weight: 0.25, delay: 0.3 }}>
        <lineBasicMaterial color={WORLD_PALETTE.steelDim} transparent opacity={0} />
      </lineSegments>
      <lineSegments geometry={geometries.coneLower} userData={{ weight: 0.25, delay: 0.3 }}>
        <lineBasicMaterial color={WORLD_PALETTE.steelDim} transparent opacity={0} />
      </lineSegments>
      <lineSegments geometry={geometries.projection} userData={{ weight: 0.6, delay: 0.25 }}>
        <lineBasicMaterial color={WORLD_PALETTE.steel} transparent opacity={0} />
      </lineSegments>
      <lineSegments geometry={geometries.actual} userData={{ weight: 0.95, delay: 0.4 }}>
        <lineBasicMaterial color={WORLD_PALETTE.rupture} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}
