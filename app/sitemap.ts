import type { MetadataRoute } from "next";
import { SITE } from "@/lib/metadata/site";

const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/thesis", priority: 0.9 },
  { path: "/technology", priority: 0.9 },
  { path: "/evidence", priority: 0.8 },
  { path: "/research", priority: 0.8 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: new URL(route.path, SITE.url).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
