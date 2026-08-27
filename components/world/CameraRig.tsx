"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { CAMERA, CAMERA_APPROACH } from "@/lib/world/camera";
import { damp } from "@/lib/story/store";
import { storyStore } from "@/lib/story/store";

/**
 * The camera, placed rather than flown (§24).
 *
 * Reads the camera mode from the story store every frame and eases toward that
 * keyframe. Because the target is a fixed keyframe rather than an accumulated
 * offset, scrolling back up returns the camera to exactly where it was.
 *
 * Under reduced motion the rig snaps to each keyframe and applies no drift:
 * the composition is identical, the travel is not.
 */
export function CameraRig({ still = false }: { still?: boolean }) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const settled = useRef(false);

  useFrame((_, delta) => {
    const { camera: mode } = storyStore.read();
    const keyframe = CAMERA[mode];

    // Guard against a long first frame (tab restore, chunk parse) producing a
    // huge damp step that looks like a jump cut.
    const step = Math.min(delta, 1 / 20);

    if (still || !settled.current) {
      camera.position.set(keyframe.position.x, keyframe.position.y, keyframe.position.z);
      target.current.set(keyframe.target.x, keyframe.target.y, keyframe.target.z);
      camera.fov = keyframe.fov;
      camera.updateProjectionMatrix();
      settled.current = true;
      camera.lookAt(target.current);
      return;
    }

    const drift = keyframe.drift;
    const clock = performance.now() / 1000;

    camera.position.x = damp(
      camera.position.x,
      keyframe.position.x + Math.sin(clock * 0.11) * drift,
      CAMERA_APPROACH,
      step,
    );
    camera.position.y = damp(
      camera.position.y,
      keyframe.position.y + Math.cos(clock * 0.09) * drift * 0.6,
      CAMERA_APPROACH,
      step,
    );
    camera.position.z = damp(camera.position.z, keyframe.position.z, CAMERA_APPROACH, step);

    target.current.x = damp(target.current.x, keyframe.target.x, CAMERA_APPROACH, step);
    target.current.y = damp(target.current.y, keyframe.target.y, CAMERA_APPROACH, step);
    target.current.z = damp(target.current.z, keyframe.target.z, CAMERA_APPROACH, step);

    const nextFov = damp(camera.fov, keyframe.fov, CAMERA_APPROACH, step);
    if (Math.abs(nextFov - camera.fov) > 0.001) {
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }

    camera.lookAt(target.current);
  });

  return null;
}
