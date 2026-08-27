# Architecture

## The one idea

The site is an argument, and the scroll is the argument. Everything below exists
to keep one claim honest: that the globe the reader watches at the start and the
causal hypergraph they watch at the end are **the same object**, reorganised.

That is not a metaphor in the implementation. There is one set of nodes. Each
node holds a position in each of eight layouts. The world interpolates between
two of them every frame. Nothing is created, destroyed, or cross-faded.

## Layers

```
lib/story/          the spine — chapter order, state, GSAP wiring
lib/world/          geometry, camera grammar, palette
components/world/   the WebGL instrument
components/scenes/  the thirteen chapters as DOM
components/hypergraph/  the 2D diagram renderer
data/               evidence, graphs, scopes, scenarios — all schema-validated
```

### `lib/story` — one source of truth

`chapters.ts` is the only place chapter order lives. The rail, the scroll
triggers, the world form and the camera all derive from it. Adding a chapter is
one edit.

`store.ts` is a hand-written external store rather than React state, for one
specific reason: ScrollTrigger writes progress continuously, the WebGL world
needs that value every frame, and the DOM needs it roughly twice a minute.

- `read()` returns the live object; the frame loop calls it and never subscribes.
- `subscribe()` fires only when a **coarse** value changes — chapter, world form,
  camera mode. That is what the DOM binds to.

Routing both through React state would re-render the tree sixty times a second to
change a heading that changes twice a minute.

Because every value derives from scroll position alone, **reverse scroll
reconstructs prior states exactly**. There is no accumulated state to drift.
`tests/unit/story-store.test.ts` asserts this directly.

### `lib/world/geometry.ts` — the eight forms

`buildWorld(count)` produces nodes, downstream-only edges, and a few genuine
hyperedges, all seeded so server, client and SVG fallback agree.

`precomputeLayouts()` renders all eight layouts to flat `Float32Array`s once. The
frame loop then does a single linear pass over a typed array — no trigonometry,
no allocation.

The layouts are the argument:

| Form                 | What it says                                                                      |
| -------------------- | --------------------------------------------------------------------------------- |
| `earth`              | An abstract body. Calm, evenly covered.                                           |
| `global-network`     | The same body; strategic nodes lift clear of it.                                  |
| `fragmented-network` | Nodes pull toward three bloc centres. The world **rewires**, it does not explode. |
| `chokepoint`         | An hourglass: one node above, a narrow waist, an enormous fan below.              |
| `causal-graph`       | Geography is gone. Nodes sit in causal layers.                                    |
| `hypergraph`         | Layers gain depth; hyperedge members draw toward their junctions.                 |
| `world-model`        | Evidence migrates outward into a monitoring shell.                                |
| `futures`            | Downstream layers fan forward. Branches thin rather than terminate.               |

`chokepoint → causal-graph` is the transformation the whole site is built around.

### `components/world` — the instrument

`CausalWorld` is the only component that touches the store's continuous value.
Each frame it resolves the timeline into two layouts and a blend factor, then
writes interpolated positions into **one shared buffer**. Every child reads that
buffer through `world-context`, which carries a ref to a mutable `Float32Array`
rather than the array itself — nothing here ever triggers a React render.

This is why the ESLint config disables `react-hooks/immutability` for
`components/world/**` and nowhere else. That rule encodes React's render-phase
purity, and it is right to. A `useFrame` callback is not a render: it runs on the
animation loop against typed arrays bound for the GPU. Allocating per frame to
satisfy the rule would produce sixty allocations a second. The two violations the
rule caught _outside_ that directory were real bugs and were fixed.

### Progressive enhancement

1. The server renders an SVG world. It is what a crawler and a no-JavaScript
   visitor see, and the first paint for everyone.
2. The device tier resolves after mount (`lib/utils/capability.ts`).
3. The 3D scene is imported only if the tier warrants it, and fades in over the
   SVG rather than replacing it.

The static world stays mounted underneath, so a lost WebGL context does not blank
the page.

Tiers are a pure function of device signals, so the policy is unit-tested rather
than trusted. Phones are treated conservatively on purpose: a phone that _can_
run the scene often still should not, because sustained WebGL is what drains a
battery.

| Tier       | When                                    | Behaviour                                           |
| ---------- | --------------------------------------- | --------------------------------------------------- |
| `none`     | no WebGL                                | SVG world, full content parity                      |
| `reduced`  | reduced motion, Save-Data, small device | on-demand frameloop, no camera travel, no particles |
| `standard` | mid-range                               | full scene, fewer nodes, capped DPR                 |
| `full`     | capable desktop                         | everything                                          |

## Accessibility is structural, not a pass at the end

- The complete argument is static HTML. `tests/e2e/narrative.spec.ts` runs with
  JavaScript disabled and asserts the thesis, the evidence and the conclusion all
  survive.
- Every GSAP reveal animates **from** a visible resting state. If the timeline
  never runs, the content is simply already legible.
- No reveal animates text below AA contrast. Both scrubbed reveals carry their
  sequence with offset alone, because every opacity low enough to read as a fade
  took the type below threshold.
- The canvas is `aria-hidden` throughout. Every claim it illustrates is written
  in the DOM beside it.
- Diagrams are `role="group"`, never `role="img"` — an `img` is an atomic leaf
  that assistive technology will not descend into, which would make the focusable
  nodes inside unreachable.
- Scrollable figure regions are focusable, so a keyboard-only reader can pan a
  diagram wider than their screen.
- Meaning is never carried by colour alone; the rail encodes position with tick
  length as well as colour.

## The epistemic discipline

`data/schema.ts` requires every node, relation and graph to declare one of five
claim classes: observed fact, source claim, Yukthi interpretation, illustrative
scenario, product ambition. They render distinctly wherever they appear.

Two constraints are enforced by tests rather than by intention:

- **Every relation must carry a `mechanism`.** A relation without one is an
  association wearing a causal label.
- **No scenario may contain a probability.** `tests/unit/evidence.test.ts`
  serialises the scenario data and asserts no probability field or phrasing
  exists. A fabricated probability is worse than none, because it invites exactly
  the reliance it cannot support.

`defineGraph()` validates and cross-checks references at module scope, so a
malformed graph fails the build rather than a page view.

## Testing

| Suite                            | Covers                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `tests/unit/story-store`         | reverse-scroll reconstruction, coarse-notification discipline                                           |
| `tests/unit/world-geometry`      | determinism, node identity across forms, the hourglass asymmetry, downstream-only edges                 |
| `tests/unit/evidence`            | every citation resolves, every relation has a mechanism, no probabilities                               |
| `tests/unit/capability`          | tier policy and budget monotonicity                                                                     |
| `tests/unit/security`            | CSP, headers, rate limiter, contact validation                                                          |
| `tests/accessibility/components` | tablist semantics, dialog labelling, form errors, diagram focus                                         |
| `tests/e2e`                      | axe WCAG A/AA on every route, no-JS parity, no horizontal overflow, no scroll hijacking, reduced motion |

## Notable decisions

**Authored diagram geometry, not force simulation.** A causal argument reads in a
particular order; a physics layout would scramble it on every load.

**Static header, not sticky.** A fixed header over a scroll-driven narrative
competes with the argument and steals vertical space on the devices with least to
spare. The chapter rail already gives continuous position.

**No cookies, no analytics, no consent banner.** There is nothing to consent to.
A banner offering a choice that does not exist is theatre.

**Every responsive grid declares `grid-cols-1`.** A grid with only
`lg:grid-cols-*` has no template below `lg` and falls back to an auto-sized
implicit column that grows to max-content — which a wide figure then pushes past
the viewport. This caused a real mobile overflow bug; an e2e test now guards it.
