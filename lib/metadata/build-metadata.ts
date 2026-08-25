import type { Metadata } from "next";

import { SITE, absoluteUrl } from "./site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Overrides the generated OG image for this page. */
  ogPath?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

/**
 * Builds a complete metadata object for a route: canonical URL, Open Graph,
 * X/Twitter card, and robots directives.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogPath,
  type = "website",
  publishedTime,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = ogPath ?? `/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    openGraph: {
      type,
      url,
      title: path === "/" ? SITE.titleDefault : `${title} — ${SITE.name}`,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: absoluteUrl(ogImage), width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: path === "/" ? SITE.titleDefault : `${title} — ${SITE.name}`,
      description,
      images: [absoluteUrl(ogImage)],
    },
  };
}
