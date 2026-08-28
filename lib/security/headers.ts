/* ============================================================================
   SECURITY HEADERS  (§43)
   ----------------------------------------------------------------------------
   The site ships no third-party script by default. The Content-Security-Policy
   below is therefore deliberately narrow: it allows the application's own
   bundles, inline styles emitted by the framework, and — only when the operator
   configures one — a single privacy-respecting analytics origin.
   ========================================================================== */

/** Origin of the optional cookieless analytics script, if one is configured. */
function analyticsOrigin(): string | null {
  const source = process.env.NEXT_PUBLIC_ANALYTICS_SRC?.trim();
  if (!source) return null;
  try {
    return new URL(source).origin;
  } catch {
    return null;
  }
}

export function contentSecurityPolicy(isDevelopment = process.env.NODE_ENV !== "production") {
  const analytics = analyticsOrigin();

  // `unsafe-inline` is required for the framework's bootstrap script and for the
  // inline style attributes React Three Fiber writes onto the canvas element.
  // `unsafe-eval` is development-only (React Refresh); it is absent in production.
  const script = ["'self'", "'unsafe-inline'", isDevelopment ? "'unsafe-eval'" : null, analytics];

  const directives: Record<string, (string | null)[]> = {
    "default-src": ["'self'"],
    "script-src": script,
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", analytics, isDevelopment ? "ws:" : null],
    "worker-src": ["'self'", "blob:"],
    "media-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "manifest-src": ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([directive, values]) => {
      const allowed = values.filter((value): value is string => Boolean(value));
      return allowed.length ? `${directive} ${allowed.join(" ")}` : directive;
    })
    .join("; ");
}

export function securityHeaders(): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy() },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    { key: "Origin-Agent-Cluster", value: "?1" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
    },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ];
}
