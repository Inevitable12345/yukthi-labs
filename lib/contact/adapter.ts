import type { ContactInput } from "./schema";

/**
 * Delivery adapter for collaboration enquiries.
 *
 * Provider-agnostic on purpose: no mail service is wired in, and none is assumed.
 * `CONTACT_PROVIDER` selects a transport at runtime. With nothing configured — the
 * default — the enquiry is written to the server log and the caller is told the
 * message was received but not delivered, so a misconfigured deployment cannot
 * silently swallow mail while showing a success message.
 *
 * Adding a provider means adding a case here. Nothing else changes.
 */

export type DeliveryResult =
  | { delivered: true; provider: string }
  | { delivered: false; provider: string; reason: string };

export async function deliverEnquiry(input: ContactInput): Promise<DeliveryResult> {
  const provider = (process.env.CONTACT_PROVIDER ?? "").trim().toLowerCase();

  switch (provider) {
    case "resend":
      return deliverViaResend(input);
    case "log":
    case "":
      return deliverToLog(input);
    default:
      return {
        delivered: false,
        provider,
        reason: `Unknown CONTACT_PROVIDER "${provider}". Supported: "resend", "log".`,
      };
  }
}

/** Local development fallback. Never used when a provider is configured. */
function deliverToLog(input: ContactInput): DeliveryResult {
  console.info(
    "[contact] enquiry received (no provider configured, not delivered)",
    JSON.stringify({
      name: input.name,
      email: input.email,
      organization: input.organization,
      role: input.role,
      messageLength: input.message.length,
      at: new Date().toISOString(),
    }),
  );
  return {
    delivered: false,
    provider: "log",
    reason: "No CONTACT_PROVIDER configured; the enquiry was logged, not sent.",
  };
}

async function deliverViaResend(input: ContactInput): Promise<DeliveryResult> {
  const apiKey = process.env.CONTACT_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return {
      delivered: false,
      provider: "resend",
      reason: "CONTACT_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must all be set.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Collaboration enquiry — ${input.organization}`,
      // Plain text only: nothing the sender wrote is ever interpreted as markup.
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Organisation: ${input.organization}`,
        `Role: ${input.role}`,
        "",
        input.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    // The provider's response body may echo the request; keep it out of the log.
    return {
      delivered: false,
      provider: "resend",
      reason: `Provider returned ${response.status}.`,
    };
  }

  return { delivered: true, provider: "resend" };
}
