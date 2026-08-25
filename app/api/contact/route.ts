import { NextResponse } from "next/server";

import { deliverEnquiry } from "@/lib/contact/adapter";
import { MIN_HUMAN_ELAPSED_MS, contactSchema } from "@/lib/contact/schema";
import { clientKey, hit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

/**
 * Collaboration enquiries.
 *
 * Order of checks matters: protocol shape first (constant-time header reads), then
 * the rate limit, then body validation, then the bot heuristics, then delivery.
 * A malformed protocol request is refused without spending the caller's quota.
 *
 * The two bot checks fail *silently* — they return the same success shape a real
 * submission gets. A bot that can tell rejection from acceptance can iterate until
 * it finds a payload that passes; one that cannot, cannot.
 *
 * CSRF: this route accepts only `application/json` and same-origin `POST`. A
 * cross-origin HTML form cannot send that content type without a preflight, and
 * the preflight is not answered. `form-action 'self'` in the CSP closes the other
 * direction. There is no session or cookie for a forged request to ride on.
 */
export async function POST(request: Request) {
  // Protocol checks first: they are constant-time header reads, and a request that
  // is not even shaped like an enquiry should not consume an enquiry's quota.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Expected application/json." },
      { status: 415 },
    );
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json(
          { ok: false, error: "Cross-origin request." },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json({ ok: false, error: "Bad origin." }, { status: 400 });
    }
  }

  const limit = hit(clientKey(request.headers, "contact"), LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this address. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return NextResponse.json(
      {
        ok: false,
        error: "Some fields need attention.",
        fieldErrors: flattened.fieldErrors,
      },
      { status: 422 },
    );
  }

  const input = parsed.data;

  // Honeypot filled, or submitted faster than a person could type it.
  const looksAutomated =
    (input.website ?? "") !== "" ||
    (typeof input.elapsedMs === "number" && input.elapsedMs < MIN_HUMAN_ELAPSED_MS);

  if (looksAutomated) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const result = await deliverEnquiry(input);

  if (!result.delivered) {
    // The reason is for the operator's log, never for the client.
    console.warn(`[contact] not delivered via ${result.provider}: ${result.reason}`);
    return NextResponse.json(
      {
        ok: false,
        error:
          "This site is not currently configured to deliver messages. Nothing was sent — please try again later.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
