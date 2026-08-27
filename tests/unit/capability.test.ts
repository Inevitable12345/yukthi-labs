import { describe, expect, it } from "vitest";

import { resolveTier, TIER_BUDGET, type CapabilityInput } from "@/lib/utils/capability";

const desktop: CapabilityInput = {
  webgl: true,
  reducedMotion: false,
  cores: 8,
  memory: 8,
  width: 1440,
  coarsePointer: false,
};

describe("performance tiers", () => {
  it("falls back entirely without WebGL", () => {
    expect(resolveTier({ ...desktop, webgl: false })).toBe("none");
  });

  it("respects reduced motion above every other signal", () => {
    // A powerful machine whose user asked for less motion still gets less.
    expect(resolveTier({ ...desktop, reducedMotion: true })).toBe("reduced");
  });

  it("respects Save-Data", () => {
    expect(resolveTier({ ...desktop, saveData: true })).toBe("reduced");
  });

  it("gives a capable desktop the full scene", () => {
    expect(resolveTier(desktop)).toBe("full");
  });

  it("steps down on a weak desktop", () => {
    expect(resolveTier({ ...desktop, cores: 4 })).toBe("standard");
    expect(resolveTier({ ...desktop, memory: 4 })).toBe("standard");
  });

  it("is conservative on phones regardless of raw capability", () => {
    // A phone that *can* run the scene often still should not: sustained WebGL
    // is what drains a battery and throttles the device.
    const phone: CapabilityInput = {
      ...desktop,
      width: 390,
      coarsePointer: true,
      cores: 4,
      memory: 4,
    };
    expect(resolveTier(phone)).toBe("reduced");

    const strongPhone = { ...phone, cores: 8, memory: 6 };
    expect(resolveTier(strongPhone)).toBe("standard");
  });

  it("treats a coarse-pointer tablet as a small device", () => {
    const tablet: CapabilityInput = {
      ...desktop,
      width: 900,
      coarsePointer: true,
      cores: 4,
      memory: 4,
    };
    expect(resolveTier(tablet)).toBe("reduced");
  });

  it("assumes modest hardware when the browser exposes nothing", () => {
    const unknown: CapabilityInput = {
      webgl: true,
      reducedMotion: false,
      width: 1440,
      coarsePointer: false,
    };
    // Defaults of 4 cores / 4 GB must not be read as a high-end machine.
    expect(resolveTier(unknown)).toBe("standard");
  });
});

describe("tier budgets", () => {
  it("increase monotonically with capability", () => {
    const order = ["none", "reduced", "standard", "full"] as const;

    for (let i = 1; i < order.length; i += 1) {
      const lower = TIER_BUDGET[order[i - 1]!];
      const higher = TIER_BUDGET[order[i]!];
      expect(higher.nodes).toBeGreaterThanOrEqual(lower.nodes);
      expect(higher.arcs).toBeGreaterThanOrEqual(lower.arcs);
      expect(higher.particles).toBeGreaterThanOrEqual(lower.particles);
    }
  });

  it("draws nothing at all in the none tier", () => {
    expect(TIER_BUDGET.none.nodes).toBe(0);
    expect(TIER_BUDGET.none.particles).toBe(0);
  });

  it("caps device pixel ratio everywhere", () => {
    for (const tier of Object.values(TIER_BUDGET)) {
      const [min, max] = tier.dpr;
      expect(min).toBeGreaterThanOrEqual(1);
      // Beyond 2x the cost is real and the visible gain is not.
      expect(max).toBeLessThanOrEqual(2);
      expect(max).toBeGreaterThanOrEqual(min);
    }
  });

  it("runs no idle particles under reduced motion", () => {
    expect(TIER_BUDGET.reduced.particles).toBe(0);
  });
});
