/**
 * Conference contacts and enquiry routing.
 */

export type Contact = {
  name: string;
  role: string;
  institution: string;
  phone: string;
  /** E.164 form used for click-to-call. */
  phoneHref: string;
};

export const contacts: Contact[] = [
  {
    name: "Mrs. J. Jayapriya",
    role: "Organizing Secretary",
    institution: "SCSVMV",
    phone: "+91 91760 86627",
    phoneHref: "+919176086627",
  },
  {
    name: "Dr. R. Rajalakshmi",
    role: "Organizing Secretary",
    institution: "TNTEU",
    phone: "+91 97865 00262",
    phoneHref: "+919786500262",
  },
  {
    name: "Dr. P. N. Lakshmi Shanmugam",
    role: "Organizing Secretary",
    institution: "TNTEU",
    phone: "+91 95434 78097",
    phoneHref: "+919543478097",
  },
];

export const conferenceEmail = "icrtet2026@kanchiuniv.ac.in";

export const enquiryTypes = [
  "Registration",
  "Paper submission",
  "Payment",
  "Publication",
  "Accommodation",
  "General enquiry",
] as const;

export const departments = [
  "School of Education, SCSVMV",
  "Department of Educational Technology, TNTEU",
] as const;

export type EnquiryType = (typeof enquiryTypes)[number];
