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
 * Whether this device should be asked to run the WebGL field at all.
 *
 * The scene is an ambient enhancement, not content — the static SVG field carries
 * the same meaning — so the bar for downloading a three-figure-kilobyte renderer
 * is deliberately high. Any one of these disqualifies:
 *
 *   · the reader has asked for reduced data;
 *   · the connection is reported as slow;
 *   · the device reports four cores or fewer;
 *   · the device reports 4 GB of memory or less.
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

  if ((navigator.hardwareConcurrency ?? 8) <= 4) return true;
  if (typeof scope.deviceMemory === "number" && scope.deviceMemory <= 4) return true;

  return false;
}
