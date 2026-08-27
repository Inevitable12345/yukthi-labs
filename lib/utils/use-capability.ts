"use client";

import { useEffect, useState } from "react";

import {
  readCapabilityInput,
  resolveTier,
  TIER_BUDGET,
  type PerformanceTier,
} from "./capability";

/**
 * The rendering tier for this device.
 *
 * Starts at `none` on every render — server and first client paint alike — so
 * hydration is deterministic and the static world is what appears first. The
 * real tier is resolved after mount, and re-resolved when the motion preference
 * or the viewport class changes.
 */
export function useCapabilityTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("none");

  useEffect(() => {
    const resolve = () => setTier(resolveTier(readCapabilityInput()));

    resolve();

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const width = window.matchMedia("(min-width: 768px)");

    motion.addEventListener("change", resolve);
    width.addEventListener("change", resolve);

    return () => {
      motion.removeEventListener("change", resolve);
      width.removeEventListener("change", resolve);
    };
  }, []);

  return tier;
}

export function useBudget() {
  return TIER_BUDGET[useCapabilityTier()];
}

/** Reduced motion as a boolean, for components that only need the switch. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
