import type { ContactSubmission } from "./schema";

/* ============================================================================
   DELIVERY
   ----------------------------------------------------------------------------
   Delivery is configuration, not code. With `CONTACT_WEBHOOK_URL` set, a
   validated submission is forwarded there. Without it, the submission is
   acknowledged and recorded in the server log and nothing leaves the process —
   which is the correct default for a repository that may be deployed by anyone.
   ========================================================================== */

export type DeliveryResult = { delivered: boolean; reason?: string };

export async function deliver(submission: ContactSubmission): Promise<DeliveryResult> {
  const endpoint = process.env.CONTACT_WEBHOOK_URL?.trim();

  if (!endpoint) {
    console.info("[contact] received", {
      intent: submission.intent,
      organization: submission.organization || "—",
      length: submission.message.length,
    });
    return { delivered: false, reason: "no-endpoint" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: submission.name,
        email: submission.email,
        organization: submission.organization || null,
        intent: submission.intent,
        message: submission.message,
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { delivered: false, reason: `upstream-${response.status}` };
    return { delivered: true };
  } catch {
    return { delivered: false, reason: "upstream-unreachable" };
  }
}
