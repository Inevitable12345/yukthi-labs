"use client";

import { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { layoutNodes } from "@/lib/world/layout";
import type { WorldState } from "@/lib/world/state";

import { AnalyticPlane } from "./AnalyticPlane";
import { ChokepointScene } from "./ChokepointScene";
import { EvidencePulse } from "./EvidencePulse";
import { FeedbackLoop3D } from "./FeedbackLoop3D";
import { FragmentField } from "./FragmentField";
import { FutureBranch } from "./FutureBranch";
import { GlobalArc } from "./GlobalArc";
import { HypergraphMorph } from "./HypergraphMorph";
import { LabelProjector, type ProjectedLabel } from "./LabelProjector";
import { RuptureState } from "./RuptureState";
import { SceneLighting } from "./SceneLighting";
import { WorldHorizon } from "./WorldHorizon";
import { WorldCameraRig } from "./WorldCameraRig";
import { WorldSphere } from "./WorldSphere";
import { WorldContext, type WorldQuality } from "./world-state-context";

/* ============================================================================
   THE CANVAS
   ----------------------------------------------------------------------------
   One WebGL context for the whole page, mounted behind the argument and never in
   front of it. It draws thirteen scenes without ever holding thirteen states:
   each layer reads the same scene coordinate and decides what it should look like
   at that value.

   Nothing here is on a timer, and nothing waits for an animation to finish. That
   is what makes the sequence reversible: scrolling up is the same function
   evaluated at a smaller number.
   ========================================================================== */

export function WorldCanvas({
  stateRef,
  scopeRef,
  labelIds,
  labelsRef,
  quality,
  paused,
  onReady,
}: {
  stateRef: React.RefObject<WorldState>;
  scopeRef: React.RefObject<string>;
  labelIds: string[];
  labelsRef: React.RefObject<ProjectedLabel[]>;
  quality: WorldQuality;
  paused: boolean;
  /** Fired once the context exists, so the static rendering can hand over. */
  onReady?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const positionsRef = useRef<Float32Array>(new Float32Array(layoutNodes.length * 3));

  const context = useMemo(
    () => ({ stateRef, quality, positionsRef, scopeRef }),
    [stateRef, quality, scopeRef],
  );

  return (
    <Canvas
      dpr={[1, quality === "high" ? 1.7 : 1.25]}
      gl={{
        antialias: quality === "high",
        alpha: true,
        powerPreference: "low-power",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, -0.85, 6.4], fov: 34, near: 0.1, far: 60 }}
      // A hidden tab or an unavailable layer costs nothing: on demand means no
      // frame is drawn until something asks for one.
      frameloop={paused ? "demand" : "always"}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
        onReady?.();
      }}
    >
      {/* The provider sits inside the canvas: React Three Fiber renders into its
          own reconciler root, so context from the DOM tree does not cross it. */}
      <WorldContext.Provider value={context}>
        <SceneLighting />
        <WorldHorizon />

        <group ref={group}>
          <FragmentField />
          <WorldSphere />
          <GlobalArc variant="stable" />
          <GlobalArc variant="changed" />
          <RuptureState />
          <ChokepointScene />
          <EvidencePulse />
          <HypergraphMorph />
          <FeedbackLoop3D />
          <AnalyticPlane />
          <FutureBranch />
          <LabelProjector ids={labelIds} labelsRef={labelsRef} group={group} />
        </group>

        <WorldCameraRig group={group} />
      </WorldContext.Provider>
    </Canvas>
  );
}
