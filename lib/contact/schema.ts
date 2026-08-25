import { z } from "zod";

/**
 * Collaboration enquiry.
 *
 * The field list is the whole field list. Nothing is collected that is not needed
 * to write a reply, and there is no hidden telemetry attached to a submission.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please give a name.").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("That does not look like an email address.")
    .max(200),
  organization: z.string().trim().min(2, "Please give an organisation.").max(160),
  role: z.string().trim().min(2, "Please give a role.").max(160),
  message: z
    .string()
    .trim()
    .min(20, "A sentence or two about the decision or risk, please.")
    .max(4000),
  consent: z.literal(true, {
    message: "Please confirm you are happy for us to reply.",
  }),
  /**
   * Honeypot. Real people never see this field and never fill it in; naive bots
   * fill every input they find. A filled value is rejected silently, so a bot
   * learns nothing from the response.
   */
  website: z.string().max(0).optional().or(z.literal("")),
  /**
   * Milliseconds between the form mounting and being submitted. A submission
   * faster than a human could type is treated as automated.
   */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const MIN_HUMAN_ELAPSED_MS = 3000;

export type ContactResponse =
  { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
