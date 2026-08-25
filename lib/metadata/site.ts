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

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL in the deployment environment.
 * Falls back to localhost so that local development produces valid absolute URLs.
 */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return raw.replace(/\/$/, "");
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
