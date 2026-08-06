/**
 * Host and partner institutions.
 *
 * IMPORTANT: `description` fields are intentionally short and factual, built
 * only from the details printed on the official conference poster. Replace them
 * with the institutions' own approved profile text before publication —
 * do not expand them with unverified history or achievements.
 */

export type Institution = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  accreditation?: string;
  address: string;
  logo: string;
  website?: string;
  description: string;
};

export const scsvmv: Institution = {
  id: "scsvmv",
  name: "Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya",
  shortName: "SCSVMV",
  role: "Organising Institution",
  accreditation:
    "Deemed to be University under Section 3 of the UGC Act, 1956 · Accredited with “A” by NAAC",
  address: "Enathur, Kanchipuram, Tamil Nadu, India – 631561",
  logo: "/logos/scsvmv.svg", // TODO(assets): high-resolution official logo
  website: "https://www.kanchiuniv.ac.in",
  description:
    "Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya is a Deemed to be University under Section 3 of the UGC Act, 1956, accredited with “A” grade by NAAC, situated at Enathur, Kanchipuram, Tamil Nadu.",
};

export const schoolOfEducation: Institution = {
  id: "school-of-education",
  name: "School of Education, SCSVMV",
  shortName: "School of Education",
  role: "Primary Organiser",
  address: "Enathur, Kanchipuram, Tamil Nadu, India – 631561",
  logo: "/logos/school-of-education.svg", // TODO(assets)
  description:
    "The School of Education at SCSVMV is the primary organiser of ICRTET-2026, bringing together teacher educators, researchers and technology practitioners around current developments in educational technology.",
};

export const tnteu: Institution = {
  id: "tnteu",
  name: "Tamil Nadu Teachers Education University",
  shortName: "TNTEU",
  role: "In Association With",
  address: "Chennai, Tamil Nadu – 600097",
  logo: "/logos/tnteu.svg", // TODO(assets): high-resolution official logo
  website: "https://www.tnteu.ac.in",
  description:
    "Tamil Nadu Teachers Education University, Chennai, is associated with ICRTET-2026 as a partner institution, contributing academic leadership through its Department of Educational Technology.",
};

export const institutions: Institution[] = [
  scsvmv,
  schoolOfEducation,
  tnteu,
];
