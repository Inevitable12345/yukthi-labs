"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  ALL_CONSENT,
  DEFAULT_CONSENT,
  type ConsentState,
  clearStoredConsent,
  getConsentSnapshot,
  parseConsentSnapshot,
  subscribeToConsent,
  writeStoredConsent,
} from "@/lib/consent/consent";

type ConsentContextValue = {
  /** Current effective consent. Optional categories are false until chosen. */
  consent: ConsentState;
  /** True once a decision exists in storage. */
  decided: boolean;
  /** True while the preferences dialog should be open. */
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  save: (next: ConsentState) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  reset: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/**
 * Consent state.
 *
 * The stored record is read through `useSyncExternalStore` rather than copied into
 * component state, so the UI cannot drift from what is actually persisted, and a
 * decision made in one tab propagates to the others. The server snapshot is
 * `null` — no decision — which is the correct thing to render before the browser's
 * storage has been consulted.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const raw = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => null);
  const stored = useMemo(() => parseConsentSnapshot(raw), [raw]);

  const save = useCallback((next: ConsentState) => {
    writeStoredConsent(next);
    setPreferencesOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent: stored?.state ?? DEFAULT_CONSENT,
      decided: stored !== null,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      save,
      acceptAll: () => save(ALL_CONSENT),
      rejectOptional: () => save(DEFAULT_CONSENT),
      reset: () => {
        clearStoredConsent();
        setPreferencesOpen(false);
      },
    }),
    [stored, preferencesOpen, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside a ConsentProvider");
  }
  return context;
}
