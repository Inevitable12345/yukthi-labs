"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { layoutIndex } from "@/lib/world/layout";
import { WORLD_PALETTE } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   FEEDBACK CASCADE
   ----------------------------------------------------------------------------
   Six states in a closed ring, anchored above the interconnection they describe.

   Two things are being shown. First that the loop closes — the sixth state is the
   second one again, which is what makes it a cascade rather than a chain. Second
   that it tightens: each pass around the ring is faster and smaller than the last,
   because each degradation shortens the window for the next intervention.

   The stages are the ones in the February 2021 record, in order.
   ========================================================================== */

const STAGE_COUNT = 6;

export function FeedbackLoop3D() {
  const { stateRef, positionsRef } = useWorld();
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.LineSegments>(null);
  const stages = useRef<THREE.InstancedMesh>(null);
  const pulse = useRef<THREE.Mesh>(null);

  const anchorIndex = useMemo(() => layoutIndex.get("ercot"), []);

  const scratch = useMemo(
    () => ({
      centre: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      up: new THREE.Vector3(0, 0, 1),
      quaternion: new THREE.Quaternion(),
      matrix: new THREE.Matrix4(),
      position: new THREE.Vector3(),
      scale: new THREE.Vector3(),
      colour: new THREE.Color(),
    }),
    [],
  );

  const ringGeometry = useMemo(() => {
    const values: number[] = [];
    const resolution = 96;
    for (let step = 0; step < resolution; step += 1) {
      const a = (step / resolution) * Math.PI * 2;
      const b = ((step + 1) / resolution) * Math.PI * 2;
      // A deliberate gap at the top: the loop is drawn as returning, not closed
      // shut, so the direction of travel stays legible.
      if (step > resolution - 5) continue;
      values.push(Math.cos(a), Math.sin(a), 0, Math.cos(b), Math.sin(b), 0);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(values, 3));
    return geometry;
  }, []);

  useFrame(() => {
    const state = stateRef.current;
    const positions = positionsRef.current;
    if (!group.current || !positions || anchorIndex === undefined) return;

    const strength = state.feedback;
    group.current.visible = strength > 0.01;
    if (!group.current.visible) return;

    const offset = anchorIndex * 3;
    scratch.centre.set(positions[offset]!, positions[offset + 1]!, positions[offset + 2]!);
    scratch.normal.copy(scratch.centre).normalize();
    group.current.position.copy(scratch.centre).addScaledVector(scratch.normal, 0.34);
    scratch.quaternion.setFromUnitVectors(scratch.up, scratch.normal);
    group.current.quaternion.copy(scratch.quaternion);

    // The loop tightens as it runs. Radius is a function of scene progress only,
    // so scrolling back up loosens it again by the same law.
    const radius = 0.46 - 0.16 * strength;
    group.current.scale.setScalar(radius);

    const ringMaterial = ring.current?.material as THREE.LineBasicMaterial | undefined;
    if (ringMaterial) ringMaterial.opacity = 0.55 * strength * state.presence;

    const time = performance.now() / 1000;
    // Each pass is faster than the last: reinforcement, drawn as tempo.
    const angle = time * (0.55 + strength * 0.75);

    if (pulse.current) {
      pulse.current.position.set(Math.cos(angle), Math.sin(angle), 0);
      pulse.current.scale.setScalar(0.075);
      const material = pulse.current.material as THREE.MeshBasicMaterial;
      material.opacity = strength * state.presence;
    }

    const instanced = stages.current;
    if (instanced) {
      for (let index = 0; index < STAGE_COUNT; index += 1) {
        const stageAngle = (index / STAGE_COUNT) * Math.PI * 2;
        scratch.position.set(Math.cos(stageAngle), Math.sin(stageAngle), 0);
        scratch.scale.setScalar(0.055);
        scratch.matrix.compose(scratch.position, new THREE.Quaternion(), scratch.scale);
        instanced.setMatrixAt(index, scratch.matrix);

        // A stage brightens as the pulse reaches it and stays warm behind it.
        const distance = Math.abs(
          (((angle % (Math.PI * 2)) - stageAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI,
        );
        const hit = Math.max(0, 1 - distance / 0.9);
        const gain = strength * (0.35 + hit * 0.9) * state.presence;
        scratch.colour.setRGB(0.79 * gain, 0.41 * gain, 0.37 * gain);
        instanced.setColorAt(index, scratch.colour);
      }
      instanced.instanceMatrix.needsUpdate = true;
      if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={group} visible={false}>
      <lineSegments ref={ring} geometry={ringGeometry}>
        <lineBasicMaterial
          color={WORLD_PALETTE.ruptureDeep}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <instancedMesh
        ref={stages}
        args={[undefined, undefined, STAGE_COUNT]}
        frustumCulled={false}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>

      <mesh ref={pulse}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={WORLD_PALETTE.rupture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
