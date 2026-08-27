/* ============================================================================
   DEVICE CAPABILITY (§31, §32)
   ----------------------------------------------------------------------------
   Every expensive decision on this site routes through this module, so the rules
   are stated once and can be tested without a browser.

   The principle: the argument is carried by the DOM. WebGL is an enhancement
   that must earn its place on each device, and is skipped without apology where
   it would not run well.
   ========================================================================== */

export type PerformanceTier = "none" | "reduced" | "standard" | "full";

export type CapabilityInput = {
  webgl: boolean;
  reducedMotion: boolean;
  /** navigator.hardwareConcurrency, when exposed. */
  cores?: number;
  /** navigator.deviceMemory in GB, when exposed. */
  memory?: number;
  /** Viewport width in CSS pixels. */
  width: number;
  /** True for coarse pointers — phones and tablets. */
  coarsePointer: boolean;
  /** Save-Data header equivalent. */
  saveData?: boolean;
};

/**
 * Resolve a rendering tier from device signals.
 *
 * Pure, so the policy is unit-tested rather than trusted:
 *   none      no WebGL at all — SVG world, full content parity
 *   reduced   static WebGL or SVG; no camera travel, no idle motion
 *   standard  full scene at lower node counts and capped DPR
 *   full      everything
 */
export function resolveTier(input: CapabilityInput): PerformanceTier {
  if (!input.webgl) return "none";
  if (input.reducedMotion) return "reduced";
  if (input.saveData) return "reduced";

  const cores = input.cores ?? 4;
  const memory = input.memory ?? 4;

  // Deliberately conservative: a phone that *can* run the scene still should not,
  // because sustained WebGL is what drains a battery and throttles a device.
  if (input.width < 768 || (input.coarsePointer && input.width < 1024)) {
    return cores >= 8 && memory >= 4 ? "standard" : "reduced";
  }

  if (cores <= 4 || memory <= 4) return "standard";

  return "full";
}

/** Node/particle budget per tier. Read by the world layer, never hard-coded there. */
export const TIER_BUDGET: Record<
  PerformanceTier,
  { nodes: number; arcs: number; particles: number; dpr: [number, number]; labels: number }
> = {
  none: { nodes: 0, arcs: 0, particles: 0, dpr: [1, 1], labels: 0 },
  reduced: { nodes: 90, arcs: 60, particles: 0, dpr: [1, 1.25], labels: 4 },
  standard: { nodes: 180, arcs: 150, particles: 260, dpr: [1, 1.5], labels: 6 },
  full: { nodes: 320, arcs: 280, particles: 620, dpr: [1, 2], labels: 9 },
};

/** Feature-detects WebGL without leaking the probe context. */
export function detectWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!context) return false;

    // Release the probe immediately; browsers cap live contexts per page and the
    // real canvas must not be denied one because of this check.
    const lose = (context as WebGLRenderingContext).getExtension?.("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function readCapabilityInput(): CapabilityInput {
  if (typeof window === "undefined") {
    return { webgl: false, reducedMotion: true, width: 1280, coarsePointer: false };
  }

  const navigatorWithHints = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  return {
    webgl: detectWebGL(),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    cores: navigator.hardwareConcurrency,
    memory: navigatorWithHints.deviceMemory,
    width: window.innerWidth,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    saveData: navigatorWithHints.connection?.saveData,
  };
}
