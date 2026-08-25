import { beforeEach, describe, expect, it } from "vitest";

import {
  ALL_CONSENT,
  CONSENT_CATEGORIES,
  CONSENT_STORAGE_KEY,
  DEFAULT_CONSENT,
  clearStoredConsent,
  readStoredConsent,
  writeStoredConsent,
} from "@/lib/consent/consent";
import { configuredProvider, setAnalyticsConsent, track } from "@/lib/analytics/analytics";

describe("consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setAnalyticsConsent(false);
  });

  it("grants only the necessary category by default", () => {
    expect(DEFAULT_CONSENT).toEqual({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
  });

  it("marks exactly one category as required", () => {
    const required = CONSENT_CATEGORIES.filter((category) => category.required);
    expect(required.map((category) => category.id)).toEqual(["necessary"]);
  });

  it("returns null when nothing has been decided", () => {
    expect(readStoredConsent()).toBeNull();
  });

  it("round-trips a decision", () => {
    writeStoredConsent({ ...DEFAULT_CONSENT, analytics: true });
    const stored = readStoredConsent();
    expect(stored?.state.analytics).toBe(true);
    expect(stored?.state.functional).toBe(false);
    expect(stored?.decidedAt).toBeTruthy();
  });

  it("forces the necessary category on, whatever was persisted", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        decidedAt: "2026-01-01T00:00:00.000Z",
        state: { necessary: false, analytics: false, functional: false, marketing: false },
      }),
    );
    expect(readStoredConsent()?.state.necessary).toBe(true);
  });

  it("discards a stored record from an older version or a malformed shape", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ version: 0, state: {} }));
    expect(readStoredConsent()).toBeNull();

    window.localStorage.setItem(CONSENT_STORAGE_KEY, "not json");
    expect(readStoredConsent()).toBeNull();
  });

  it("clears a decision", () => {
    writeStoredConsent(ALL_CONSENT);
    clearStoredConsent();
    expect(readStoredConsent()).toBeNull();
  });
});

describe("analytics", () => {
  it("reports no provider when none is configured", () => {
    expect(configuredProvider()).toBe("none");
  });

  it("does nothing when consent has not been granted", () => {
    const scope = window as Window & { plausible?: (...args: unknown[]) => void };
    let calls = 0;
    scope.plausible = () => {
      calls += 1;
    };

    setAnalyticsConsent(false);
    track("evidence_open", { evidence: "E-001" });
    expect(calls).toBe(0);

    // Even with consent, no provider is configured, so still nothing is sent.
    setAnalyticsConsent(true);
    track("evidence_open", { evidence: "E-001" });
    expect(calls).toBe(0);
    setAnalyticsConsent(false);
    delete scope.plausible;
  });
});
