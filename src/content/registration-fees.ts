/**
 * Registration categories and fees (from the official conference poster).
 *
 * `includes` is intentionally empty. Nothing may be listed as included in the
 * fee until the organising committee supplies the confirmed list — implying
 * kits, meals or certificates that were never promised creates real problems.
 */

export type FeeCategory = {
  id: string;
  audience: string;
  amount: string;
  currency: "INR" | "USD";
  note?: string;
  includes: string[];
  featured: boolean;
};

export const registrationFees: FeeCategory[] = [
  {
    id: "students",
    audience: "Students",
    amount: "₹1,000",
    currency: "INR",
    note: "UG and PG students",
    includes: [], // TODO(content): approved inclusions only
    featured: false,
  },
  {
    id: "scholars-faculty-industry",
    audience: "PhD Scholars, Faculty & Industry Professionals",
    amount: "₹2,000",
    currency: "INR",
    includes: [],
    featured: true,
  },
  {
    id: "foreign-delegates",
    audience: "Foreign Delegates",
    amount: "USD 50",
    currency: "USD",
    note: "International participants",
    includes: [],
    featured: false,
  },
];

export const registrationProcess = [
  {
    step: 1,
    title: "Prepare your paper",
    body: "Prepare your research paper in line with the author guidelines published on this website.",
  },
  {
    step: 2,
    title: "Register and submit online",
    body: "Complete registration and submit your paper online using the official conference link or QR code.",
  },
  {
    step: 3,
    title: "Await peer review",
    body: "Submitted papers are reviewed by the committee. Acceptance is communicated to the corresponding author.",
  },
  {
    step: 4,
    title: "Complete payment",
    body: "On acceptance, pay the registration fee for your category on or before September 10, 2026.",
  },
];

/** Shown beside every fee card and in the payment panel. */
export const feeDisclaimer =
  "Please verify all payment details with the organising committee before transferring any funds.";
