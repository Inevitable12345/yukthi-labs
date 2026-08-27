import type { ContactInput } from "./schema";

/* ============================================================================
   CONTACT DELIVERY
   ----------------------------------------------------------------------------
   Deliberately an interface with a logging implementation rather than a wired-up
   email provider.

   Shipping a hard dependency on a specific transactional email service would
   mean either committing a vendor choice this project has not made, or shipping
   code that silently fails without credentials. Instead the boundary is explicit
   and documented in the deployment guide: implement `deliver` against whatever
   the deployment actually uses.

   The submission is never lost silently — if delivery is unconfigured, that is
   recorded in the server log rather than swallowed.
   ========================================================================== */

export type ContactDelivery = {
  deliver(input: ContactInput): Promise<{ delivered: boolean }>;
};

/**
 * The default: records the submission on the server and reports that delivery is
 * not configured. Suitable for a preview deployment; replace before production.
 */
export const loggingDelivery: ContactDelivery = {
  async deliver(input) {
    // Email is included: this log is server-side only and the message cannot be
    // acted on without it. It is never sent anywhere else.
    console.info("[contact] submission received", {
      name: input.name,
      email: input.email,
      organization: input.organization ?? null,
      contextLength: input.context.length,
      deliveryConfigured: false,
      at: new Date().toISOString(),
    });

    return { delivered: false };
  },
};

let delivery: ContactDelivery = loggingDelivery;

/** Swap the implementation at startup, or in a test. */
export function setContactDelivery(implementation: ContactDelivery): void {
  delivery = implementation;
}

export function getContactDelivery(): ContactDelivery {
  return delivery;
}
