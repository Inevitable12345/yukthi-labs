# Deployment

## Requirements

- Node.js 22.x (pinned in `package.json` → `engines`)
- npm 10+

## Build and run

```bash
npm ci
npm run verify      # lint, typecheck, unit tests, production build
npm run build
npm run start
```

`npm run verify` is the gate. It runs the same four checks CI should run, in the
order that fails fastest.

## Environment

Copy `.env.example` to `.env.local`. Every variable is optional.

The only one that matters in production is `NEXT_PUBLIC_SITE_URL`. It sets
canonical URLs, Open Graph tags, `sitemap.xml` and `robots.txt`. If it is unset
or blank the site falls back to `http://localhost:3000`, which is correct for
local development and wrong in production — search engines will index canonical
URLs pointing at localhost. **Set it before the first production deploy.**

## Two things to configure before production

### 1. Contact delivery

`lib/contact/adapter.ts` ships a logging implementation. Submissions are
validated, rate limited and written to the server log — and **not emailed
anywhere**. This is deliberate: wiring a specific transactional email provider
would either commit a vendor choice this project has not made, or ship code that
fails silently without credentials.

To deliver mail, implement the `ContactDelivery` interface and register it at
startup:

```ts
import { setContactDelivery } from "@/lib/contact/adapter";

setContactDelivery({
  async deliver(input) {
    // your provider here
    return { delivered: true };
  },
});
```

The route (`app/api/contact/route.ts`) needs no changes.

### 2. Rate limiting

`lib/security/rate-limit.ts` is a fixed-window limiter held in process memory.

On a single instance it works exactly as intended. **On multi-instance or
serverless hosting it becomes per-instance**, so the effective limit is the
configured limit multiplied by the number of running instances. The interface is
deliberately the shape a Redis-backed limiter would have, so replacing it is a
single-file change.

Whether that matters depends on your threat model. For a contact form on a
company site it is usually adequate; if this endpoint ever carries something more
valuable, replace it first.

## Security headers

Set in `next.config.ts` from `lib/security/headers.ts`, and asserted by
`tests/unit/security.test.ts` plus an end-to-end check.

The CSP allows `'unsafe-inline'` for styles — Next injects critical CSS inline
and React Three Fiber sets inline styles on elements. `'unsafe-eval'` is
permitted **in development only**, for React Refresh; a unit test fails the build
if it ever reaches the production policy.

`connect-src` is `'self'`. There is no analytics, and a tracker cannot be added
without an explicit, reviewable change to that line.

## Hosting notes

The site is almost entirely static. Two routes are dynamic:

- `/api/contact` — the form endpoint
- `/og` — the Open Graph image, rendered per request

Everything else is prerendered at build time.

**Server logs.** The privacy page states that request logs are a property of the
deployment rather than of this application. Configure retention on your platform
to match what that page claims, or amend the page.

## Continuous integration

```bash
npm ci
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
```

The Playwright config uses a pre-installed Chromium at `/opt/pw-browsers/chromium`
when one exists, and otherwise resolves its own — so the same config works on a
CI image that ships a browser and on one that does not.
