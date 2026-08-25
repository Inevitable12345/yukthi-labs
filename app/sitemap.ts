import type { MetadataRoute } from "next";

import { LEGAL_ROUTES, ROUTES, absoluteUrl } from "@/lib/metadata/site";
import { fieldNotes } from "@/content/field-notes/registry";
import { researchEntries } from "@/content/research/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = [...ROUTES, ...LEGAL_ROUTES].map((route) => ({
    url: absoluteUrl(route.href),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));

  const noteEntries = fieldNotes.map((note) => ({
    url: absoluteUrl(`/field-notes/${note.slug}`),
    lastModified: new Date(note.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const researchRoutes = researchEntries.map((entry) => ({
    url: absoluteUrl(`/research/${entry.slug}`),
    lastModified: new Date(entry.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...noteEntries, ...researchRoutes];
}
