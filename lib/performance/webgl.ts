/* ============================================================================
   WEBGL SUPPORT PROBE  (§41)
   ----------------------------------------------------------------------------
   A blank canvas is the one outcome the site never permits. The probe runs once,
   disposes what it created, and the answer decides between the world instrument
   and the fully-narrative SVG fallback.
   ========================================================================== */

export type WebglSupport = "unknown" | "available" | "unavailable";

export function probeWebgl(): WebglSupport {
  if (typeof document === "undefined") return "unknown";
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!context) return "unavailable";
    const lose = (context as WebGLRenderingContext).getExtension?.("WEBGL_lose_context");
    lose?.loseContext?.();
    return "available";
  } catch {
    return "unavailable";
  }
}
