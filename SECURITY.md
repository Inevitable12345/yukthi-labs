# Security

## Reporting

Report a vulnerability through the contact form at `/contact`, or to the address
in `lib/metadata/site.ts`. Please include reproduction steps. You will get an
acknowledgement; please allow reasonable time before public disclosure.

## What this application is

A content site with one write endpoint (`POST /api/contact`). No user accounts,
no sessions, no database, no cookies, no local storage, no third-party scripts,
and no secrets in the client bundle.

## Controls

| Control                                                            | Where                         | Verified by      |
| ------------------------------------------------------------------ | ----------------------------- | ---------------- |
| Content Security Policy                                            | `lib/security/headers.ts`     | unit + e2e       |
| `X-Frame-Options: DENY`, `nosniff`, HSTS, Permissions-Policy, COOP | same                          | unit + e2e       |
| Server-side input validation                                       | `lib/contact/schema.ts` (Zod) | unit + e2e       |
| Rate limiting                                                      | `lib/security/rate-limit.ts`  | unit + e2e       |
| Honeypot                                                           | contact form and route        | unit + component |

### Content Security Policy

`connect-src 'self'` — no third-party network connections. Analytics cannot be
added without an explicit, reviewable change to that line.

`'unsafe-inline'` is allowed for styles: Next injects critical CSS inline and
React Three Fiber sets inline styles on elements. `'unsafe-eval'` is permitted in
development only, for React Refresh; a unit test fails if it reaches the
production policy.

### The contact endpoint

- Validated server-side with the same schema the client uses. The server copy is
  the trust boundary; the client copy is a convenience.
- Rate limited per IP, with `Retry-After` on rejection.
- A filled honeypot is accepted with a success response and discarded. Telling a
  bot it failed only teaches it to retry.
- No user input is reflected in any response.
- JSON parse failures return 400, never a 5xx.

## Known limitations

Both are deliberate, and both are documented in `docs/DEPLOYMENT.md` rather than
papered over:

1. **The rate limiter is in-process.** On multi-instance or serverless hosting it
   becomes per-instance, so the effective limit multiplies by instance count.
   Replace with a shared store if this endpoint ever carries more value.

2. **The IP is read from `x-forwarded-for`.** Spoofable by a determined caller,
   which is why the limiter is one layer rather than the only one.

## Dependencies

`npm audit` reports zero vulnerabilities at the pinned versions. Run it before
each release.
