"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/accessibility/use-reduced-motion";
import { budgetFor, selectTier, type PerformanceTier, type TierBudget } from "./tier";

type NavigatorWithHints = Navigator & { deviceMemory?: number };

/**
 * Device signals are read once per document. Viewport width is part of the
 * decision, but resizing does not re-tier: rebuilding the particle buffers
 * mid-scroll would cost more than the tier change could ever save.
 */
let signals: Omit<Parameters<typeof selectTier>[0], "reducedMotion"> | null = null;

function readSignals() {
  if (signals) return signals;
  const navigatorWithHints = navigator as NavigatorWithHints;
  signals = {
    width: window.innerWidth,
    coarsePointer:
      typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: coarse)").matches
        : false,
    cores: navigatorWithHints.hardwareConcurrency,
    memoryGb: navigatorWithHints.deviceMemory,
  };
  return signals;
}

function subscribe(): () => void {
  return () => {};
}

export function useDeviceTier(): { tier: PerformanceTier; budget: TierBudget } {
  const reducedMotion = useReducedMotion();
  const resolved = useSyncExternalStore(
    subscribe,
    () => selectTier({ ...readSignals(), reducedMotion }),
    () => "medium" as PerformanceTier,
  );
  return { tier: resolved, budget: budgetFor(resolved) };
}
