/**
 * Site navigation.
 *
 * Authors, important dates and registration are deliberately a single
 * destination: everything a delegate must do lives on /registration, reached
 * through in-page anchors rather than separate pages.
 */

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "About ICRTET-2026",
        href: "/about",
        description: "Overview, theme and objectives",
      },
      {
        label: "Scope of the Conference",
        href: "/about#scope",
        description: "What the conference covers",
      },
      {
        label: "About SCSVMV",
        href: "/about/scsvmv",
        description: "The organising university",
      },
      {
        label: "About TNTEU",
        href: "/about/tnteu",
        description: "The associated university",
      },
      {
        label: "Venue",
        href: "/venue",
        description: "Campus location and travel guidance",
      },
    ],
  },
  { label: "Speakers", href: "/speakers" },
  {
    label: "Registration",
    href: "/registration",
    children: [
      {
        label: "Call for Papers",
        href: "/registration#call-for-papers",
        description: "Scope and how to take part",
      },
      {
        label: "Key Areas",
        href: "/registration#key-areas",
        description: "20 accepted research areas",
      },
      {
        label: "Important Dates",
        href: "/registration#important-dates",
        description: "Deadlines and conference dates",
      },
      {
        label: "Submission Guidelines",
        href: "/registration#guidelines",
        description: "Author instructions",
      },
      {
        label: "Registration Fees",
        href: "/registration#fees",
        description: "Delegate categories",
      },
      {
        label: "Payment Information",
        href: "/registration#payment",
        description: "Bank details and QR code",
      },
      {
        label: "Publication",
        href: "/registration#publication",
        description: "Peer review and proceedings",
      },
      {
        label: "Frequently Asked Questions",
        href: "/faq",
        description: "Common queries answered",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Grouped links used by the site footer. */
export const footerNavigation: { title: string; links: NavLink[] }[] = [
  {
    title: "Conference",
    links: [
      { label: "About ICRTET-2026", href: "/about" },
      { label: "Scope of the Conference", href: "/about#scope" },
      { label: "Tentative Speakers", href: "/speakers" },
      { label: "Venue", href: "/venue" },
    ],
  },
  {
    title: "For Authors",
    links: [
      { label: "Call for Papers", href: "/registration#call-for-papers" },
      { label: "Key Areas", href: "/registration#key-areas" },
      { label: "Important Dates", href: "/registration#important-dates" },
      { label: "Submission Guidelines", href: "/registration#guidelines" },
      { label: "Publication", href: "/registration#publication" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "Registration Fees", href: "/registration#fees" },
      { label: "Payment Information", href: "/registration#payment" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact & Support", href: "/contact" },
    ],
  },
];
