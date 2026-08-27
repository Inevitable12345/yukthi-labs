import { z } from "zod";

/* ============================================================================
   CONTACT SCHEMA (§34)
   ----------------------------------------------------------------------------
   One schema, used by the client for immediate feedback and by the server as the
   actual trust boundary. The client copy is a convenience; the server copy is
   the one that decides.
   ========================================================================== */

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120, "That name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter an email address.")
    .max(254, "That email address is too long.")
    .email("That does not look like an email address."),
  organization: z.string().trim().max(160, "That organisation name is too long.").optional(),
  /** Which 3 a.m. problem they have. Free text — the list is a prompt, not a taxonomy. */
  context: z
    .string()
    .trim()
    .min(20, "A sentence or two of context, please — it makes the reply useful.")
    .max(4000, "Please keep this under 4000 characters."),
  /**
   * Honeypot. Real users never see this field and never fill it. Bots fill
   * everything. A filled honeypot is accepted with a success response and
   * silently discarded — telling a bot it failed only teaches it to try again.
   */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Flattens Zod issues into one message per field, for rendering next to inputs. */
export function fieldErrors(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof ContactInput] = issue.message;
    }
  }
  return errors;
}
