import { z } from "zod";

/* ============================================================================
   CONTACT SUBMISSION  (§43)
   ----------------------------------------------------------------------------
   One schema, validated on the client for the reader's benefit and again on the
   server because the client's validation is a courtesy, not a control.
   ========================================================================== */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please give a name.").max(120),
  email: z.string().trim().email("Please give an address we can reply to.").max(254),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  intent: z.enum(["research", "investment", "partnership", "press", "other"]),
  message: z
    .string()
    .trim()
    .min(20, "A little more context, please — twenty characters at least.")
    .max(4000),
  /**
   * Honeypot. Absent from the visible form and hidden from assistive technology
   * both, so a person can never fill it in and a naive bot usually will.
   */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactSubmission = z.infer<typeof contactSchema>;

export const INTENTS: { value: ContactSubmission["intent"]; label: string }[] = [
  { value: "research", label: "Research" },
  { value: "investment", label: "Investment" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
];
