import type { Metadata } from "next";
import { SITE } from "./site";

type Options = {
  title: string;
  description: string;
  path: string;
  /** Overrides the generated OG image caption. */
  ogCaption?: string;
};

export function buildMetadata({ title, description, path, ogCaption }: Options): Metadata {
  const canonical = new URL(path, SITE.url).toString();
  const ogImage = new URL(
    `/og?title=${encodeURIComponent(title)}&caption=${encodeURIComponent(ogCaption ?? SITE.mission)}`,
    SITE.url,
  ).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      url: canonical,
      locale: "en_GB",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE.name} — ${title}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}
