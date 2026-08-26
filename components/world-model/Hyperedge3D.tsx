"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { worldHyperedges } from "@/data/world-model";
import { layoutIndex } from "@/lib/world/layout";
import { WORLD_PALETTE, hexToRgb } from "@/lib/world/palette";
import { ORDER_OPACITY } from "@/lib/graph/tokens";

import { useWorld } from "./world-state-context";

/* ============================================================================
   HYPEREDGES
   ----------------------------------------------------------------------------
   Sources → junction → targets.

   The junction is the entire point. Drawing a separate line from each source to
   each target would assert that any one of them is sufficient. The junction
   asserts what the cases actually show: that they acted jointly, and that removing
   any one of them might have produced no shortage at all.

   Causal distance is drawn with opacity and stated in the readout and in the text
   alternative, because opacity alone is not an accessible encoding.
   ========================================================================== */

const VERTEX = /* glsl */ `
  attribute float aAlong;
  attribute float aOrder;
  attribute vec3 aColor;

  varying float vAlong;
  varying float vOrder;
  varying vec3 vColor;

  void main() {
    vAlong = aAlong;
    vOrder = aOrder;
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uReveal;

  varying float vAlong;
  varying float vOrder;
  varying vec3 vColor;

  void main() {
    // First-order relationships resolve first. Consequence arrives in the order
    // the mechanism runs, not all at once.
    float gate = smoothstep(0.0, 0.42, uReveal * 1.5 - (vOrder - 1.0) * 0.3);

    // Activation travelling from cause to effect.
    float travel = fract(vAlong - uTime * 0.16);
    float head = 0.42 + 0.58 * pow(travel, 5.0);

    float alpha = uOpacity * gate * head;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

type EdgePlan = {
  order: 1 | 2 | 3;
  sources: number[];
  targets: number[];
  /** First vertex of this edge inside the shared buffer. */
  vertexStart: number;
  vertexCount: number;
};

export function Hyperedge3D() {
  const { stateRef, positionsRef } = useWorld();
  const material = useRef<THREE.ShaderMaterial>(null);
  const junctions = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);

  const { geometry, plans, vertexTotal } = useMemo(() => {
    const plans: EdgePlan[] = [];
    let vertexTotal = 0;

    for (const edge of worldHyperedges) {
      const sources = edge.sourceIds
        .map((id) => layoutIndex.get(id))
        .filter((index): index is number => index !== undefined);
      const targets = edge.targetIds
        .map((id) => layoutIndex.get(id))
        .filter((index): index is number => index !== undefined);
      if (sources.length === 0 || targets.length === 0) continue;

      // Two vertices per leg: every source to the junction, junction to every target.
      const vertexCount = (sources.length + targets.length) * 2;
      plans.push({
        order: edge.order,
        sources,
        targets,
        vertexStart: vertexTotal,
        vertexCount,
      });
      vertexTotal += vertexCount;
    }

    const positions = new Float32Array(vertexTotal * 3);
    const along = new Float32Array(vertexTotal);
    const order = new Float32Array(vertexTotal);
    const colors = new Float32Array(vertexTotal * 3);

    const gold = hexToRgb(WORLD_PALETTE.gold);
    const steel = hexToRgb(WORLD_PALETTE.steel);

    for (const plan of plans) {
      let cursor = plan.vertexStart;
      const tint = plan.order === 1 ? gold : steel;
      const scale = ORDER_OPACITY[plan.order];

      const write = (fromT: number, toT: number) => {
        along[cursor] = fromT;
        along[cursor + 1] = toT;
        for (const slot of [cursor, cursor + 1]) {
          order[slot] = plan.order;
          colors[slot * 3] = tint[0] * scale;
          colors[slot * 3 + 1] = tint[1] * scale;
          colors[slot * 3 + 2] = tint[2] * scale;
        }
        cursor += 2;
      };

      for (let index = 0; index < plan.sources.length; index += 1) write(0, 0.5);
      for (let index = 0; index < plan.targets.length; index += 1) write(0.5, 1);
    }

    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aAlong", new THREE.BufferAttribute(along, 1));
    result.setAttribute("aOrder", new THREE.BufferAttribute(order, 1));
    result.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return { geometry: result, plans, vertexTotal };
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0 }, uReveal: { value: 0 } }),
    [],
  );

  const scratch = useMemo(
    () => ({
      matrix: new THREE.Matrix4(),
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      scale: new THREE.Vector3(),
      color: new THREE.Color(),
    }),
    [],
  );

  useFrame((_, delta) => {
    const positions = positionsRef.current;
    const shader = material.current;
    const geometryPositions = lines.current?.geometry.getAttribute("position") as
      THREE.BufferAttribute | undefined;
    if (!positions || !shader || !geometryPositions) return;

    const state = stateRef.current;
    shader.uniforms.uTime!.value += delta;

    // Hyperedges are the structural reading of the same relationships the routes
    // draw geographically, so they arrive exactly as the routes hand over.
    const strength = Math.max(state.morph, state.chokepoint * 0.7);
    shader.uniforms.uOpacity!.value =
      0.9 * strength * state.presence * (1 - 0.8 * state.horizon);
    shader.uniforms.uReveal!.value = strength;

    const array = geometryPositions.array as Float32Array;

    plans.forEach((plan, planIndex) => {
      let sx = 0;
      let sy = 0;
      let sz = 0;
      for (const index of plan.sources) {
        sx += positions[index * 3]!;
        sy += positions[index * 3 + 1]!;
        sz += positions[index * 3 + 2]!;
      }
      sx /= plan.sources.length;
      sy /= plan.sources.length;
      sz /= plan.sources.length;

      let tx = 0;
      let ty = 0;
      let tz = 0;
      for (const index of plan.targets) {
        tx += positions[index * 3]!;
        ty += positions[index * 3 + 1]!;
        tz += positions[index * 3 + 2]!;
      }
      tx /= plan.targets.length;
      ty /= plan.targets.length;
      tz /= plan.targets.length;

      const jx = (sx + tx) / 2;
      const jy = (sy + ty) / 2;
      const jz = (sz + tz) / 2;

      let cursor = plan.vertexStart;
      const put = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
        array[cursor * 3] = ax;
        array[cursor * 3 + 1] = ay;
        array[cursor * 3 + 2] = az;
        array[(cursor + 1) * 3] = bx;
        array[(cursor + 1) * 3 + 1] = by;
        array[(cursor + 1) * 3 + 2] = bz;
        cursor += 2;
      };

      for (const index of plan.sources) {
        put(
          positions[index * 3]!,
          positions[index * 3 + 1]!,
          positions[index * 3 + 2]!,
          jx,
          jy,
          jz,
        );
      }
      for (const index of plan.targets) {
        put(
          jx,
          jy,
          jz,
          positions[index * 3]!,
          positions[index * 3 + 1]!,
          positions[index * 3 + 2]!,
        );
      }

      const instanced = junctions.current;
      if (instanced) {
        scratch.position.set(jx, jy, jz);
        const size = 0.03 * (0.4 + strength * 0.9);
        scratch.scale.setScalar(size);
        scratch.quaternion.set(0, 0, 0, 1);
        scratch.matrix.compose(scratch.position, scratch.quaternion, scratch.scale);
        instanced.setMatrixAt(planIndex, scratch.matrix);
        const gain = strength * state.presence;
        scratch.color.setRGB(0.73 * gain, 0.64 * gain, 0.42 * gain);
        instanced.setColorAt(planIndex, scratch.color);
      }
    });

    geometryPositions.needsUpdate = true;

    if (junctions.current) {
      junctions.current.instanceMatrix.needsUpdate = true;
      if (junctions.current.instanceColor) junctions.current.instanceColor.needsUpdate = true;
    }
  });

  if (vertexTotal === 0) return null;

  return (
    <group>
      <lineSegments ref={lines} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <instancedMesh
        ref={junctions}
        args={[undefined, undefined, plans.length]}
        frustumCulled={false}
      >
        <torusGeometry args={[1, 0.22, 6, 18]} />
        <meshBasicMaterial
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
