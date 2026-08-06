/**
 * Frequently asked questions.
 *
 * `status: "confirmed"` — the answer is drawn directly from the official
 *   conference poster and may be published as written.
 * `status: "pending"`   — the question is expected, but no approved answer
 *   exists yet. The UI shows a neutral holding message and points the visitor
 *   at the organising secretaries instead of inventing a policy.
 *
 * Only move an item to "confirmed" once the organising committee approves it.
 */

export type Faq = {
  id: string;
  question: string;
  answer?: string;
  status: "confirmed" | "pending";
  category: "General" | "Submission" | "Registration" | "Payment" | "Publication";
};

export const faqs: Faq[] = [
  {
    id: "mode",
    question: "Is the conference held online or in person?",
    answer:
      "ICRTET-2026 is conducted in hybrid mode. Delegates may attend in person at SCSVMV, Kanchipuram, or join the sessions online.",
    status: "confirmed",
    category: "General",
  },
  {
    id: "who-can-submit",
    question: "Who can submit a paper?",
    answer:
      "Research papers are invited for oral presentation from students, PhD scholars, faculty members, teacher educators, researchers and industry professionals working in areas related to educational technology.",
    status: "confirmed",
    category: "Submission",
  },
  {
    id: "students-register",
    question: "Can students register?",
    answer:
      "Yes. A dedicated student registration category is available at ₹1,000. PhD scholars, faculty and industry professionals register at ₹2,000, and foreign delegates at USD 50.",
    status: "confirmed",
    category: "Registration",
  },
  {
    id: "how-to-submit",
    question: "How do I submit a paper?",
    answer:
      "Registration and paper submission are completed online through the official conference link, which is also available as a QR code on this website. Submissions close on September 5, 2026.",
    status: "confirmed",
    category: "Submission",
  },
  {
    id: "deadlines",
    question: "What are the key deadlines?",
    answer:
      "September 5, 2026 is the last date for registration and submission of papers. September 10, 2026 is the last date for paper acceptance and payment. The conference is held on September 18–19, 2026.",
    status: "confirmed",
    category: "General",
  },
  {
    id: "how-to-pay",
    question: "How do I make the payment?",
    answer:
      "Payment can be made to the conference bank account listed on the Registration page, or by scanning the official payment QR code. Please verify the recipient details with the organising committee before transferring funds.",
    status: "confirmed",
    category: "Payment",
  },
  {
    id: "publication-guarantee",
    question: "Will every accepted paper be published?",
    answer:
      "No. Accepted papers, following peer review, will be considered for publication in the conference proceedings with ISBN. Consideration is not a guarantee of publication.",
    status: "confirmed",
    category: "Publication",
  },
  {
    id: "foreign-online",
    question: "Can foreign delegates participate online?",
    answer:
      "Yes. The conference is held in hybrid mode, so foreign delegates registered under the USD 50 category may participate online.",
    status: "confirmed",
    category: "Registration",
  },
  {
    id: "payment-contact",
    question: "Whom should I contact about payment questions?",
    answer:
      "Please contact the organising secretaries listed on the Contact page, or write to icrtet2026@kanchiuniv.ac.in.",
    status: "confirmed",
    category: "Payment",
  },
  {
    id: "certificates",
    question: "How will certificates be issued?",
    answer: undefined,
    status: "pending",
    category: "General",
  },
  {
    id: "paper-format",
    question: "What is the required paper format and length?",
    answer: undefined,
    status: "pending",
    category: "Submission",
  },
  {
    id: "accommodation",
    question: "Is accommodation arranged for outstation delegates?",
    answer: undefined,
    status: "pending",
    category: "General",
  },
];

export const pendingAnswerNotice =
  "This detail is being confirmed by the organising committee and will be published here once approved. For an immediate answer, please contact the organising secretaries.";
