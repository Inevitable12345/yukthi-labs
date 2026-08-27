import { NextResponse } from "next/server";

import { getContactDelivery } from "@/lib/contact/adapter";
import { contactSchema, fieldErrors } from "@/lib/contact/schema";
import { rateLimit } from "@/lib/security/rate-limit";

/* ============================================================================
   CONTACT ENDPOINT (§34)
   ----------------------------------------------------------------------------
   Server-side validation, rate limiting, honeypot handling, and no reflection of
   user input in any response.
   ========================================================================== */

export const runtime = "nodejs";
/** Never cached, never statically analysed into a build artifact. */
export const dynamic = "force-dynamic";

function clientKey(request: Request): string {
  // Behind a proxy the first entry of x-forwarded-for is the client. This is
  // spoofable by a determined caller, which is why the limiter is one layer of
  // defence rather than the only one.
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `contact:${ip}`;
}

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { limit: 5, windowMs: 10 * 60_000 });

  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not read that submission." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Some fields need attention.", errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  // Honeypot: accept and discard. A bot told it failed simply retries.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, message: "Thank you — message received." });
  }

  try {
    await getContactDelivery().deliver(parsed.data);
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong sending that. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, message: "Thank you — message received." });
}
