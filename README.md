# Yukthi Lab

> **Bring certainty to an increasingly unstable world.**

An immersive civilizational thesis, built as an exhibition rather than a landing
page. Twenty rooms carry one argument: the world's structure changed, the
existing analytical toolkit is insufficient _in combination_, and the missing
layer is an explicit, continuously updated causal structure — a **Scoped Causal
Hypergraph-based World Model**.

```
MAP → MONITOR → FORECAST → SIMULATE → RE-MAP
```

---

## What this repository contains

| Route         | What it is                                                         |
| ------------- | ------------------------------------------------------------------ |
| `/`           | The exhibition. Twenty rooms and an observatory, in argument order |
| `/thesis`     | The same argument as long-form prose, with every source attached   |
| `/technology` | What the scoped causal hypergraph is, and what it is not           |
| `/evidence`   | Every source, with claim and interpretation kept apart             |
| `/research`   | Two worked case studies and five open research questions           |
| `/contact`    | Institutional contact                                              |
| `/privacy`    | What the site collects — a short page, because the answer is short |

---

## The rules this site is built under

These are not aspirations; several are enforced by tests.

- **No invented facts.** Every figure on the site is one its named source
  reports. Where a number is a third party's estimate rather than a measurement,
  the record says so.
- **No fabricated citations or links.** A record carries a `url` only where a
  stable published address is known; otherwise it carries a `locator` naming the
  publisher and document precisely enough to find. A link that might rot into a
  404 is worse than no link.
- **Four kinds of statement never blur.** Source fact, Yukthi interpretation,
  illustrative scenario and product ambition each carry a visible class
  (`lib/graph/types.ts`), printed next to the claim.
- **No probabilities.** None are published anywhere, because none have been
  earned. `tests/unit/evidence.test.ts` fails the build if one appears.
- **No customers, pilots, revenue, partnerships, patents, market size or
  investment status** are claimed, because none can be substantiated.
- **The argument works without WebGL, without JavaScript, and without motion.**
  See _Degradation_, below.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # optional; sensible defaults without it
npm run dev                    # http://localhost:3000
```

Node 20.9+ (22.x recommended).

### Scripts

| Command                | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Development server                                      |
| `npm run build`        | Production build                                        |
| `npm run start`        | Serve the production build                              |
| `npm run lint`         | ESLint, including the React compiler rules              |
| `npm run typecheck`    | `tsc --noEmit`, strict, with `noUncheckedIndexedAccess` |
| `npm test`             | Unit and component tests (Vitest)                       |
| `npm run test:e2e`     | Browser tests, desktop and mobile (Playwright + axe)    |
| `npm run format:check` | Prettier                                                |
| `npm run verify`       | All of the above, in the order CI should run them       |

`npm run test:e2e` builds nothing itself — run `npm run build` first, since the
Playwright config starts `npm run start`.

---

## Architecture

```
app/                    Routes. Every page is a server component; the
                        argument is in the initial HTML.
components/
  story/                Room shell, scroll driver, coordinate readout, index
  scenes/               One component per room
  world/                The persistent WebGL instrument and its fallback
  causal/               Hypergraph diagram, the reveal, the simulator
  evidence/             The inspector and the library
  scope/                The scope lens
  ui/  layout/  brand/  Primitives
content/
  thesis.ts             Every word the exhibition speaks, keyed by room
  evidence.ts           The evidence library
  scenarios.ts          Causal graphs and the illustrative scenario
  decisions.ts          The six 3 a.m. decision scopes
lib/
  story/                Room definitions and deterministic story state
  graph/                Causal data model, traversal, deterministic layout
  world/                Form geometry, camera grammar, seeded random
  performance/          Device tiers and the WebGL probe
  accessibility/        Reduced motion, intersection
  security/             CSP, headers, rate limiting
  contact/              Submission schema and delivery
```

### How the story state works

`ScrollTrigger` writes two numbers into a store outside React: which room holds
the viewport, and how far through it the visitor is. Nothing is animated from
that file.

- **Chapter changes** are rare and everyone cares → a React subscription.
- **Progress** changes every scroll frame → plain reads. WebGL reads it in
  `useFrame`; the few scrubbed DOM scenes poll through `useChapterProgress`.

The store holds a _position_, not a playhead, so reverse scroll is not a special
case and a fast scroll never queues a backlog of animation.

Rooms are held with CSS `position: sticky` rather than ScrollTrigger's pin.
Sticky does not clone or re-parent the element, so focus order, anchor links and
the accessibility tree stay exactly as authored.

### How the world instrument works

One point cloud and one relation mesh for the whole exhibition. When the room
changes, current positions become the origin of the next morph and the target
buffer is rewritten — the object is continuously the same object, and the
transformation is what the visitor watches.

Geometry (`lib/world/forms.ts`) is a pure function of `(form, index, count)`, so
it is identical on every reload, testable without a renderer, and — crucially —
renders in two pipelines: the WebGL particle system and the SVG fallback.

Relations crossfade rather than morph. Their topology genuinely differs between
forms (a causal layer is not a trade route), and interpolating between two
different meanings would produce a third that means nothing.

---

## Degradation

| Condition                    | What happens                                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **No WebGL**                 | The SVG fallback world renders the same geometry. Never a blank canvas. Covered by `tests/e2e/no-webgl.spec.ts`                                                          |
| **No JavaScript**            | Every room's text, ladders, diagrams-as-text and evidence are in the initial HTML. Reveals are visible by default and only hidden under `@media (scripting: enabled)`    |
| **`prefers-reduced-motion`** | Camera travel, orbit and parallax stop; morphs become discrete transitions; the scenario shows all waves at once. Diagrams, text, evidence and interaction are untouched |
| **Low-end device**           | Three performance tiers pick particle count, relation count and DPR ceiling. Mobile reduces density and camera movement rather than shrinking the desktop layout         |
| **Narrow viewport**          | The room index (a desktop affordance) is dropped; the coordinate readout and the scroll carry orientation                                                                |

---

## Accessibility

Checked by `@axe-core/playwright` against WCAG 2.1 A and AA on every route, in
both desktop and mobile viewports, as part of `npm run test:e2e`.

Beyond the automated check:

- Every room is a `<section>` with an accessible name from the exhibition
  structure, so the document outline reads as the argument.
- Nothing essential lives only inside a graphic. Every causal diagram publishes
  its complete structure as text beside itself.
- Text contrast is never animated. Where a scene shows arrival or activation, it
  does so with colour, position or a graphic element — never by making words
  harder to read.
- The evidence inspector is a disclosure, not a modal: no focus trap, no scroll
  lock, and the opened record sits in reading order right after its trigger.
- Horizontally scrollable regions are focusable and named.
- No information is conveyed by hover alone.

---

## Security and privacy

- A narrow Content-Security-Policy (`lib/security/headers.ts`). The site loads no
  remote fonts, no third-party stylesheets and no external assets, so
  `default-src 'self'` is nearly the whole policy. `unsafe-eval` is
  development-only.
- `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `nosniff`, a strict
  `Referrer-Policy`, `Permissions-Policy` and HSTS.
- No cookies, no local storage, no fingerprinting. Analytics is opt-in via
  environment variable and, when enabled, cookieless.
- The contact endpoint validates with Zod on the server (the client's validation
  is a courtesy, not a control), rate-limits per address, and carries a honeypot
  that returns a normal response so an automated submitter learns nothing.
- No secret is ever read on the client. Only `NEXT_PUBLIC_*` reaches the browser.

Run `npm audit` before a release.

---

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for Vercel (recommended),
Docker and self-hosted Node.

Further reading: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** and
**[docs/ATTRIBUTION.md](docs/ATTRIBUTION.md)**.

---

## Licence and attribution

Application code in this repository is available under the MIT licence
(`LICENSE`). The Yukthi Lab name, wordmark and thesis text are not.

Third-party dependencies and the public documentation consulted while building
the scroll and WebGL techniques are credited in `docs/ATTRIBUTION.md`. No
external site's visual identity, assets or code were copied.
