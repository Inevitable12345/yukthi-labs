import type { MetadataRoute } from "next";

import { LEGAL_ROUTES, ROUTES, absoluteUrl } from "@/lib/metadata/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [...ROUTES, ...LEGAL_ROUTES].map((route) => ({
    url: absoluteUrl(route.href),
    lastModified: now,
    changeFrequency: route.href === "/" ? "weekly" : "monthly",
    priority: route.href === "/" ? 1 : route.primary ? 0.8 : 0.3,
  }));
}
