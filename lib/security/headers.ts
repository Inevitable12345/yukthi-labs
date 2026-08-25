/**
 * Security header policy — single source of truth.
 *
 * All headers, including the Content-Security-Policy, are static and applied
 * through `next.config.ts`.
 *
 * ── On nonces, and why this policy does not use one ─────────────────────────
 * Next.js 16 serves a prerendered HTML shell for every route in this app, dynamic
 * ones included. A per-request nonce cannot reach a document that was rendered
 * before the request existed, and a nonce baked in at build time is a constant —
 * which is no stronger than `'unsafe-inline'` while looking considerably
 * stronger. Rather than ship that, `script-src` permits inline scripts explicitly
 * and says so.
 *
 * What that costs, precisely: an attacker who could already inject markup into a
 * page could also run script. What limits that exposure here is that the site
 * renders no user-supplied content anywhere — no comments, no search echo, no
 * query parameters written into the DOM, no third-party embeds — so there is no
 * ordinary path by which attacker-controlled markup enters a page.
 *
 * The directives that block the usual escalation routes stay strict and are not
 * negotiable: `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`,
 * `form-action 'self'`, no `unsafe-eval`, and no remote script, style, font or
 * image origin beyond a configured analytics provider.
 *
 * If a future Next.js version applies request nonces to the served shell, restore
 * `'nonce-…' 'strict-dynamic'` here and drop `'unsafe-inline'`.
 */

export function securityHeaders(): Array<{ key: string; value: string }> {
  return [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: [
        "accelerometer=()",
        "autoplay=()",
        "camera=()",
        "display-capture=()",
        "encrypted-media=()",
        "fullscreen=(self)",
        "geolocation=()",
        "gyroscope=()",
        "magnetometer=()",
        "microphone=()",
        "midi=()",
        "payment=()",
        "usb=()",
        "xr-spatial-tracking=()",
        "browsing-topics=()",
        "interest-cohort=()",
      ].join(", "),
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    {
      // Ignored by browsers over plain HTTP, so it is safe to emit unconditionally
      // for a TLS-terminated deployment.
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
  ];
}

/**
 * `style-src` also needs `'unsafe-inline'`: React writes element `style`
 * attributes for the motion system and Next.js writes them for font preloading,
 * and inline style *attributes* are governed by `style-src` / `style-src-attr`.
 */
export function buildContentSecurityPolicy(
  isDev = process.env.NODE_ENV !== "production",
): string {
  const analytics = analyticsOrigins();

  const scriptSrc = [
    `'self'`,
    `'unsafe-inline'`,
    // The dev overlay and Turbopack HMR runtime need eval. Production never does.
    ...(isDev ? [`'unsafe-eval'`] : []),
    ...analytics.script,
  ].join(" ");

  const connectSrc = [`'self'`, ...(isDev ? ["ws:", "wss:"] : []), ...analytics.connect].join(
    " ",
  );

  const imgSrc = [`'self'`, "data:", "blob:", ...analytics.img].join(" ");

  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
    `form-action 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src ${imgSrc}`,
    // next/font self-hosts every face at build time, so no font CDN is needed.
    `font-src 'self' data:`,
    `connect-src ${connectSrc}`,
    `worker-src 'self' blob:`,
    `manifest-src 'self'`,
    `media-src 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");
}

/**
 * Extra origins required by the configured analytics provider.
 *
 * Adding a provider must widen the policy here rather than through an ad-hoc
 * override, so the deployed CSP always matches what the site can actually load.
 * With no provider configured — the default — nothing is added.
 */
function analyticsOrigins(): { script: string[]; connect: string[]; img: string[] } {
  const provider = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "").trim().toLowerCase();

  switch (provider) {
    case "plausible": {
      const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? "https://plausible.io";
      return { script: [host], connect: [host], img: [] };
    }
    case "posthog": {
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";
      return { script: [host], connect: [host], img: [] };
    }
    case "ga4":
      return {
        script: ["https://www.googletagmanager.com"],
        connect: ["https://www.google-analytics.com", "https://region1.google-analytics.com"],
        img: ["https://www.google-analytics.com", "https://www.googletagmanager.com"],
      };
    default:
      return { script: [], connect: [], img: [] };
  }
}
