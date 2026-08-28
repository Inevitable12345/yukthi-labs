/* ============================================================================
   CAMERA GRAMMAR  (§35)
   ----------------------------------------------------------------------------
   Seven positions, one per mode. No orbiting for its own sake, no shake, no
   flythrough, and a field of view held at 38° throughout — wide enough to hold
   the system, narrow enough that nothing distorts at the edges.
   ========================================================================== */

import type { CameraMode } from "@/lib/story/chapters";

export type CameraPose = {
  position: [number, number, number];
  target: [number, number, number];
  /** Extra distance applied across the room's scroll progress. */
  dolly: number;
};

export const CAMERA_POSES: Record<CameraMode, CameraPose> = {
  far: { position: [0, 0.7, 9.6], target: [0, 0, 0], dolly: -0.9 },
  macro: { position: [1.1, 0.15, 3.7], target: [0.35, -0.1, 0], dolly: -0.5 },
  deep: { position: [0, 0.1, 6.1], target: [0, 0, 0], dolly: -0.8 },
  flat: { position: [0, 7.9, 0.9], target: [0, 0, 0], dolly: -1.2 },
  abstract: { position: [0, 0.2, 7.3], target: [0, 0, 0], dolly: -0.7 },
  focus: { position: [2.0, 0.5, 5.4], target: [-0.3, 0, 0], dolly: -0.4 },
  pullback: { position: [0, 1.0, 8.5], target: [0, 0.3, 0], dolly: 6.4 },
};

export const FIELD_OF_VIEW = 38;

/** Frame-rate independent damping. `lambda` is the convergence rate per second. */
export function damp(current: number, goal: number, lambda: number, delta: number): number {
  return current + (goal - current) * (1 - Math.exp(-lambda * delta));
}
