"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { CausalFieldStatic } from "./CausalFieldStatic";
import { hasWebGL, prefersLightweightRendering } from "@/lib/utils/webgl";
import { usePrefersReducedMotion } from "@/lib/utils/use-reduced-motion";
import { useInView } from "@/lib/utils/use-in-view";
import { cn } from "@/lib/utils/cn";

const CausalFieldScene = dynamic(
  () => import("./CausalFieldScene").then((module) => module.CausalFieldScene),
  { ssr: false, loading: () => null },
);

/**
 * Progressive enhancement for the field.
 *
 * The static SVG renders on the server and stays visible until — and unless — the
 * WebGL scene is both possible and warranted. Nothing waits on the 3D chunk: it is
 * imported after paint, only when the field is on screen, and it is skipped
 * entirely without WebGL, on a low-powered device, or under reduced motion.
 *
 * The one line of loading copy is shown only while the scene is genuinely
 * resolving, and never as a decorative delay.
 */
export function CausalField({
  intensity = 0.55,
  className,
  staticCount = 90,
  sceneCount = 220,
  label = "Resolving causal field",
}: {
  intensity?: number;
  className?: string;
  staticCount?: number;
  sceneCount?: number;
  label?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px", once: false });
  const reducedMotion = usePrefersReducedMotion();
  const [enhance, setEnhance] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (!hasWebGL() || prefersLightweightRendering()) return;
    // Yield to first paint before deciding to load a 3D chunk.
    const id = window.setTimeout(() => setEnhance(true), 400);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enhance) return;
    const id = window.setTimeout(() => setSceneReady(true), 900);
    return () => window.clearTimeout(id);
  }, [enhance]);

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: sceneReady ? 0 : 1 }}
      >
        <CausalFieldStatic count={staticCount} intensity={intensity} />
      </div>

      {enhance ? (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: sceneReady ? 1 : 0 }}
        >
          <CausalFieldScene count={sceneCount} intensity={intensity} paused={!inView} />
        </div>
      ) : null}

      {enhance && !sceneReady ? (
        <p className="absolute bottom-6 left-6 font-mono text-[0.5625rem] tracking-[0.24em] text-dim-bone uppercase">
          {label}
        </p>
      ) : null}
    </div>
  );
}
