# Yukthi Lab

**Bring certainty to an increasingly unstable world.**

A production Next.js application that presents Yukthi Lab's thesis as an
interactive argument rather than a landing page. The visitor scrolls through
thirteen chapters while a persistent WebGL instrument transforms from an abstract
globe into a causal hypergraph — because that transformation _is_ the argument.

The technical bet: a **Scoped Causal Hypergraph-based World Model**.
The operating loop: **Map → Monitor → Forecast → Simulate → Re-map**.

---

## Quick start

```bash
npm ci
npm run dev          # http://localhost:3000
```

Verify everything before shipping:

```bash
npm run verify       # lint → typecheck → unit tests → production build
npm run test:e2e     # Playwright, desktop + mobile, including axe WCAG checks
```

## Scripts

| Script            | Does                                                    |
| ----------------- | ------------------------------------------------------- |
| `dev`             | Development server                                      |
| `build` / `start` | Production build and serve                              |
| `lint`            | ESLint (flat config)                                    |
| `typecheck`       | `tsc --noEmit`, strict, with `noUncheckedIndexedAccess` |
| `test`            | Vitest — 94 unit and component tests                    |
| `test:e2e`        | Playwright — 73 tests across desktop and mobile         |
| `verify`          | The gate: lint, typecheck, test, build                  |
| `format`          | Prettier                                                |

## Routes

| Route                | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| `/`                  | The argument. Thirteen chapters, one persistent causal world.          |
| `/thesis`            | The same argument as a long-form essay.                                |
| `/technology`        | What "Scoped Causal Hypergraph-based World Model" means, term by term. |
| `/evidence`          | Every source behind every claim, with what each figure does not say.   |
| `/research`          | Open problems and the four proof questions.                            |
| `/contact`           | Validated, rate-limited contact flow.                                  |
| `/privacy`, `/terms` | Legal. Short, because there is little to describe.                     |

## Stack

Next.js 16 · React 19 · TypeScript (strict) · Three.js + React Three Fiber ·
GSAP + ScrollTrigger · Tailwind CSS v4 · Zod · Vitest · Playwright

## How it works

Three documents cover the design:

- **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** — the story state machine,
  the eight world forms, progressive enhancement, and why the ESLint config makes
  exactly one scoped exception.
- **[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)** — build, environment, and the
  **two things to configure before production**.
- **[`docs/ATTRIBUTION.md`](docs/ATTRIBUTION.md)** — licences, including a note
  on GSAP's licence being non-OSI.

The short version: there is one set of nodes, each holding a position in eight
different layouts. The world interpolates between two of them every frame. The
globe at the start and the hypergraph at the end are literally the same object,
which is the claim the site is making.

## Two things to configure before production

1. **`NEXT_PUBLIC_SITE_URL`** — otherwise canonical URLs point at localhost.
2. **Contact delivery** — `lib/contact/adapter.ts` ships a logging
   implementation. Submissions are validated, rate limited and logged, but **not
   emailed**. Implement `ContactDelivery` for your provider.

Also read the note in `docs/DEPLOYMENT.md` about the in-memory rate limiter
becoming per-instance on serverless hosting.

## Editorial rules this codebase enforces

These are enforced by tests and types, not by intention:

- **Every causal relation carries a mechanism.** A relation without one is an
  association wearing a causal label. Required by the schema.
- **No scenario contains a probability.** A test serialises the scenario data and
  fails if one appears. A fabricated probability is worse than none, because it
  invites the reliance it cannot support.
- **Every claim declares its epistemic class** — observed fact, source claim,
  Yukthi interpretation, illustrative scenario, or product ambition — and they
  render distinctly.
- **Every evidence record states what its figure does not say.** A number without
  its limits is a misquotation.
- **Unverified sources are labelled**, everywhere they appear, rather than
  quietly omitted.
- **Nothing is fabricated.** There are no customers, pilots, traction figures,
  accuracy claims, partnerships or market sizes on this site, because none exist.
  Publishing them would contradict the argument the site makes about evidence.

## Accessibility

The complete argument is static HTML. An end-to-end test runs with JavaScript
disabled and asserts the thesis, evidence and conclusion all survive.

Every route passes axe WCAG 2.1 A/AA with zero violations, on desktop and mobile.
Reduced motion is a first-class path, not a fallback: pinning is disabled, the
frameloop runs on demand, and all content is present at once.

## Content sources

Seventeen evidence records from the IMF, WTO, WEF, IEA, CSIS, FERC/NERC, the ECB,
AlixPartners, Swiss Re and peer-reviewed forecasting research. Fifteen verified
against the cited publication; two labelled unverified wherever they appear.

## Licence

Source code: MIT. Written content and evidence characterisations: © Yukthi Lab.
Cited documents remain the property of their publishers — see
[`docs/ATTRIBUTION.md`](docs/ATTRIBUTION.md).
