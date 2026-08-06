import type { MetadataRoute } from "next";
import { conference } from "@/content/conference";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${conference.seo.siteUrl}/sitemap.xml`,
    host: conference.seo.siteUrl,
  };
}
