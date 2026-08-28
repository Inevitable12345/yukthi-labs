import { SITE } from "@/lib/metadata/site";

type Schema = Record<string, unknown>;

/**
 * Structured metadata (§45). Serialised with `<` escaped so a stray character
 * in the payload can never close the script element early.
 */
export function JsonLd({ schema }: { schema: Schema | Schema[] }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    description: `${SITE.mission} ${SITE.bet}`,
    slogan: SITE.mission,
    knowsAbout: [
      "Causal inference",
      "Hypergraphs",
      "World models",
      "Systemic risk",
      "Supply chain dependency analysis",
    ],
  };
}

export function pageSchema(name: string, description: string, path: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: new URL(path, SITE.url).toString(),
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}
