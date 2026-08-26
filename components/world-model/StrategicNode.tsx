"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { layoutNodes, nodeIntensity, perturbationAt } from "@/lib/world/layout";
import { NODE_COLOR, WORLD_PALETTE, hexToRgb } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   NODES
   ----------------------------------------------------------------------------
   One instanced octahedron per node — a cut stone rather than a dot, so the node
   catches the key light and reads as an object with a position in space.

   Geographic nodes and structure-only nodes are drawn by the same component
   because they are the same kind of thing to the model. The only difference is
   where they start: a place, or the centre of the field.
   ========================================================================== */

const scratchMatrix = new THREE.Matrix4();
const scratchPosition = new THREE.Vector3();
const scratchQuaternion = new THREE.Quaternion();
const scratchScale = new THREE.Vector3();
const scratchColor = new THREE.Color();
const RUPTURE = hexToRgb(WORLD_PALETTE.rupture);

export function StrategicNode({ subset }: { subset: "geographic" | "structural" }) {
  const { stateRef, positionsRef, scopeRef, quality } = useWorld();
  const mesh = useRef<THREE.InstancedMesh>(null);

  const nodes = useMemo(
    () =>
      layoutNodes
        .map((node, index) => ({ node, index }))
        .filter(({ node }) => (subset === "geographic" ? !node.causalOnly : node.causalOnly)),
    [subset],
  );

  const baseColors = useMemo(
    () => nodes.map(({ node }) => hexToRgb(NODE_COLOR[node.kind])),
    [nodes],
  );

  useFrame((_, delta) => {
    const instanced = mesh.current;
    const positions = positionsRef.current;
    if (!instanced || !positions) return;

    const state = stateRef.current;
    const scope = scopeRef.current;
    const time = performance.now() / 1000;

    for (let slot = 0; slot < nodes.length; slot += 1) {
      const { node, index } = nodes[slot]!;
      const offset = index * 3;
      const intensity = nodeIntensity(node, state, scope);

      scratchPosition.set(positions[offset]!, positions[offset + 1]!, positions[offset + 2]!);

      // A slow breath on the lit nodes only. Latent structure holds still.
      const breath = intensity > 0.6 ? 1 + Math.sin(time * 0.9 + index) * 0.07 : 1;
      const size = (node.waypoint ? 0.0145 : 0.021) * (0.55 + intensity * 0.85) * breath;
      scratchScale.setScalar(size);
      scratchQuaternion.set(0, 0, 0, 1);

      scratchMatrix.compose(scratchPosition, scratchQuaternion, scratchScale);
      instanced.setMatrixAt(slot, scratchMatrix);

      // Under a simulated intervention the affected states are drawn in rupture
      // red — the same encoding the diagrams use for a changed or broken relation,
      // so the colour means the same thing here as it does there.
      const perturbation = perturbationAt(node, state);
      const [r, g, b] = baseColors[slot]!;
      const gain = Math.min(1.35, intensity * 1.25);
      scratchColor.setRGB(
        (r + (RUPTURE[0] - r) * perturbation) * gain,
        (g + (RUPTURE[1] - g) * perturbation) * gain,
        (b + (RUPTURE[2] - b) * perturbation) * gain,
      );
      instanced.setColorAt(slot, scratchColor);
    }

    instanced.instanceMatrix.needsUpdate = true;
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;

    // Keep the glyphs square to the camera-facing axis without billboarding them
    // outright: a slow, shared rotation reads as a measurement, not as a spin.
    instanced.rotation.y += delta * 0.12 * (1 - state.horizon);
  });

  if (nodes.length === 0) return null;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
      <octahedronGeometry args={[1, quality === "high" ? 1 : 0]} />
      <meshBasicMaterial
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
