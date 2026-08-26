/**
 * Site-level constants. Everything externally visible about Yukthi Lab that is
 * not a page's own content lives here.
 *
 * Nothing in this file may assert an achievement, a customer, a partnership or a
 * result. It describes what the lab is building, in the present tense.
 */

export const SITE = {
  name: "Yukthi Lab",
  shortName: "Yukthi",
  mission: "Bring certainty to an increasingly unstable world.",
  promise: "Know what could break before it becomes your 3 A.M. problem.",
  technicalBet: "Scoped Causal Hypergraph-based World Model",
  loop: ["Map", "Monitor", "Forecast", "Simulate", "Re-map"] as const,
  titleDefault: "Yukthi Lab — Causal Intelligence for an Unstable World",
  titleTemplate: "%s — Yukthi Lab",
  description:
    "Yukthi Lab is developing a Scoped Causal Hypergraph-based World Model to map changing systems, reason through downstream consequences, and evaluate plausible futures around consequential decisions.",
  locale: "en_US",
  lang: "en",
} as const;

const FALLBACK_ORIGIN = "http://localhost:3000";

/** First value that is present *and* not blank. `??` is not enough here. */
function firstMeaningful(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

/**
 * Canonical origin for every absolute URL the site emits.
 *
 * Resolution order: NEXT_PUBLIC_SITE_URL, then Vercel's production domain, then
 * the current deployment URL, then localhost.
 *
 * Three things this function must never do, each learned the hard way:
 *
 *   1. Treat an empty string as a value. An environment variable that exists but
 *      is blank — a variable added in a dashboard and left unfilled — is not a
 *      configured origin. `??` only falls back on null and undefined, so it
 *      passed `""` straight through to `new URL()`.
 *   2. Require a protocol. Vercel's domain variables carry a bare hostname.
 *   3. Throw. `metadataBase` is evaluated while Next collects page
 *      configuration, so an exception here fails the entire build rather than
 *      one route. A bad value degrades to the fallback instead.
 */
export function siteUrl(): string {
  const configured = firstMeaningful(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  );

  if (!configured) return FALLBACK_ORIGIN;

  const withProtocol = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;

  try {
    const url = new URL(withProtocol);
    // Keep a base path if one was configured; drop any trailing slash.
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export function absoluteUrl(path = "/"): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export type RouteDefinition = {
  href: string;
  label: string;
  /** Short line used in the footer, sitemap and route index. */
  summary: string;
  /** Included in the primary navigation. */
  primary: boolean;
  /** Sitemap priority. */
  priority: number;
};

export const ROUTES: RouteDefinition[] = [
  {
    href: "/",
    label: "Yukthi Lab",
    summary: "The thesis, in sequence.",
    primary: false,
    priority: 1,
  },
  {
    href: "/thesis",
    label: "Thesis",
    summary: "The full argument, with its evidence attached.",
    primary: true,
    priority: 0.9,
  },
  {
    href: "/architecture",
    label: "Architecture",
    summary: "How the world model is intended to work, layer by layer.",
    primary: true,
    priority: 0.9,
  },
  {
    href: "/evidence",
    label: "Evidence",
    summary: "The source record behind every claim on this site.",
    primary: true,
    priority: 0.9,
  },
  {
    href: "/research",
    label: "Research",
    summary: "Technical notes, experiments and evaluation.",
    primary: true,
    priority: 0.7,
  },
  {
    href: "/field-notes",
    label: "Field Notes",
    summary: "Observations on structures that appear to be changing.",
    primary: true,
    priority: 0.7,
  },
  {
    href: "/about",
    label: "About",
    summary: "Mission, method and collaboration.",
    primary: true,
    priority: 0.6,
  },
];

export const LEGAL_ROUTES: RouteDefinition[] = [
  {
    href: "/privacy",
    label: "Privacy",
    summary: "What this site collects, and what it does not.",
    primary: false,
    priority: 0.3,
  },
  {
    href: "/cookies",
    label: "Cookies",
    summary: "Cookie categories and how consent is stored.",
    primary: false,
    priority: 0.3,
  },
  {
    href: "/terms",
    label: "Terms",
    summary: "Terms of use for this site.",
    primary: false,
    priority: 0.3,
  },
];

export const PRIMARY_NAV = ROUTES.filter((route) => route.primary);
