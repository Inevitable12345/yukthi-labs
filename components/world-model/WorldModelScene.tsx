"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import { labelNodesForScene } from "@/lib/world/layout";
import { WORLD_SCENES } from "@/lib/world/state";
import { SCOPE_EVENT, useSceneProgress } from "@/lib/world/use-scene-progress";
import {
  hasWebGL,
  prefersLightweightRendering,
  prefersReducedComplexity,
} from "@/lib/utils/webgl";
import { usePrefersReducedMotion } from "@/lib/utils/use-reduced-motion";
import { scenarios } from "@/data/scenarios";

import { ReducedMotionWorld } from "./ReducedMotionWorld";
import { WorldFallback } from "./WorldFallback";
import { WorldLabels } from "./WorldLabels";
import type { ProjectedLabel } from "./LabelProjector";
import type { WorldQuality } from "./world-state-context";

const WorldCanvas = dynamic(
  () => import("./WorldCanvas").then((module) => module.WorldCanvas),
  { ssr: false, loading: () => null },
);

/* ============================================================================
   THE WORLD CAUSAL OBSERVATORY
   ----------------------------------------------------------------------------
   The homepage's ground layer: one continuous world behind thirteen scenes,
   pinned to the sections of the argument in front of it.

   Order of precedence, and it is deliberate:

     1. the argument — the acts render as static HTML and are complete without
        this layer, without JavaScript, and without WebGL;
     2. the static world — server-rendered SVG, present in the first byte, the
        only rendering under reduced motion or on a device that should not be
        asked to run a renderer;
     3. the WebGL world — loaded after paint, on capable devices only, and only
        because it can show a transformation that a static drawing cannot: a map
        becoming a causal structure.

   The layer never captures a scroll, never traps focus, never receives a pointer
   event, and never carries information that is not also written down.
   ========================================================================== */

export function WorldModelScene() {
  const reducedMotion = usePrefersReducedMotion();
  const { stateRef, index, ready } = useSceneProgress();

  // One decision, taken once: whether to run a renderer at all, and how hard.
  const [render, setRender] = useState<{ enhance: boolean; quality: WorldQuality }>({
    enhance: false,
    quality: "high",
  });
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const { enhance, quality } = render;

  const scopeRef = useRef<string>(scenarios[0]!.id);
  const labelsRef = useRef<ProjectedLabel[]>([]);

  const scene = WORLD_SCENES[index] ?? WORLD_SCENES[0]!;
  const labelIds = useMemo(
    () => labelNodesForScene(scene.id, scene.focus, 4).map((node) => node.id),
    [scene],
  );

  // The projection targets are plain objects, allocated once per scene and then
  // written in place by the frame loop.
  useEffect(() => {
    labelsRef.current = labelIds.map(() => ({ x: 0.5, y: 0.5, opacity: 0 }));
  }, [labelIds]);

  useEffect(() => {
    const onScope = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string") scopeRef.current = detail;
    };
    window.addEventListener(SCOPE_EVENT, onScope);
    return () => window.removeEventListener(SCOPE_EVENT, onScope);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (!hasWebGL() || prefersLightweightRendering()) return;

    // Yield to the first paint. The headline outranks the scene, and the scene
    // must never be on the critical path to it.
    const id = window.setTimeout(
      () => setRender({ enhance: true, quality: prefersReducedComplexity() ? "low" : "high" }),
      450,
    );
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enhance) return;
    const onVisibility = () => setPaused(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enhance]);

  const status: "resolving" | "live" | "static" = live
    ? "live"
    : enhance
      ? "resolving"
      : "static";

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: live ? 0 : reducedMotion ? 0.5 : 0.62 }}
        >
          {reducedMotion ? (
            <ReducedMotionWorld index={index} />
          ) : (
            <WorldFallback index={index} />
          )}
        </div>

        {enhance && ready ? (
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            // The layer is ground, not figure: it never renders at full strength.
            style={{ opacity: live ? 0.78 : 0 }}
          >
            <WorldCanvas
              stateRef={stateRef}
              scopeRef={scopeRef}
              labelIds={labelIds}
              labelsRef={labelsRef}
              quality={quality}
              paused={paused}
              onReady={() => setLive(true)}
            />
          </div>
        ) : null}

        {/* A scrim, so text is read against a settled ground rather than against
            whatever the scene happens to be doing underneath it. */}
        <div className="u-vignette absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_30%,rgba(7,8,8,0.62)_100%)]" />

        <WorldLabels
          index={index}
          labelIds={labelIds}
          labelsRef={labelsRef}
          stateRef={stateRef}
          status={status}
        />
      </div>

      {/* The same sequence, in words. Published for anyone who cannot see the
          layer, and for anyone who would simply rather read it. */}
      <div className="u-sr-only">
        <h2>The world layer, described</h2>
        <p>
          A single world model runs behind this page, in thirteen states, one for each section
          of the argument. It carries no information that is not also written in the sections
          themselves.
        </p>
        <ol>
          {WORLD_SCENES.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.label}.</strong> {entry.textAlternative}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
