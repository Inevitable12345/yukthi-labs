/* ============================================================================
   SITE CONSTANTS
   ========================================================================== */

export const SITE = {
  name: "Yukthi Lab",
  titleDefault: "Yukthi Lab — Bring certainty to an increasingly unstable world",
  titleTemplate: "%s — Yukthi Lab",
  description:
    "Yukthi Lab is building a Scoped Causal Hypergraph-based World Model: an always-on causal intelligence layer that maps, monitors, forecasts and simulates how consequential change propagates.",
  mission: "Bring certainty to an increasingly unstable world.",
  bet: "Scoped Causal Hypergraph-based World Model",
  loop: ["Map", "Monitor", "Forecast", "Simulate", "Re-map"] as const,
  promise: "Know what could break before it becomes your 3 a.m. problem.",
  lang: "en",
  locale: "en_GB",
  contactEmail: "hello@yukthi.example",
} as const;

/**
 * The canonical origin.
 *
 * An unset or blank `NEXT_PUBLIC_SITE_URL` falls back to localhost rather than
 * throwing: a blank environment variable is a common deployment mistake and it
 * should not fail the build.
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export type RouteDefinition = {
  href: string;
  label: string;
  description: string;
  primary: boolean;
};

/** §35. The route set, defined once and consumed by nav, footer and sitemap. */
export const ROUTES: RouteDefinition[] = [
  {
    href: "/",
    label: "The argument",
    description: "How the world changed, and what follows from it.",
    primary: false,
  },
  {
    href: "/thesis",
    label: "Thesis",
    description: "The mission argument, read end to end.",
    primary: true,
  },
  {
    href: "/technology",
    label: "Technology",
    description: "What a Scoped Causal Hypergraph-based World Model is.",
    primary: true,
  },
  {
    href: "/evidence",
    label: "Evidence",
    description: "Every source behind every claim on this site.",
    primary: true,
  },
  {
    href: "/research",
    label: "Research",
    description: "Open questions and what Yukthi must prove.",
    primary: true,
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Talk to Yukthi.",
    primary: true,
  },
];

export const LEGAL_ROUTES: RouteDefinition[] = [
  {
    href: "/privacy",
    label: "Privacy",
    description: "What this site collects.",
    primary: false,
  },
  { href: "/terms", label: "Terms", description: "Terms of use.", primary: false },
];

export const PRIMARY_NAV = ROUTES.filter((route) => route.primary);
