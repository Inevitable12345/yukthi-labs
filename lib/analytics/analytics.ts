import { ANALYTICS_EVENTS, type AnalyticsEvent, type AnalyticsProps } from "./events";

/**
 * Provider-agnostic analytics facade.
 *
 * Nothing is sent unless (a) a provider is configured through the environment and
 * (b) the reader has granted the `analytics` consent category. With no provider
 * configured — the default — `track` is a no-op that still type-checks call sites,
 * so instrumentation can be written before a provider is ever chosen.
 */

export type AnalyticsProvider = "plausible" | "posthog" | "ga4" | "none";

export function configuredProvider(): AnalyticsProvider {
  const raw = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "").trim().toLowerCase();
  if (raw === "plausible" || raw === "posthog" || raw === "ga4") return raw;
  return "none";
}

type AnalyticsWindow = Window & {
  plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
  posthog?: { capture?: (event: string, props?: AnalyticsProps) => void };
  gtag?: (command: string, event: string, props?: AnalyticsProps) => void;
  dataLayer?: unknown[];
};

let consentGranted = false;

/** Called by the provider component whenever consent changes. */
export function setAnalyticsConsent(granted: boolean): void {
  consentGranted = granted;
}

export function analyticsConsentGranted(): boolean {
  return consentGranted;
}

function isKnownEvent(event: string): event is AnalyticsEvent {
  return (ANALYTICS_EVENTS as readonly string[]).includes(event);
}

/**
 * Records an event. Safe to call from anywhere, including during SSR — it returns
 * immediately when there is no window, no consent, or no configured provider.
 */
export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  if (!consentGranted) return;
  if (!isKnownEvent(event)) return;

  const provider = configuredProvider();
  if (provider === "none") return;

  const scope = window as AnalyticsWindow;

  try {
    switch (provider) {
      case "plausible":
        scope.plausible?.(event, Object.keys(props).length ? { props } : undefined);
        break;
      case "posthog":
        scope.posthog?.capture?.(event, props);
        break;
      case "ga4":
        scope.gtag?.("event", event, props);
        break;
    }
  } catch {
    /* Analytics must never break the page. */
  }
}
