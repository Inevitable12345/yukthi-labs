"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { layoutIndex } from "@/lib/world/layout";

import { useWorld } from "./world-state-context";

export type ProjectedLabel = {
  /** Viewport fraction, 0 … 1. */
  x: number;
  y: number;
  /** 0 when behind the globe or outside the frame. */
  opacity: number;
};

/**
 * Projects a handful of node positions into screen space each frame.
 *
 * Labels are DOM, not canvas: real text, at real font sizes, in the page's own
 * typeface, selectable by the browser's find and legible at 200% zoom. The only
 * thing WebGL contributes is where to put them.
 *
 * A label is hidden when its node passes behind the sphere, so a name never
 * floats over the far side of the world it belongs to.
 */
export function LabelProjector({
  ids,
  labelsRef,
  group,
}: {
  ids: string[];
  labelsRef: React.RefObject<ProjectedLabel[]>;
  /** The rotating world group, so labels follow the framing the rig applies. */
  group: React.RefObject<THREE.Group | null>;
}) {
  const { stateRef, positionsRef } = useWorld();
  const camera = useThree((state) => state.camera);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const cameraPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const positions = positionsRef.current;
    const labels = labelsRef.current;
    if (!positions || !labels) return;

    const state = stateRef.current;
    camera.getWorldPosition(cameraPosition);

    for (let slot = 0; slot < ids.length; slot += 1) {
      const target = labels[slot];
      if (!target) continue;

      const index = layoutIndex.get(ids[slot]!);
      if (index === undefined) {
        target.opacity = 0;
        continue;
      }

      const offset = index * 3;
      scratch.set(positions[offset]!, positions[offset + 1]!, positions[offset + 2]!);
      // The rig rotates and offsets the world group, so model space is not world
      // space. Ask the group where the node actually ended up.
      group.current?.localToWorld(scratch);

      // Occlusion: a node on the far side of the sphere is behind it.
      const toCamera = cameraPosition.clone().sub(scratch).normalize();
      const facing = scratch.clone().normalize().dot(toCamera);
      const occluded = state.morph < 0.5 && facing < 0.12;

      scratch.project(camera);

      const x = (scratch.x + 1) / 2;
      const y = (1 - scratch.y) / 2;

      const inFrame = scratch.z < 1 && x > -0.02 && x < 1.02 && y > 0.08 && y < 0.94;
      // The reading column owns the left of the viewport. A label that would land
      // in it is not moved or shrunk — it is simply not shown, because the text in
      // front is the argument and this is an inscription on the instrument.
      const clearOfText = x > 0.6;

      target.x = x;
      target.y = y;
      target.opacity =
        !inFrame || occluded || !clearOfText ? 0 : state.presence * (1 - state.horizon);
    }
  });

  return null;
}
