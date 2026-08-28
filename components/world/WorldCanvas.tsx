"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { FIELD_OF_VIEW } from "@/lib/world/camera";
import { CameraRig } from "./CameraRig";
import { WorldInstrument } from "./WorldInstrument";
import { useWorldSettings } from "./world-context";

/**
 * The WebGL surface. Loaded only through `next/dynamic` with `ssr: false`, so
 * three.js never enters the server bundle or the first paint (§38).
 */
export default function WorldCanvas() {
  const { budget } = useWorldSettings();

  return (
    <Canvas
      dpr={[1, budget.maxDpr]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: FIELD_OF_VIEW, near: 0.1, far: 60, position: [0, 0.7, 9.6] }}
      // Interaction lives entirely in the DOM. Nothing in the WebGL layer is
      // clickable, which is what lets it be `aria-hidden` without loss (§42).
      style={{ pointerEvents: "none" }}
      frameloop="always"
    >
      <CameraRig />
      <WorldInstrument />
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      <Preload all />
    </Canvas>
  );
}
