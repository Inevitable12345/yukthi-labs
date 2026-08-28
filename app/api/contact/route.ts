import { NextResponse } from "next/server";
import { deliver } from "@/lib/contact/deliver";
import { contactSchema } from "@/lib/contact/schema";
import { clientKey, consume, sweep } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================================
   POST /api/contact  (§43)
   ----------------------------------------------------------------------------
   Validate, rate-limit, deliver. The response never distinguishes between a
   submission that reached a configured endpoint and one that did not, because
   that distinction is the operator's business and telling a caller about it
   leaks configuration.
   ========================================================================== */

export async function POST(request: Request) {
  sweep();

  const verdict = consume(clientKey(request.headers));
  if (!verdict.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(verdict.resetInSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Please check the form and try again." },
      { status: 422 },
    );
  }

  // A filled honeypot is accepted with a normal response and dropped, so an
  // automated submitter learns nothing from the reply.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  await deliver(parsed.data);

  return NextResponse.json({ ok: true }, { status: 202 });
}
