# Architecture

Notes on the decisions that are not obvious from the file tree, and why they went
the way they did.

---

## One argument, two renderings

`content/thesis.ts` holds every word the exhibition speaks, keyed by room. The
homepage renders it spatially; `/thesis` renders it as prose. Neither authors
copy of its own.

The reason is not tidiness. A serious reader should be able to check a claim
without scrolling through twenty held scenes, and the whole argument existing as
plain static HTML is the strongest possible answer to both the WebGL-failure
requirement and the crawlability requirement at once.

## Story state lives outside React

`ScrollTrigger` writes two numbers into `lib/story/store.ts`. Nothing is animated
from that file.

Two channels, deliberately:

- Chapter changes are rare and every consumer cares → React subscription via
  `useSyncExternalStore`.
- Progress changes on every scroll frame → plain reads. Pushing it through React
  would re-render the document sixty times a second for no benefit.

The store holds a **position**, not a playhead. There is no direction to reverse,
which is why scrolling backwards needs no code of its own.

## Sticky, not pinned

Rooms marked `held` use CSS `position: sticky`. ScrollTrigger's `pin` clones or
re-parents the pinned element, which disturbs focus order, anchor targets and the
accessibility tree. Sticky does none of that, and the scroll driver already has
the progress value that pinning would have been used to obtain.

## The world is one object

`components/world/WorldInstrument.tsx` holds a single point cloud and a single
`LineSegments` for the entire exhibition. A room change rewrites the target
buffer and takes the current positions as the morph origin.

That constraint is the whole reason the world reads as one instrument being
re-understood rather than eight scenes played in order. It also means the frame
cost is flat: no scene is ever created or destroyed mid-scroll.

Relations **crossfade** rather than morph, because their topology carries meaning
that differs per form. A causal layer is not a trade route; interpolating between
the two would produce a third thing that means nothing. Opacity dips to zero at
the midpoint of a morph and the index buffer is swapped there, unseen.

## Geometry is a pure function

`lib/world/forms.ts` maps `(form, index, count) → position` with a seeded PRNG.

Three things fall out of that:

1. The world is identical on every reload. A world that rearranges itself when
   you refresh is a world nobody reads as a model of anything.
2. It is testable without a renderer (`tests/unit/world-forms.test.ts`).
3. The SVG fallback renders the _same_ geometry through a completely different
   pipeline, so the no-WebGL experience is the same argument rather than a
   consolation prize.

## Hyperedges are the point

`CausalRelation` has `sourceIds: string[]` and `targetIds: string[]`. Both are
arrays and that is not a convenience.

A pairwise graph cannot express "an export control **and** a processing
concentration **together** constrain a component supply". `propagate()` therefore
fires a relation only when _every_ one of its sources has been reached, and
`CausalDiagram` draws a junction rather than parallel arrows — parallel arrows
would quietly assert that either cause alone is sufficient.

Propagation is computed as ordered waves rather than a shortest path, and
terminates on the first wave that reaches nothing new, so cycles settle instead
of looping forever. Feedback (room 06) is a cycle by construction.

## Layout is deterministic, not simulated

`lib/graph/layout.ts` computes longest-path depth and a stable ordering within
each depth. Force simulations are prettier and unrepeatable; a causal diagram
that moves when you reload it is a diagram nobody trusts.

## Contrast is never animated

Several scenes show arrival, activation or ordering. None of them do it by fading
text.

An element mid-fade is an element at a low contrast ratio, and a reader who
arrives at that moment gets unreadable text. So progress is carried by colour
transitions between two legible values, by position, or by a graphic element —
never by opacity on words. The axe checks in `tests/e2e/accessibility.spec.ts`
enforce it.

## Claim classes

`ClaimClass` in `lib/graph/types.ts` is the discipline that makes the rest
defensible: source fact, Yukthi interpretation, illustrative scenario and product
ambition each get a distinct visual register, and every assertion carries one.

`tests/unit/evidence.test.ts` fails the build if a probability or a guarantee of
prediction appears anywhere in the copy, the evidence or the mechanisms.

## Performance tiers

`lib/performance/tier.ts` picks between three budgets from coarse signals —
pointer type, viewport width, reported cores, reported memory. Heuristics that
guess harder tend to guess wrong, and the cost of guessing wrong is a phone that
drops frames through the argument.

Reduced motion resolves to the low tier, because with the world no longer
animating between states there is nothing to spend the budget on.
