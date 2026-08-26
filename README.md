# Yukthi Lab

> **Bring certainty to an increasingly unstable world.**

The production website for Yukthi Lab: a digital mission system built around a
**Scoped Causal Hypergraph-based World Model**, and the argument for why one is
needed now.

It is not a landing page. The homepage is a twelve-act sequence that makes a
case — the world's causal structure is changing, historically fitted models fail
exactly when that happens, machine reasoning has become capable enough to
maintain an explicit causal representation continuously — and every factual claim
in it resolves to a source record you can open where it stands.

```
Map → Monitor → Forecast → Simulate → Re-map
```

---

## Contents

- [Project overview](#project-overview)
- [Architecture](#architecture)
- [The world layer](#the-world-layer)
- [Stack](#stack)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Development](#development)
- [Build](#build)
- [Testing](#testing)
- [Deployment](#deployment)
- [The evidence data model](#the-evidence-data-model)
- [How to add a source](#how-to-add-a-source)
- [How to add a research article](#how-to-add-a-research-article)
- [How to add a field note](#how-to-add-a-field-note)
- [How to add a causal scenario](#how-to-add-a-causal-scenario)
- [How to change the world layer](#how-to-change-the-world-layer)
- [How to replace demo data with real model output](#how-to-replace-demo-data-with-real-model-output)
- [Security notes](#security-notes)
- [Privacy and consent notes](#privacy-and-consent-notes)
- [Performance notes](#performance-notes)
- [Accessibility notes](#accessibility-notes)
- [Editorial rules](#editorial-rules)
- [Known limitations](#known-limitations)

---

## Project overview

| Route                            | What it is                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `/`                              | The thesis as a twelve-act sequence, with the evidence attached                    |
| `/thesis`                        | The same argument long-form, in ten numbered sections                              |
| `/architecture`                  | Ten layers from scope to decision support, each with its maturity and open problem |
| `/evidence`                      | The complete source record, filterable by category and verification status         |
| `/research`                      | Deliberately empty. Nothing has been produced, so nothing is listed                |
| `/field-notes`                   | Dated readings of published evidence, authored as MDX                              |
| `/field-notes/[slug]`            | An individual note, with the evidence it rests on                                  |
| `/about`                         | Mission, method, proof grounds, and the collaboration form                         |
| `/privacy`, `/cookies`, `/terms` | Legal, written to describe this site specifically                                  |
| `/og`                            | Generated Open Graph card                                                          |
| `/robots.txt`, `/sitemap.xml`    | Generated from the route table and the content registries                          |
| `404`                            | A route index rather than a dead end                                               |

### The twelve acts

| #   | Act                               | What it does                                                           |
| --- | --------------------------------- | ---------------------------------------------------------------------- |
| 01  | Invocation                        | The mission, a faint causal field, one way down                        |
| 02  | The stable operating system       | Why extrapolation was once the correct method                          |
| 03  | The rupture                       | Topology changes; the nodes barely move                                |
| 04  | The evidence field                | The argument stops being assertion                                     |
| 05  | Rare-earth cascade                | A concentrated upstream input beneath trillions of downstream activity |
| 06  | The linear model fails            | Chain versus hypergraph, switched by the reader                        |
| 07  | Structural break                  | Why a well-built model fails on schedule when the regime moves         |
| 08  | Feedback cascade                  | Winter Storm Uri as a reinforcing loop                                 |
| —   | Convergence _(interstitial)_      | The forces are one connected system                                    |
| 09  | The 3 a.m. problem                | A decision frame, six scopes, three causal steps each                  |
| 10  | The opening created by AI         | Five capabilities, each with its limit attached                        |
| 11  | Yukthi's bet                      | The reveal, and the operating loop                                     |
| —   | Possible futures _(interstitial)_ | Four branches, their drivers and assumptions, and no probabilities     |
| 12  | Civilizational ambition           | A horizon, not a footer                                                |

---

## Architecture

### The representation

Everything on the site is built on one data structure, defined in `data/schema.ts`:

- **`CausalNode`** — a state, actor, event, market, policy, mechanism, asset,
  risk, outcome, infrastructure or geography, with an optional observed state,
  evidence references, and an `illustrative` flag.
- **`CausalRelation`** — a **hyperedge**: `sourceIds[] → targetIds[]`, carrying a
  mechanism, polarity, causal order, state (`active` / `latent` / `broken` /
  `contested`), evidence, and alternative hypotheses.
- **`EvidenceRecord`** — a claim, its provenance, its context, its causal
  relevance, and an explicit verification `status`.

A hyperedge rather than an edge, because an ordinary graph can only say _A
affects C_. To describe the 2021 semiconductor shortage you need to say _A, B and
D together produce C, and none of them does alone_ — a relation between **sets**.
That sentence has no representation in a pairwise graph. Every diagram on the
site draws a hyperedge as `sources → junction → targets`; the junction is that
claim, made visible.

Every graph is validated with Zod at module load, so a malformed diagram fails
the build rather than rendering something misleading.

### Rendering strategy

| Layer            | Technology                    | Why                                                                                                                                 |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Causal diagrams  | Server-rendered SVG           | Accessible, printable, readable with JavaScript disabled, and crisp at any zoom                                                     |
| Interaction      | Client islands over that SVG  | Nodes are focusable controls; the diagram itself is static markup                                                                   |
| The world layer  | Server SVG, upgraded to WebGL | The globe, its routes and the causal structure render on the server; React Three Fiber loads afterwards, only where it is warranted |
| Layout and prose | React Server Components       | No client JavaScript for anything that does not need it                                                                             |

The 3D scene is skipped entirely under `prefers-reduced-motion`, without WebGL,
on a device reporting two cores or fewer, and when data-saver is on. The static
world is not a fallback — it is the same picture, drawn from the same
coordinates, and it is what renders first.

---

## The world layer

The homepage carries a second argument behind the first: one continuous world
model, pinned to the sections in front of it, that begins as a globe and is
progressively shown to be a causal structure.

It is a **layer, not a gate**. Remove it — no WebGL, reduced motion, a slow
connection, JavaScript disabled entirely — and the twelve acts are unchanged.
Nothing it shows is information that is not also written down.

### The thirteen scenes

| #   | Scene            | Anchored to                | What the world is doing                                       |
| --- | ---------------- | -------------------------- | ------------------------------------------------------------- |
| 01  | Invocation       | `#invocation`              | A horizon and a few distant, unconnected points               |
| 02  | Stability        | `#stable-world`            | Routes running on their expected paths, at a regular cadence  |
| 03  | Rupture          | `#rupture`                 | The same endpoints rerouted, made conditional, or broken      |
| 04  | Evidence         | `#evidence-field`          | Sourced records docking onto the nodes they are cited against |
| 05  | Chokepoint       | `#rare-earth`              | One upstream constraint propagating to four sectors           |
| 06  | Hypergraph intro | `#linear-failure`          | Nodes beginning to leave their map coordinates                |
| 07  | Structural break | `#structural-break`        | The scene flattens into an analytic plane                     |
| 08  | Feedback         | `#feedback` `#convergence` | A closed loop that tightens with each pass                    |
| 09  | Decision scope   | `#three-am`                | The structure narrowed to the selected scope                  |
| 10  | AI organisation  | `#ai-capability`           | Unresolved fragments resolving into structure                 |
| 11  | World model      | `#the-bet`                 | The geographic shell drops; the operating loop runs once      |
| 12  | Future space     | `#futures`                 | Four branches, widening, labelled illustrative                |
| 13  | Horizon          | `#ambition`                | The structure recedes to a horizon line                       |

### How it works

`lib/world/state.ts` holds the whole visual system as **one pure function of one
number**:

```ts
worldStateAt(t) -> { resolve, geoShell, rewire, evidence, chokepoint, morph,
                     analytic, feedback, scope, organize, loop, futures, horizon, ... }
```

`t` is scroll position expressed as a continuous coordinate over the thirteen
scenes: each scene owns the span of the sections pinned to it, and the reading
line is the middle of the viewport, so a scene peaks while its section is being
read. Every layer in the scene reads that one value and decides what it should
look like at it.

That is the entire reversibility strategy, and it is why the acceptance criterion
"all transitions must reverse correctly" is a unit test rather than a hope.
Scrolling up is not an exit animation that has to undo anything — it is the same
function evaluated at a smaller number. There is no timeline to get out of step,
no transition that can fire twice, and no stale state to reconcile.

### Three renderings of the same world

| Condition                             | What renders                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| First byte, and JavaScript disabled   | `WorldFallback` — server-rendered SVG at the current scene                                              |
| `prefers-reduced-motion: reduce`      | `ReducedMotionWorld` — the same SVG, swapped without transition; **no WebGL context is created at all** |
| No WebGL, data-saver, ≤2 cores, ≤2 GB | `WorldFallback`, permanently                                                                            |
| Capable device, after first paint     | `WorldCanvas` — React Three Fiber, cross-faded in                                                       |

The SVG and the WebGL rendering are drawn from the same coordinates, the same
routes and the same structure — `lib/world/geo.ts` and `lib/world/layout.ts` are
shared. The fallback is the picture, not a placeholder for it.

### Data

`data/world-model.ts` holds it all, under the same rules as the evidence library:

- **`worldNodes`** — real places at their real coordinates, each with the role it
  plays in one of the site's sourced cases, the evidence cited for it, and its
  position in causal space once the geographic shell is dropped.
- **`worldArcs`** — routes, and what each becomes after the structure changes:
  `held`, `rerouted` (through a named waypoint), `conditional`, or `broken`.
- **`causalOnlyNodes`** — states and mechanisms with no address. They are the
  reason a map is insufficient, and they appear only once the structure does.
- **`worldHyperedges`** — joint production, sources → junction → targets.
- **`chokepointWave`** — the propagation order of the rare-earth cascade.
- **`scopeMembership`** — what each decision scope in Act 09 is built around.
- **`landOutlines`** — coarse continent outlines, sampled procedurally. There is
  no texture, no image, and no downloaded asset anywhere in the layer.

No quantity appears in this file that is not in the evidence library, and every
node whose role is explanatory rather than observed is marked `illustrative`.

### Interaction with the page

The scope selector in Act 09 dispatches a `yukthi:scope` event; the world layer
listens and re-lights the corresponding subset of the structure. The connection
runs one way, so the selector behaves identically with the layer absent.

The layer never captures a scroll, never traps focus, never receives a pointer
event (`pointer-events: none`, `-z-10`), and is hidden from assistive technology
— because the same sequence is published beside it as prose, one paragraph per
scene, in the accessibility tree.

---

## Stack

|               |                                                      |
| ------------- | ---------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack)                   |
| Language      | TypeScript 5.9, `strict`                             |
| UI            | React 19                                             |
| Styling       | Tailwind CSS v4 with semantic design tokens          |
| Motion        | CSS animations, Motion available for choreography    |
| 3D            | Three.js + React Three Fiber, lazily loaded          |
| Content       | MDX for field notes and research                     |
| Validation    | Zod v4                                               |
| Unit tests    | Vitest + Testing Library                             |
| End-to-end    | Playwright across desktop, mobile and reduced-motion |
| Accessibility | `@axe-core/playwright`                               |
| Lint / format | ESLint 9 flat config, Prettier                       |

Fonts are Cormorant Garamond, IBM Plex Sans and IBM Plex Mono — all open source,
self-hosted at build time by `next/font`, with system-safe fallback stacks. No
request reaches a font CDN while a reader is reading.

---

## Folder structure

```
.                               <- repository root; the app is NOT in a subfolder
├── app/
│   ├── layout.tsx              root layout, fonts, providers
│   ├── page.tsx                the twelve-act homepage
│   ├── globals.css             design tokens, base layer, motion, reduced motion
│   ├── thesis/                 long-form argument
│   ├── architecture/           ten layers + benchmarks
│   ├── evidence/               source library
│   ├── research/               empty by design
│   ├── field-notes/            index + [slug]
│   ├── about/                  mission, method, collaboration form
│   ├── privacy/ cookies/ terms/
│   ├── api/contact/route.ts    validated, rate-limited enquiry endpoint
│   ├── og/route.tsx            generated Open Graph card
│   ├── sitemap.ts robots.ts not-found.tsx error.tsx
│
├── components/
│   ├── analytics/              consent-gated provider mount
│   ├── architecture/           layer accordion, conceptual flow
│   ├── brand/                  mark, wordmark
│   ├── consent/                provider, banner, preferences
│   ├── contact/                collaboration form
│   ├── evidence/               marker, drawer, card, field, library, status chip
│   ├── home/                   one component per act
│   ├── hypergraph/             renderer, glyphs, inspector, legend, text alternative
│   ├── layout/                 shell, prose, footer, skip link, JSON-LD
│   ├── navigation/             header, index drawer
│   ├── scenario/               the 3 a.m. decision frame
│   ├── thesis/                 section, sticky index
│   ├── ui/                     dialog, hairline, instrument label, action link
│   ├── visualization/          break chart, order trace, future fan, operating loop
│   └── world-model/            the homepage world layer: canvas, scene layers, fallback
│
├── content/
│   ├── field-notes/            *.mdx + registry.ts
│   └── research/               registry.ts (empty)
│
├── data/                       schema.ts + one file per causal graph, + world-model.ts
├── lib/
│   ├── analytics/ consent/ contact/ graph/ metadata/ security/ utils/
│   └── world/                  geo, layout, palette, scene state, scroll binding
├── public/icons/
├── tests/
│   ├── unit/ accessibility/ e2e/
├── .env.example  next.config.ts  playwright.config.ts  vitest.config.ts
```

---

## Installation

Requires **Node.js 20.9+** (22 LTS recommended) and npm 10+.

```bash
git clone <repository-url> yukthi-lab
cd yukthi-lab
npm install
cp .env.example .env.local
```

---

## Environment variables

Every variable is optional except `NEXT_PUBLIC_SITE_URL`, and the site runs
correctly with none of them set. See `.env.example` for the annotated list.

| Variable                                 | Required       | Purpose                                                                              |
| ---------------------------------------- | -------------- | ------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                   | For production | Canonical origin for metadata, Open Graph, robots and sitemap                        |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`         | No             | `plausible` \| `posthog` \| `ga4`. Empty means no analytics script is ever requested |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `_HOST` | With plausible |                                                                                      |
| `NEXT_PUBLIC_POSTHOG_KEY` / `_HOST`      | With posthog   |                                                                                      |
| `NEXT_PUBLIC_GA_ID`                      | With ga4       |                                                                                      |
| `CONTACT_PROVIDER`                       | No             | `resend` \| `log`. Empty behaves as `log`                                            |
| `CONTACT_API_KEY`                        | With resend    | **Server-only.** Never prefix with `NEXT_PUBLIC_`                                    |
| `CONTACT_TO_EMAIL`                       | With resend    | Where enquiries are delivered                                                        |
| `CONTACT_FROM_EMAIL`                     | With resend    | Verified sender address                                                              |

Setting an analytics provider automatically widens the Content-Security-Policy
to that provider's origins — see `analyticsOrigins()` in
`lib/security/headers.ts`. There is no second place to update.

---

## Development

```bash
npm run dev          # http://localhost:3000
npm run lint         # ESLint flat config
npm run typecheck    # tsc --noEmit
npm run format       # Prettier
```

---

## Build

```bash
npm run build
npm run start        # serves the production build on :3000
```

The build fails on a TypeScript error, an ESLint error, or a Zod violation in
any evidence record or causal graph.

---

## Testing

```bash
npm test             # Vitest: schema integrity, geometry, consent, security, components
npm run test:e2e     # Playwright: routes, homepage, navigation, accessibility
```

`npm run test:e2e` builds nothing — run `npm run build` first. Playwright starts
the production server itself. To use a pre-installed browser rather than
downloading one:

```bash
CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

### What is covered

**Unit and component (94 tests)**

- every evidence record satisfies the schema, has a unique ID, and states a status
- no record carries a non-HTTPS or malformed URL
- every verified record has a source, a date and a checked-on date
- every causal graph validates, references only nodes it contains and only
  evidence that exists, and carries a text alternative
- illustrative graphs mark every node as illustrative or evidenced
- geometry: projection, centroids, hyperedge junctions, downstream tracing by order
- label wrapping never drops a word
- consent: defaults, round-trip, version rejection, forced-necessary
- analytics sends nothing without consent _and_ a provider
- CSP directives, rate-limit windows, contact validation and the honeypot
- evidence marker naming, dialog behaviour, tablist semantics, banner parity

**End-to-end (174 tests across desktop, mobile 360px and reduced-motion)**

- every route returns 200, renders exactly one `h1`, and logs no console errors
- no horizontal overflow on any route at any of the three viewports
- all twelve acts present and reachable
- causal node → inspector → Escape; evidence marker → drawer; diagram text alternative
- decision-scope selector, representation toggle, thesis section index
- index drawer opens, traps focus across a full tab cycle, closes on Escape
- skip link is the first tab stop and moves focus to `main`
- consent: nothing stored before a choice; reject writes necessary-only; reopen from footer
- security headers present and correct on a production response
- contact endpoint: 422 with field errors, 415 for non-JSON, 405 for GET
- **axe** WCAG 2.1 A/AA scan on eight routes, plus the open inspector dialog
- heading order coherent; 200% zoom without a horizontal scrollbar
- reduced motion: nothing left invisible, and no WebGL canvas created

---

## Deployment

### Vercel

1. Import the repository.
2. Framework preset: **Next.js**. Build `npm run build`, output `.next`.
3. **Root Directory: leave it blank.** The application lives at the repository
   root, not in a subfolder. Setting it to anything — including `yukthi-lab` —
   fails the deploy with _"The specified Root Directory does not exist"_.
4. Node version is pinned to 22.x by `engines.node`; leave Vercel's setting on
   its default so it honours that.
5. Optionally set `NEXT_PUBLIC_SITE_URL` and any analytics or contact variables
   from the table above. None are required — see below.
6. Deploy.

No environment variable is required for a working deploy. `siteUrl()` falls back
to `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel injects automatically, and it is
only ever called from server components — so canonical URLs, Open Graph images,
`robots.txt` and the sitemap all resolve correctly with nothing configured. Set
`NEXT_PUBLIC_SITE_URL` explicitly once a custom domain is attached.

Security headers are applied through `next.config.ts`, which Vercel honours — no
`vercel.json` and no edge middleware are needed.

**If the build fails**, the error is almost always one of three things: a Root
Directory that is not blank, a Node version older than 20.9, or a stale build
cache — redeploy with "Use existing Build Cache" unchecked.

### Any Node host

```bash
npm ci
npm run build
NEXT_PUBLIC_SITE_URL=https://your-domain npm run start
```

Serve behind a TLS-terminating proxy. The application emits HSTS, which browsers
ignore over plain HTTP, so no conditional configuration is required. If the proxy
sets `x-forwarded-for`, the contact rate limiter will key on the real client
address.

### Docker

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Post-deploy checks

```bash
curl -sI https://your-domain | grep -i 'content-security-policy\|strict-transport'
curl -s  https://your-domain/robots.txt
curl -s  https://your-domain/sitemap.xml | head
curl -sI https://your-domain/og | grep -i content-type   # image/png
```

---

## The evidence data model

```ts
export interface EvidenceRecord {
  id: string; // E-001 … E-999, unique
  title: string;
  organization?: string; // who published it
  publication?: string; // the specific document
  date?: string; // when it was published
  url?: string; // omitted rather than guessed
  claim: string; // the one sentence it is cited for
  context?: string; // scenario conditions, hedges, what it does not say
  causalRelevance?: string; // why it matters causally, not just that it is interesting
  categories: EvidenceCategory[];
  status: "verified" | "needs-verification" | "illustrative";
  accessedAt?: string; // when the source was last checked
}
```

**Status means something specific:**

- **verified** — checked against the cited publication. Units, scenario
  conditions and hedges preserved. A range is never quoted as a point estimate.
- **needs-verification** — recorded from a secondary summary; the primary
  document has not been read end to end. Shown with this label everywhere it is
  cited. Never quietly promoted, never quietly dropped.
- **illustrative** — not a factual claim. A mechanism drawn to explain how
  something could propagate.

---

## How to add a source

1. Append a record to `evidenceRecords` in `data/evidence.ts` with the next free
   ID.
2. Write the `claim` as one sentence the cited document actually supports.
3. Put the scenario conditions and hedges in `context` — this is where a
   figure's "under full implementation" or "in a severe scenario" belongs.
4. Write `causalRelevance`: why the claim matters causally.
5. Set `status`. If you have not opened the primary document, it is
   `needs-verification`. That is not a failure state; leaving it wrong is.
6. Set `accessedAt` to the date you checked it. Add a `url` only if you visited
   it and it resolves. **Never invent a URL** — omit the field and the card will
   say "No stable link recorded".
7. `npm test` — the schema, ID uniqueness, URL and completeness checks run there.

Cite it inline anywhere with `<EvidenceMarker id="E-018" />`, including inside
MDX.

---

## How to add a research article

1. Create `content/research/<slug>.mdx`.
2. Export the metadata:

   ```mdx
   export const meta = {
     slug: "calibration-under-structural-change",
     title: "Calibration under structural change",
     date: "2026-11-04",
     summary: "One sentence.",
     kind: "evaluation", // paper | technical-note | experiment | evaluation | benchmark
     status: "published", // draft | published
   };
   ```

3. Import it in `content/research/registry.ts` and push it into `entries`.

`/research` switches from its empty state to the list automatically, and the
sitemap picks the entry up. **Do not add a placeholder.** The page says nothing
has been produced because nothing has, and that is the point.

---

## How to add a field note

Identical, in `content/field-notes/`, with `tags: string[]` and optional
`evidenceIds: string[]`. Listed evidence is rendered in full at the foot of the
note. Notes sort newest-first by `date`.

Field notes are the lab's own readings of published evidence. They argue; they do
not report results. Any factual claim inside one needs an `<EvidenceMarker />`.

---

## How to add a causal scenario

**A decision scope** (the 3 a.m. selector) — append to `scenarios` in
`data/scenarios.ts`: a `role`, the `question` that role loses sleep over, the
`assumption` that would have to break, and a three-step `trace` of `{ order,
label, mechanism }`. `illustrative: true` is required by the type.

**A causal graph** — add a file to `data/`:

```ts
export const myGraph: CausalGraph = causalGraphSchema.parse({
  id: "my-graph",
  title: "…",
  scope: "The decision this structure was mapped for",
  illustrative: false, // false only if the structure was observed
  evidenceIds: ["E-004"],
  textAlternative: "A full prose reading — this is what a screen reader gets.",
  nodes: [
    {
      id: "n1",
      label: "…",
      kind: "policy",
      position: { x: 0.1, y: 0.5 }, // normalised 0–1
      labelSide: "below", // above | below | left | right
      state: "…",
      evidenceIds: ["E-004"],
    },
  ],
  relations: [
    {
      id: "r1",
      sourceIds: ["n1", "n2"], // more than one source makes it a hyperedge
      targetIds: ["n3"],
      label: "joint constraint",
      mechanism: "How the effect is transmitted.",
      polarity: "negative",
      order: 1,
      state: "active",
      alternatives: ["A reading that would also explain the observation."],
    },
  ],
});
```

Render it with `<CausalHypergraph graph={myGraph} height={560} minWidth={1000} />`.

Layout is authored, not force-simulated: a causal argument reads in a particular
order, and a physics layout would scramble it on every load. Use `labelSide` to
resolve collisions. Only hyperedges and second- or third-order relations get a
label on the canvas; everything else is one click away in the inspector.

---

## How to change the world layer

**To move or add a place:** add an entry to `worldNodes` in
`data/world-model.ts` with its real latitude and longitude, the role it plays,
its causal-space position, the scenes it should be lit in, and the evidence ids
that support the role. Zod validates the record at module load. Nothing else
needs to change — the globe, the fallback SVG, the labels and the structure all
read from that one list.

**To add or change a route:** add to `worldArcs`. `after` states what the route
becomes once the structure changes, and `reroute` names the waypoint a rerouted
path runs through. A route that moves between the two arrangements is exactly a
route with a `reroute`, and a unit test asserts that correspondence.

**To change what a scene does:** edit its entry in `WORLD_SCENES`
(`lib/world/state.ts`) for its anchors, camera framing, focus node, readout line
and text alternative — and edit the ramps in `worldStateAt` for its visual
behaviour. Keep both in step: the text alternative is the accessible equivalent
of the scene, and a scene whose description no longer matches what it draws is a
defect, not a cosmetic drift.

**To re-pin a scene to a different section:** change its `anchors`. The scroll
binding measures whatever ids are listed, in document order, and a scene may own
more than one section.

**To add a scene:** append to `WORLD_SCENES`, add its ramp to `worldStateAt`, and
give the new section an `id`. `SCENE_COUNT` and the readout follow automatically;
the unit tests will fail until the new scene has a text alternative.

---

## How to replace demo data with real model output

The schema already carries the fields real output needs, so nothing has to
migrate.

1. **Probabilities.** `FutureBranch.probability` and `calibrationStatus` exist
   and are deliberately `undefined` in `data/futures.ts`. Populate them and
   remove the "No probability attached" line in
   `components/visualization/FutureFan.tsx`.
2. **Confidence.** `CausalNode.confidence` and `CausalRelation.confidence` render
   as a percentage in the inspector when present, and as "Not recorded — no
   calibrated estimate exists" when absent. Populating them is enough.
3. **Illustrative flags.** Flip `illustrative: false` on a graph _only_ when its
   structure was observed rather than constructed. The `IllustrativeBadge`
   disappears on its own.
4. **Timestamps.** `CausalNode.timestamp` drives the inspector's "Last update".
   A live monitor should write it on every state change.
5. **Relation state.** `active` / `latent` / `broken` / `contested` is what a
   monitor should be updating. A relation can break while every node it connects
   looks unchanged — that transition is the thing worth surfacing.
6. **Serving.** `CausalGraph` is plain JSON. Swap the static import for a fetch
   and keep `causalGraphSchema.parse()` at the boundary, so bad output fails
   loudly instead of rendering.

---

## Security notes

Full detail in [`SECURITY.md`](./SECURITY.md). In short: hardened headers set in
one place (`lib/security/headers.ts`), Zod validation on the server, rate
limiting, a honeypot and a minimum submission time, no cookies, no session, no
secrets in the client bundle, and `rel="noopener noreferrer"` on every outbound
link.

Two limitations are documented rather than papered over: `script-src` permits
inline scripts because Next.js 16 serves a prerendered shell that a per-request
nonce cannot reach, and rate limiting is in-process.

---

## Privacy and consent notes

- **One storage key**, `yukthi.consent.v1`: four booleans and a timestamp. No
  identifier. Never transmitted.
- **Necessary-only by default.** Nothing optional is pre-checked.
- **No dark patterns.** "Reject optional", "Accept all" and "Choose categories"
  are the same size, weight and colour — a unit test asserts their class lists
  are identical.
- **Analytics loads only after consent.** The script tag is not rendered at all
  until the category is granted, so no request reaches a third party first.
- **A closed event list.** `lib/analytics/events.ts` is the complete set. No
  free text, no reading history beyond those events.
- **Consent is an external store.** Read through `useSyncExternalStore` over
  `localStorage`, so the UI cannot drift from what is persisted and a decision
  made in one tab propagates to the others.

---

## Performance notes

- Server Components by default; client boundaries kept narrow and explicit.
- No animation library is bundled. Every entrance, sequence and loop on the site
  is CSS keyframes with an ordered `--delay`, which costs nothing at runtime and
  is collapsed to its final state by the reduced-motion reset.
- Diagrams are server-rendered SVG — no client JavaScript to draw them, and no
  layout shift when the interaction layer hydrates.
- The Three.js chunk is an _enhancement_, never content. It is dynamically
  imported with `ssr: false`, after first paint, and only when WebGL exists,
  motion is not reduced, the connection is not reported as slow or metered, and
  the device reports more than two cores and more than 2 GB of memory. Everything
  the world layer means is already on screen in SVG before that decision is
  taken, so a reader who never receives it loses nothing.
- Devices between that floor and a comfortable desktop — and every viewport
  under 820px — get the same scene at reduced complexity: a coarser graticule,
  fewer landmass samples, fewer evidence markers, lower geometry detail and a
  lower device-pixel-ratio ceiling. Weak devices are given less, not nothing.
- One WebGL context for the whole page, asserted by test. The frame loop switches
  to `demand` while the tab is hidden.
- All world geometry — graticule, rings, routes, landmass, hypergraph buffers —
  is built once and written in place afterwards. There are no per-frame
  allocations, and the arc and hyperedge layers are one draw call each.
- Scroll updates a ref, not React state: the continuous scene coordinate never
  triggers a render, and only the scene index (thirteen changes over the whole
  page) does.
- Labels are DOM, positioned from a projection written directly to `style` in an
  animation frame — real text at real font sizes, legible at 200% zoom, rather
  than glyphs baked into a canvas.
- Fonts self-hosted, `display: swap`, subset to latin.
- No images in the critical path. The only raster asset the site serves is the
  generated OG card, which is never fetched by a reader.
- Fixed viewBoxes and reserved figure heights: CLS is structurally near zero.
- Wide diagrams scroll inside their own frame; the page body never scrolls
  sideways at any tested viewport.

---

## Accessibility notes

Target: **WCAG 2.2 AA**. Verified with axe on every content route and on the open
inspector dialog, at 1440px, 360px and under reduced motion.

- Semantic landmarks, one `h1` per route, no heading-level jumps.
- Skip link as the first tab stop, moving focus to `main`.
- Every causal node is a focusable control with a descriptive accessible name;
  Enter and Space open the inspector.
- Every diagram has a prose alternative **always present in the DOM** — a
  `<details>` a keyboard user can open, not a hover-only tooltip.
- Colour is never the only carrier: relation state also has a stroke pattern,
  causal order also has a printed degree.
- Diagram text is drawn with a halo so it stays legible where it crosses an edge.
- Dialogs: `role="dialog"`, `aria-modal`, focus trapped, Escape closes, focus
  restored, background scroll locked.
- A scrollable figure with no interactive content is itself focusable, so a
  keyboard user can reach the off-screen part.
- Touch targets are at least 44px.
- Contrast: every token pair used for text meets AA. `--color-dim-bone` was
  lightened from `#6f6c66` to `#85827a` after measuring 3.83:1 — the earlier
  value read well and failed.
- The world layer behind the homepage is hidden from assistive technology, and
  the same thirteen scenes are published beside it as prose — one described state
  per scene — so nothing it shows is available only to people who can see it.
- Reduced motion: every animation fills forwards, so collapsing durations lands
  on the complete final state rather than on an invisible one. No parallax, no
  auto-camera, no scroll hijacking, and no WebGL scene at all — under `reduce`
  the world layer is a static SVG that swaps between states without transition,
  and a test asserts that zero canvases are created.

---

## Editorial rules

These are enforced by tests where they can be, and by review where they cannot:

- No invented customers, partnerships, publications, benchmark results, model
  accuracy figures, probabilities or case-study outcomes.
- No invented URLs. A record with no verified link says so.
- No claim that the system predicts the future. The promise is _know what could
  break before it becomes your 3 a.m. problem_.
- No claim that AI outperforms trained superforecasters. The evidence shows
  frontier models past a general crowd baseline and still behind experts, and the
  site says exactly that.
- Illustrative material is labelled where it appears, not in a footnote.
- Absent data renders as "Not recorded". Filling an empty field with a plausible
  number would be the most damaging thing this interface could do.

---

## Known limitations

1. **`script-src 'unsafe-inline'`** — see [`SECURITY.md`](./SECURITY.md).
2. **In-process rate limiting** — per-instance, not per-fleet.
3. **`/research` is empty** — by design. Nothing has been produced.
4. **No architecture layer is past concept or open research** — no evidence of
   greater maturity has been supplied, so none is claimed.
5. **Two evidence records are unverified** — `E-009` (ECB Economic Bulletin
   3/2022, recorded from a secondary summary) and `E-014` (a preprint). Both are
   labelled wherever they appear.
6. **No calibrated probabilities exist.** The future fan shows four branches at
   equal weight because weighting them would imply a number no model produced.
7. **Illustrative structures**: the stable lattice, the ruptured topology, the
   linear chain, the insurance accumulation graph and the convergence chain are
   explanatory constructions. Each stage of the convergence chain is evidenced;
   its combination into one path is not.
8. **Contact delivery is unconfigured** by default. An enquiry is logged, and the
   sender is told plainly that it was not delivered.
9. **The world layer's landmass outlines are coarse.** They are hand-authored
   polygons at roughly continental resolution, drawn to let a reader orient
   themselves, and deliberately not precise enough to be read as a survey.
10. **Three world routes are illustrative** — the container, bulk-mineral and
    seaborne-energy flows exist to show what an arrangement of routes looks like
    and what happens to one when it is rerouted. They carry no sourced quantity,
    and they are marked `illustrative` in the data.

---

© Yukthi Lab. Illustrative diagrams are labelled as such and are not model output.
