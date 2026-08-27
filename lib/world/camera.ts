import type { CameraMode } from "@/lib/story/chapters";
import type { Vec3 } from "./geometry";

/* ============================================================================
   CAMERA GRAMMAR (§24)
   ----------------------------------------------------------------------------
   Camera movement communicates intellectual scale. Each mode is a fixed
   position, target and field of view — the camera is *placed*, never flown.

   Explicitly avoided: gaming flythroughs, constant rotation, shake, large FOV
   swings, and anything that reads as motion for its own sake. The largest
   movement in the whole narrative is the finale pullback, and it is slow.
   ========================================================================== */

export type CameraKeyframe = {
  position: Vec3;
  target: Vec3;
  fov: number;
  /**
   * Amplitude of the drift applied while the camera is at rest, in world units.
   * Small enough to keep the scene alive, small enough never to be noticed as
   * movement. Zero under reduced motion.
   */
  drift: number;
};

export const CAMERA: Record<CameraMode, CameraKeyframe> = {
  /** Global argument — the whole system, held at a distance. */
  far: {
    position: { x: 0, y: 0.35, z: 5.2 },
    target: { x: 0, y: 0, z: 0 },
    fov: 38,
    drift: 0.05,
  },

  /** Chokepoint — close enough to read one node and what depends on it. */
  close: {
    position: { x: 0.9, y: 0.7, z: 2.75 },
    target: { x: 0, y: 0.15, z: 0 },
    fov: 34,
    drift: 0.03,
  },

  /** Interaction — a layered orbit that reveals depth between strata. */
  orbit: {
    position: { x: -1.85, y: 0.55, z: 4.1 },
    target: { x: 0, y: -0.05, z: 0 },
    fov: 40,
    drift: 0.07,
  },

  /** Structural break — the world flattens into an analytical plane. */
  flatten: {
    position: { x: 0, y: 0.1, z: 4.6 },
    target: { x: 0, y: 0, z: 0 },
    fov: 30,
    drift: 0.015,
  },

  /** The reveal — abstract graph space. No horizon, no ground. */
  abstract: {
    position: { x: 0.35, y: 0.25, z: 4.35 },
    target: { x: 0, y: -0.1, z: 0 },
    fov: 42,
    drift: 0.045,
  },

  /** Finale — a slow pullback that does not return to where it began. */
  pullback: {
    position: { x: 0, y: 0.9, z: 7.4 },
    target: { x: 0, y: -0.2, z: 0.4 },
    fov: 44,
    drift: 0.06,
  },
};

/**
 * How quickly the camera approaches a new keyframe, per second.
 *
 * Deliberately slow. The camera should feel like a heavy instrument being
 * repositioned, and it should still be settling as the reader finishes the
 * paragraph that prompted the move.
 */
export const CAMERA_APPROACH = 1.15;
