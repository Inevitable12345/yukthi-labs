/* ============================================================================
   SITE CONSTANTS
   ========================================================================== */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "Yukthi Lab",
  shortName: "Yukthi",
  mission: "Bring certainty to an increasingly unstable world.",
  bet: "A Scoped Causal Hypergraph-based World Model.",
  positioning: "Know what could break before it becomes your 3 a.m. problem.",
  loop: ["Map", "Monitor", "Forecast", "Simulate", "Re-map"] as const,
  url: resolveSiteUrl(),
  locale: "en",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
} as const;

export const NAVIGATION = [
  { href: "/thesis", label: "Thesis" },
  { href: "/technology", label: "Technology" },
  { href: "/evidence", label: "Evidence" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
] as const;
