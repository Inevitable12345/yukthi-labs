/* ============================================================================
   DEVICE PERFORMANCE TIERS  (§38, §39)
   ----------------------------------------------------------------------------
   The world instrument is one scene at three densities. Tier selection is
   deliberately boring — coarse pointer, viewport width, reported cores, device
   memory — because heuristics that guess harder tend to guess wrong, and the
   cost of guessing wrong is a phone that drops frames through the argument.
   ========================================================================== */

export type PerformanceTier = "high" | "medium" | "low";

export type TierBudget = {
  /** Points in the morphing evidence field. */
  particles: number;
  /** Causal relations drawn as line segments. */
  relations: number;
  /** Upper bound on device pixel ratio. */
  maxDpr: number;
  /** Whether the world runs its slow ambient drift between rooms. */
  ambientDrift: boolean;
};

export const TIER_BUDGETS: Record<PerformanceTier, TierBudget> = {
  high: { particles: 4200, relations: 320, maxDpr: 2, ambientDrift: true },
  medium: { particles: 2200, relations: 200, maxDpr: 1.6, ambientDrift: true },
  low: { particles: 900, relations: 96, maxDpr: 1.25, ambientDrift: false },
};

export type TierSignals = {
  width: number;
  coarsePointer: boolean;
  cores?: number;
  /** `navigator.deviceMemory`, in gigabytes, where the browser reports it. */
  memoryGb?: number;
  reducedMotion: boolean;
};

export function selectTier(signals: TierSignals): PerformanceTier {
  const { width, coarsePointer, cores, memoryGb, reducedMotion } = signals;

  // Reduced motion is not a performance signal, but it does mean the world
  // stops animating between states — there is nothing to spend the budget on.
  if (reducedMotion) return "low";

  if (memoryGb !== undefined && memoryGb <= 4) return "low";
  if (cores !== undefined && cores <= 4) return "low";
  if (coarsePointer && width < 900) return "low";
  if (width < 1200 || coarsePointer) return "medium";
  if (cores !== undefined && cores < 8) return "medium";
  return "high";
}

export function budgetFor(tier: PerformanceTier): TierBudget {
  return TIER_BUDGETS[tier];
}
