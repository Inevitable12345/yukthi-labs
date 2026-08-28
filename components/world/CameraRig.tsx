"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ROOM_BY_ID } from "@/lib/story/chapters";
import { getSnapshot, readProgress } from "@/lib/story/store";
import { CAMERA_POSES, damp } from "@/lib/world/camera";
import { useWorldSettings } from "./world-context";

/**
 * Moves the camera between the seven poses of §35.
 *
 * Damped rather than keyframed: the camera is always travelling toward the
 * pose the current room asks for, so scrolling backwards is not a special case
 * and a fast scroll never queues a backlog of animation.
 */
export function CameraRig() {
  const { reducedMotion } = useWorldSettings();
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const snapshot = getSnapshot();
    const room = ROOM_BY_ID[snapshot.chapter];
    const pose = CAMERA_POSES[room.camera];
    const within = readProgress(snapshot.chapter);

    // Reduced motion keeps the poses but removes the travel through them.
    const lambda = reducedMotion ? 26 : 1.5;
    const dolly = reducedMotion ? 0 : pose.dolly * within;

    camera.position.set(
      damp(camera.position.x, pose.position[0], lambda, delta),
      damp(camera.position.y, pose.position[1], lambda, delta),
      damp(camera.position.z, pose.position[2] + dolly, lambda, delta),
    );

    target.current.set(
      damp(target.current.x, pose.target[0], lambda, delta),
      damp(target.current.y, pose.target[1], lambda, delta),
      damp(target.current.z, pose.target[2], lambda, delta),
    );

    camera.lookAt(target.current);
  });

  return null;
}
