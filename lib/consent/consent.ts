/**
 * Consent model.
 *
 * Default state grants only what the site cannot function without. Nothing here
 * pre-checks an optional category, and "reject optional" is always one click —
 * the same number of clicks as "accept all".
 */

export const CONSENT_CATEGORIES = [
  {
    id: "necessary",
    label: "Necessary",
    description:
      "Required for the site to work: remembering this consent choice, and security protections such as request rate limiting. Cannot be switched off.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Aggregate measurement of which parts of the thesis are read and which causal scenarios are opened. Used to improve the argument, never to identify you.",
    required: false,
  },
  {
    id: "functional",
    label: "Functional",
    description:
      "Remembers interface preferences, such as a chosen decision scope or an expanded evidence drawer, between visits.",
    required: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Advertising and cross-site tracking. Yukthi Lab does not currently use any marketing cookies; the category is listed so that this disclosure stays accurate if that ever changes.",
    required: false,
  },
] as const;

export type ConsentCategoryId = (typeof CONSENT_CATEGORIES)[number]["id"];

export type ConsentState = Record<ConsentCategoryId, boolean>;

export const CONSENT_STORAGE_KEY = "yukthi.consent.v1";
export const CONSENT_VERSION = 1;

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
};

export const ALL_CONSENT: ConsentState = {
  necessary: true,
  analytics: true,
  functional: true,
  marketing: true,
};

export type StoredConsent = {
  version: number;
  decidedAt: string;
  state: ConsentState;
};

function isConsentState(value: unknown): value is ConsentState {
  if (typeof value !== "object" || value === null) return false;
  return CONSENT_CATEGORIES.every(
    (category) => typeof (value as Record<string, unknown>)[category.id] === "boolean",
  );
}

/** Reads a previously stored decision. Returns null when no valid decision exists. */
export function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    if (record.version !== CONSENT_VERSION) return null;
    if (!isConsentState(record.state)) return null;
    return {
      version: CONSENT_VERSION,
      decidedAt: typeof record.decidedAt === "string" ? record.decidedAt : "",
      // Necessary is always on regardless of what was persisted.
      state: { ...record.state, necessary: true },
    };
  } catch {
    return null;
  }
}

export function writeStoredConsent(state: ConsentState): StoredConsent | null {
  if (typeof window === "undefined") return null;
  const record: StoredConsent = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    state: { ...state, necessary: true },
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* Storage may be unavailable (private mode, blocked). Consent then lasts
       for the session only, which is the privacy-safe direction to fail. */
  }
  notifyConsentChanged();
  return record;
}

export function clearStoredConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* no-op */
  }
  notifyConsentChanged();
}

/* --------------------------------------------------------------------------
   Consent as an external store
   --------------------------------------------------------------------------
   The stored decision is the single source of truth, read through
   `useSyncExternalStore` rather than mirrored into component state. That gives
   cross-tab synchronisation for free — accepting in one tab updates the others —
   and removes a class of bug where the UI and the stored record disagree.
   ------------------------------------------------------------------------ */

const CONSENT_EVENT = "yukthi:consent";

/** Same-tab notification. The native `storage` event only fires in other tabs. */
export function notifyConsentChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function subscribeToConsent(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Returns the raw stored string so the snapshot is a stable primitive — returning
 * a fresh object here would make `useSyncExternalStore` loop forever.
 */
export function getConsentSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Parses a raw snapshot into a decision, or null when there is not one. */
export function parseConsentSnapshot(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    if (record.version !== CONSENT_VERSION) return null;
    if (!isConsentState(record.state)) return null;
    return {
      version: CONSENT_VERSION,
      decidedAt: typeof record.decidedAt === "string" ? record.decidedAt : "",
      state: { ...record.state, necessary: true },
    };
  } catch {
    return null;
  }
}
