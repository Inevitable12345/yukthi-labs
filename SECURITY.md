# Security

## Reporting

If you find a vulnerability in this site, please report it through the
collaboration channel on `/about` rather than opening a public issue. Include
the affected route, what you observed, and how to reproduce it.

## What this application is

A static content site. It has no accounts, no sessions, no database, and no
user-generated content. The only endpoint that accepts input is
`POST /api/contact`.

## Controls in place

| Area                   | Control                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| Transport              | HSTS with a two-year max-age and `upgrade-insecure-requests` in the CSP                                |
| Framing                | `frame-ancestors 'none'` and `X-Frame-Options: DENY`                                                   |
| MIME sniffing          | `X-Content-Type-Options: nosniff`                                                                      |
| Referrer               | `strict-origin-when-cross-origin`                                                                      |
| Browser features       | `Permissions-Policy` denies camera, microphone, geolocation, payment, USB, sensors, topics and cohorts |
| Cross-origin isolation | `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`                 |
| Script execution       | `script-src 'self' 'unsafe-inline'`; no `unsafe-eval` in production                                    |
| Plugins and framing    | `object-src 'none'`, `frame-src 'none'`                                                                |
| Base tag injection     | `base-uri 'self'`                                                                                      |
| Form exfiltration      | `form-action 'self'`                                                                                   |
| Remote resources       | No remote script, style, font or image origin unless an analytics provider is configured               |
| Input validation       | Zod schema on the server; the client cannot bypass it                                                  |
| Abuse                  | Fixed-window rate limit per IP, honeypot field, and a minimum submission time                          |
| CSRF                   | JSON-only content type, same-origin check, no cookies or session to ride on                            |
| Secrets                | Server-only variables are never `NEXT_PUBLIC_`; `.env.example` holds no values                         |
| External links         | Every outbound link carries `rel="noopener noreferrer"`                                                |

## Known limitation: `script-src 'unsafe-inline'`

Next.js 16 serves a prerendered HTML shell for every route in this application,
dynamic routes included. A per-request nonce cannot reach a document rendered
before the request existed, and a nonce baked in at build time is a constant —
no stronger than `unsafe-inline`, while appearing considerably stronger.

Rather than ship that, the policy permits inline scripts explicitly and says so.
What limits the exposure is that this site renders no user-supplied content
anywhere: no comments, no search echo, no query parameters written into the DOM,
no third-party embeds. There is no ordinary path by which attacker-controlled
markup enters a page.

If a future Next.js version applies request nonces to the served shell, restore
`'nonce-…' 'strict-dynamic'` in `lib/security/headers.ts` and drop
`'unsafe-inline'`. Everything else in the policy stays as it is.

## Known limitation: in-memory rate limiting

`lib/security/rate-limit.ts` keeps its counters in process memory. On a single
Node instance that is a real control. Across several instances or a serverless
fleet, each instance keeps its own counter, so the effective limit is the
configured limit multiplied by the number of live instances.

For a contact form that is an acceptable first line. A deployment that needs a
hard guarantee should back `hit()` with Redis or the platform's own rate
limiter; the call site does not change.

## Dependency hygiene

Run `npm audit` before each release. Dependencies are deliberately few: Next,
React, Tailwind, Zod, Motion, Three.js and MDX. No analytics SDK, no UI kit, no
component library, no chat widget.
