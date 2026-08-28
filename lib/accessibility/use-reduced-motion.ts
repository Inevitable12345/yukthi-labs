"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window.matchMedia !== "function") return () => {};
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks `prefers-reduced-motion` (§40).
 *
 * Read through `useSyncExternalStore` rather than an effect, so the value is
 * correct on the first client render instead of one frame late — a motion
 * preference that arrives after the first animation has started is not a
 * preference that was honoured.
 *
 * Every consumer treats the reduced case as *fewer moving parts*, never as
 * *less argument*: diagrams, evidence and the scenario interaction all survive.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
