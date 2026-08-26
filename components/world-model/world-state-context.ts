"use client";

import { createContext, useContext } from "react";

import type { WorldState } from "@/lib/world/state";

/** Rendering budget. Chosen once from viewport and device, never per frame. */
export type WorldQuality = "high" | "low";

export type WorldContextValue = {
  /** The single source of scene truth. Read in `useFrame`; never in render. */
  stateRef: React.RefObject<WorldState>;
  quality: WorldQuality;
  /** Node positions for the current frame, morphed between globe and structure. */
  positionsRef: React.RefObject<Float32Array>;
  /** Decision scope currently selected in Act 09. */
  scopeRef: React.RefObject<string>;
};

export const WorldContext = createContext<WorldContextValue | null>(null);

export function useWorld(): WorldContextValue {
  const value = useContext(WorldContext);
  if (!value) throw new Error("World layers must render inside <WorldCanvas>.");
  return value;
}
