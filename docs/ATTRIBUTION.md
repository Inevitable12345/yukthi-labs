# Attribution

## What is original here

Every line of application code, all copy, the causal graphs, the form geometry,
the shaders and the visual identity in this repository were written for Yukthi
Lab.

No external website's visual identity, layout, assets, imagery or source code
was copied. The brief named reference experiences for their _level of immersion
and experimental quality_; those were treated as a standard to meet, not a design
to reproduce.

## Runtime dependencies

| Package                                                                      | Licence                      | Used for                                       |
| ---------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------- |
| [Next.js](https://nextjs.org)                                                | MIT                          | Framework, routing, image and OG generation    |
| [React](https://react.dev)                                                   | MIT                          | UI                                             |
| [three.js](https://threejs.org)                                              | MIT                          | WebGL                                          |
| [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)            | MIT                          | React renderer for three.js                    |
| [@react-three/drei](https://github.com/pmndrs/drei)                          | MIT                          | Adaptive DPR and events helpers                |
| [GSAP](https://gsap.com) + ScrollTrigger                                     | Standard "No Charge" licence | Scroll position and progress                   |
| [@gsap/react](https://github.com/greensock/react)                            | MIT                          | `useGSAP` lifecycle                            |
| [d3-shape](https://d3js.org/d3-shape), [d3-scale](https://d3js.org/d3-scale) | ISC                          | Line generation and scales for the break chart |
| [Zod](https://zod.dev)                                                       | MIT                          | Contact submission validation                  |
| [Tailwind CSS](https://tailwindcss.com)                                      | MIT                          | Design tokens and utilities                    |

### A note on the GSAP licence

GSAP's core and ScrollTrigger are used here under GreenSock's **Standard "No
Charge" licence**, which covers use in a site like this one. It does _not_ cover
products where the end user is charged for access to GSAP-powered features; that
requires a commercial licence. If Yukthi Lab's use ever changes shape, review
<https://gsap.com/licensing/> before shipping.

Everything else above is permissively licensed (MIT or ISC) and redistributable
with attribution.

## Development dependencies

TypeScript, ESLint (with `eslint-config-next`), Prettier, Vitest, Testing
Library, Playwright and `@axe-core/playwright` — all MIT, none shipped to the
browser.

## Fonts

None are loaded. Typography uses system stacks: an old-style serif for argument,
the platform sans for interface, the platform monospace for coordinates and
mechanism ladders.

This is a deliberate choice rather than an omission. It keeps `font-src` in the
Content-Security-Policy as narrow as it looks, removes a render-blocking network
dependency from a page whose first job is to be readable, and avoids shipping a
webfont licence question along with the repository.

## Techniques

The scroll-driven and WebGL techniques were built from official documentation and
first principles:

- three.js manual and examples — <https://threejs.org/docs/>
- React Three Fiber documentation — <https://r3f.docs.pmnd.rs/>
- GSAP ScrollTrigger documentation — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>
- MDN, for the WebGL, Intersection Observer, `prefers-reduced-motion` and
  `scripting` media feature behaviour used throughout

Public repositories under
[github.com/topics/scrolling-animation](https://github.com/topics/scrolling-animation)
were reviewed as technical reference only. Nothing was copied from any of them:
no code, no assets, no visual identity. Where a general technique is widely
documented — morphing a point cloud between target buffers, damped camera
interpolation, crossfading edge topology — it was reimplemented inside this
architecture.

## Evidence

Every source cited on the site belongs to the organisation that published it and
is credited by name, title and date in `content/evidence.ts` and on `/evidence`.
Nothing is reproduced beyond a short factual summary of what each document
reports, and Yukthi's reading of a source is always labelled as such and kept in
a separate field from the source's own claim.
