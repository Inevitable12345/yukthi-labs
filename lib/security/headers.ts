/* ============================================================================
   SECURITY HEADERS (§34)
   ----------------------------------------------------------------------------
   Exported as data rather than written inline in next.config so the policy can
   be asserted by a unit test instead of being trusted.
   ========================================================================== */

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` on style-src is required: Next injects critical CSS inline,
 * and both R3F and the font loader set inline styles on elements. Everything
 * else is locked to same-origin.
 *
 * `'unsafe-eval'` is permitted in development only — React Refresh needs it, and
 * it must never reach production.
 */
export function contentSecurityPolicy(
  isDevelopment = process.env.NODE_ENV !== "production",
): string {
  const scriptSrc = ["'self'", "'unsafe-inline'", isDevelopment ? "'unsafe-eval'" : ""]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    // No third-party analytics, no tag managers, no beacons.
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function securityHeaders(): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy() },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
