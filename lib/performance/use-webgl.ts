"use client";

import { useSyncExternalStore } from "react";
import { probeWebgl, type WebglSupport } from "./webgl";

/**
 * The probe is destructive-ish — it creates a context and immediately loses it
 * — so it runs once per document and the answer is cached for every consumer.
 */
let cached: WebglSupport | null = null;

function getSnapshot(): WebglSupport {
  cached ??= probeWebgl();
  return cached;
}

/** Support never changes within a document, so nothing needs to subscribe. */
function subscribe(): () => void {
  return () => {};
}

export function useWebglSupport(): WebglSupport {
  return useSyncExternalStore(subscribe, getSnapshot, () => "unknown" as const);
}
