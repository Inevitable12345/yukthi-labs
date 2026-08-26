/**
 * WebGL capability probe.
 *
 * Runs once, caches, and never throws. A machine that cannot render the field
 * still gets the argument — the static constellation carries the same meaning.
 */
let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    cached = Boolean(context);
  } catch {
    cached = false;
  }

  return cached;
}

/**
 * Whether this device should be asked to run a WebGL scene at all.
 *
 * The world layer is an enhancement, never content — the server-rendered SVG
 * world carries the same argument — so a device that would struggle is simply
 * never asked. Any one of these disqualifies:
 *
 *   · the reader has asked for reduced data;
 *   · the connection is reported as slower than 4g;
 *   · the device reports two cores or fewer;
 *   · the device reports 2 GB of memory or less.
 *
 * Devices between that floor and a comfortable desktop are not excluded — they
 * are served the reduced-complexity tier below, which is the honest reading of
 * "lower complexity on weak devices" rather than "no world on weak devices".
 *
 * Unknown values are treated as capable, since most desktop browsers do not
 * expose `deviceMemory` or `connection` at all.
 */
export function prefersLightweightRendering(): boolean {
  if (typeof navigator === "undefined") return true;

  const scope = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };

  if (scope.connection?.saveData) return true;

  const effectiveType = scope.connection?.effectiveType;
  if (effectiveType && effectiveType !== "4g") return true;

  if ((navigator.hardwareConcurrency ?? 8) <= 2) return true;
  if (typeof scope.deviceMemory === "number" && scope.deviceMemory <= 2) return true;

  return false;
}

/**
 * Whether the scene should run at reduced complexity: fewer nodes, a coarser
 * graticule, fewer landmass samples, a lower device-pixel-ratio ceiling.
 *
 * Separate from the check above because the two questions are different. That one
 * asks whether to render at all; this one asks how much to render.
 */
export function prefersReducedComplexity(): boolean {
  if (typeof navigator === "undefined") return true;

  const scope = navigator as Navigator & { deviceMemory?: number };

  if ((navigator.hardwareConcurrency ?? 8) <= 6) return true;
  if (typeof scope.deviceMemory === "number" && scope.deviceMemory <= 4) return true;
  if (typeof window !== "undefined" && window.innerWidth < 820) return true;

  return false;
}
