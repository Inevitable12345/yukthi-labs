import { afterEach, describe, expect, it } from "vitest";
import { TIER_BUDGETS, budgetFor, selectTier } from "@/lib/performance/tier";
import { probeWebgl } from "@/lib/performance/webgl";

describe("performance tiers", () => {
  const desktop = { width: 1600, coarsePointer: false, cores: 12, reducedMotion: false };

  it("gives a workstation the full budget", () => {
    expect(selectTier(desktop)).toBe("high");
  });

  it("drops a phone to the low budget", () => {
    expect(selectTier({ width: 390, coarsePointer: true, cores: 8, reducedMotion: false })).toBe(
      "low",
    );
  });

  it("respects reported memory and core hints over screen size", () => {
    expect(selectTier({ ...desktop, memoryGb: 4 })).toBe("low");
    expect(selectTier({ ...desktop, cores: 4 })).toBe("low");
    expect(selectTier({ ...desktop, cores: 6 })).toBe("medium");
  });

  it("treats reduced motion as nothing to spend the budget on", () => {
    expect(selectTier({ ...desktop, reducedMotion: true })).toBe("low");
  });

  it("orders the budgets monotonically", () => {
    expect(TIER_BUDGETS.high.particles).toBeGreaterThan(TIER_BUDGETS.medium.particles);
    expect(TIER_BUDGETS.medium.particles).toBeGreaterThan(TIER_BUDGETS.low.particles);
    expect(TIER_BUDGETS.high.maxDpr).toBeGreaterThan(TIER_BUDGETS.low.maxDpr);
    expect(budgetFor("low").ambientDrift).toBe(false);
  });
});

describe("webgl probe", () => {
  const original = HTMLCanvasElement.prototype.getContext;

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = original;
  });

  it("reports unavailable when no context can be created", () => {
    HTMLCanvasElement.prototype.getContext = (() => null) as typeof original;
    expect(probeWebgl()).toBe("unavailable");
  });

  it("reports unavailable rather than throwing when the call itself fails", () => {
    // Some hardened browsers throw instead of returning null. A blank canvas is
    // the one outcome the site never permits, so this path must not escape (§41).
    HTMLCanvasElement.prototype.getContext = (() => {
      throw new Error("blocked");
    }) as typeof original;
    expect(probeWebgl()).toBe("unavailable");
  });

  it("reports available when a context is returned", () => {
    HTMLCanvasElement.prototype.getContext = (() => ({
      getExtension: () => ({ loseContext: () => {} }),
    })) as unknown as typeof original;
    expect(probeWebgl()).toBe("available");
  });
});
