import type { Metadata } from "next";

import { SITE, absoluteUrl } from "./site";

/** One place where per-page metadata is assembled, so no page forgets a canonical. */
export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      locale: SITE.locale,
      url: absoluteUrl(path),
      title: `${title} — ${SITE.name}`,
      description,
      images: [{ url: "/og", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE.name}`,
      description,
      images: ["/og"],
    },
  };
}
