"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useReducedMotion } from "@/lib/accessibility/use-reduced-motion";
import { useDeviceTier } from "@/lib/performance/use-device-tier";
import { useWebglSupport } from "@/lib/performance/use-webgl";
import { WorldFallback } from "./WorldFallback";
import { WorldSettingsProvider } from "./world-context";

/**
 * WebGL enters the bundle only after the probe says it can run (§38, §41). The
 * placeholder is the grid field, never an empty rectangle — a blank canvas is
 * the one failure state this site does not permit.
 */
const WorldCanvas = dynamic(() => import("./WorldCanvas"), {
  ssr: false,
  loading: () => null,
});

export function WorldStage() {
  const support = useWebglSupport();
  const reducedMotion = useReducedMotion();
  const { budget } = useDeviceTier();
  const settings = useMemo(() => ({ budget, reducedMotion }), [budget, reducedMotion]);

  return (
    <div
      data-print-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      <div className="grid-field absolute inset-0 opacity-[0.28]" aria-hidden="true" />
      {/* A vignette that keeps the field from competing with body text. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-void)_30%,transparent)_0%,color-mix(in_srgb,var(--color-void)_74%,transparent)_46%,var(--color-void)_86%)]"
      />
      <div className="absolute inset-0" aria-hidden={support === "available" ? "true" : undefined}>
        {support === "available" ? (
          <WorldSettingsProvider value={settings}>
            <WorldCanvas />
          </WorldSettingsProvider>
        ) : support === "unavailable" ? (
          <div className="h-full w-full opacity-70">
            <WorldFallback />
          </div>
        ) : null}
      </div>
    </div>
  );
}
