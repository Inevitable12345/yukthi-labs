"use client";

/* eslint-disable react-hooks/immutability --
   three.js is a mutable scene graph, and React Three Fiber's contract is that the
   frame callback writes to it in place. A camera or a group cannot be "returned"
   from a render; the only way to move one is to assign to it. Everything mutated
   here is a three.js object, never React state, and every value assigned is a pure
   function of the scene coordinate — so the mutation carries no history and the
   frame can be recomputed from scroll position alone. */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { cameraAt } from "@/lib/world/state";

import { useWorld } from "./world-state-context";

/* ============================================================================
   CAMERA
   ----------------------------------------------------------------------------
   Restraint, stated as code.

   The camera has no path of its own. Every scene declares a distance, a height
   and a field of view; the rig reads the scene coordinate and damps toward the
   interpolated value. There is no timeline to get out of step, so scrolling back
   returns the exact framing the reader left — and a reader who scrolls quickly
   overtakes the camera rather than fighting it.

   Damping is exponential in real time rather than a fixed fraction per frame, so
   the movement is identical at 60Hz and at 120Hz.
   ========================================================================== */

export function WorldCameraRig({ group }: { group: React.RefObject<THREE.Group | null> }) {
  const { stateRef, quality } = useWorld();
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const viewport = useThree((state) => state.size);

  const current = useRef({ distance: 7.6, height: -1.7, fov: 34, rotationX: 0, rotationY: 0 });

  useFrame((_, delta) => {
    const state = stateRef.current;
    const target = cameraAt(state.t);
    const rig = current.current;

    // Frame-rate independent damping. Slow enough to read as an observatory
    // instrument; fast enough that it is never behind the reader's scroll.
    const k = 1 - Math.exp(-delta * 2.6);

    rig.distance += (target.distance - rig.distance) * k;
    rig.height += (target.height - rig.height) * k;
    rig.fov += (target.fov - rig.fov) * k;
    rig.rotationX += (target.rotationX - rig.rotationX) * k;

    let deltaY = target.rotationY - rig.rotationY;
    while (deltaY > Math.PI) deltaY -= Math.PI * 2;
    while (deltaY < -Math.PI) deltaY += Math.PI * 2;
    rig.rotationY += deltaY * k;

    // On a narrow screen the world is centred and pushed back; on a wide one it
    // sits to the right of the reading column, so the headline is never over it.
    const narrow = viewport.width < 820;
    const distance = rig.distance * (narrow ? 1.28 : 1);
    // The world sits beside the reading column, never under it.
    const offsetX = narrow ? 0 : 0.72;

    camera.position.set(offsetX * 0.3, rig.height * 0.55, distance);
    camera.lookAt(0, rig.height * 0.12, 0);
    if (Math.abs(camera.fov - rig.fov) > 0.01) {
      camera.fov = rig.fov;
      camera.updateProjectionMatrix();
    }

    if (group.current) {
      group.current.rotation.x = rig.rotationX;
      group.current.rotation.y = rig.rotationY;
      group.current.position.x = offsetX;
      // A very slow drift while the world is still a world, so the scene is alive
      // without ever moving on its own account once structure takes over.
      group.current.rotation.y +=
        Math.sin(performance.now() / 26000) *
        0.06 *
        (1 - state.morph) *
        (quality === "high" ? 1 : 0);
    }
  });

  return null;
}
