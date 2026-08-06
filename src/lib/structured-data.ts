import { conference } from "@/content/conference";
import { scsvmv, tnteu } from "@/content/institutions";
import { conferenceEmail } from "@/content/contacts";
import { registrationFees } from "@/content/registration-fees";

const base = conference.seo.siteUrl;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: scsvmv.name,
    alternateName: scsvmv.shortName,
    url: scsvmv.website,
    address: {
      "@type": "PostalAddress",
      streetAddress: conference.location.streetAddress,
      addressLocality: conference.location.city,
      addressRegion: conference.location.state,
      postalCode: conference.location.postalCode,
      addressCountry: "IN",
    },
  };
}

export function eventSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: conference.fullTitle,
    alternateName: conference.acronym,
    description: conference.seo.description,
    startDate: conference.dates.startISO,
    endDate: conference.dates.endISO,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      "https://schema.org/MixedEventAttendanceMode",
    url: base,
    location: [
      {
        "@type": "Place",
        name: scsvmv.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: conference.location.streetAddress,
          addressLocality: conference.location.city,
          addressRegion: conference.location.state,
          postalCode: conference.location.postalCode,
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: conference.location.geo.latitude,
          longitude: conference.location.geo.longitude,
        },
      },
      {
        "@type": "VirtualLocation",
        url: base,
      },
    ],
    organizer: [
      { "@type": "Organization", name: scsvmv.name, url: scsvmv.website },
      { "@type": "Organization", name: tnteu.name, url: tnteu.website },
    ],
    offers: registrationFees.map((fee) => ({
      "@type": "Offer",
      name: fee.audience,
      price: fee.amount.replace(/[^\d.]/g, ""),
      priceCurrency: fee.currency,
      availability: "https://schema.org/InStock",
      validThrough: "2026-09-10T23:59:59+05:30",
      url: `${base}/registration`,
    })),
    inLanguage: "en",
    isAccessibleForFree: false,
    contactPoint: {
      "@type": "ContactPoint",
      email: conferenceEmail,
      contactType: "Conference enquiries",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: conference.acronym,
    alternateName: conference.fullTitle,
    url: base,
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
