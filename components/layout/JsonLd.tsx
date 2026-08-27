import { SITE, siteUrl } from "@/lib/metadata/site";

/**
 * Structured data.
 *
 * Emitted as a script tag with JSON.stringify rather than a template literal, so
 * a stray character in the content cannot break out of the script context.
 */
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is authored constants, and stringify escapes the rest.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.name,
        url: siteUrl(),
        description: SITE.description,
        slogan: SITE.mission,
      }}
    />
  );
}

export function WebPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name,
        description,
        url: `${siteUrl()}${path}`,
        isPartOf: { "@type": "WebSite", name: SITE.name, url: siteUrl() },
      }}
    />
  );
}
