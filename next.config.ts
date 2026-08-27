import type { NextConfig } from "next";

import { securityHeaders } from "./lib/security/headers";

/**
 * Build configuration.
 *
 * The security headers live in `lib/security/headers` so that the same policy can be
 * asserted by a unit test rather than only being trusted in production.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  experimental: {
    // three, drei and gsap are large barrel-ish imports; this keeps the client
    // bundle to what each route actually references.
    optimizePackageImports: ["@react-three/drei", "three", "gsap", "motion"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders() }];
  },
};

export default nextConfig;
