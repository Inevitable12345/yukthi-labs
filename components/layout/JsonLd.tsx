import { SITE, siteUrl } from "@/lib/metadata/site";

/**
 * Organization structured data.
 *
 * Only fields that are verifiably true are emitted: the lab's name, its site, what
 * it describes itself as building. No address, no founding date, no employee count,
 * no social profiles — none of that has been supplied, so none of it is asserted.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: siteUrl(),
    description: SITE.description,
    logo: `${siteUrl()}/icons/mark.svg`,
    slogan: SITE.mission,
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from a literal above; no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
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
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${siteUrl()}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: siteUrl(),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
