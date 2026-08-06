/**
 * Core conference identity.
 * ---------------------------------------------------------------------------
 * Everything an administrator needs to change year-on-year lives in this file.
 * Values marked `TODO(assets)` must be replaced with officially approved
 * material before the site is deployed publicly.
 */

export const conference = {
  ordinal: "1st International Conference",
  title: "Recent Trends in Educational Technology",
  acronym: "ICRTET-2026",
  fullTitle:
    "1st International Conference on Recent Trends in Educational Technology",
  mode: "Hybrid Mode",
  dates: {
    label: "September 18–19, 2026",
    short: "18–19 Sep 2026",
    startISO: "2026-09-18T09:00:00+05:30",
    endISO: "2026-09-19T17:00:00+05:30",
  },
  location: {
    city: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    label: "Kanchipuram, Tamil Nadu, India",
    postalCode: "631561",
    streetAddress: "Enathur, Kanchipuram",
    /** Approximate campus coordinates — verify against an official source. */
    geo: { latitude: 12.8004, longitude: 79.6635 },
    mapEmbedQuery:
      "Sri+Chandrasekharendra+Saraswathi+Viswa+Mahavidyalaya,+Enathur,+Kanchipuram,+Tamil+Nadu+631561",
  },
  taglines: [
    "Empowering Education",
    "Innovating Futures",
    "Engaging Minds",
    "Enriching Society",
  ],
  /**
   * Public URLs. Replace the `#` placeholders with the official links supplied
   * by the organising committee — QR codes must resolve to the same targets.
   */
  links: {
    registration: "#", // TODO(assets): official registration form URL
    submission: "#", // TODO(assets): official paper submission URL
    brochure: "#", // TODO(assets): /brochure/ICRTET-2026-Brochure.pdf
    callForPapers: "#", // TODO(assets): call-for-papers PDF
  },
  /** Slim bar above the header. Set `enabled: false` to hide it entirely. */
  announcement: {
    enabled: true,
    text: "Paper submission closes on September 5, 2026.",
    href: "/registration#important-dates",
    linkLabel: "View Important Dates",
    /** Drives the countdown shown in the bar and the Call for Papers section. */
    deadlineISO: "2026-09-05T23:59:59+05:30",
  },
  seo: {
    siteUrl: "https://icrtet2026.kanchiuniv.ac.in", // TODO(assets): confirm final domain
    title:
      "ICRTET-2026 | International Conference on Recent Trends in Educational Technology",
    description:
      "Join ICRTET-2026, the 1st International Conference on Recent Trends in Educational Technology, organised by SCSVMV in association with TNTEU on September 18–19, 2026.",
    ogImage: "/og/icrtet-2026-og.png", // TODO(assets): approved 1200×630 social image
  },
} as const;

export type Conference = typeof conference;
