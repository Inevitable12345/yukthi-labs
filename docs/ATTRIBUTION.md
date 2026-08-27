# Attribution and licences

## Third-party code

No third-party source was copied into this repository. Every file here was
written for this project.

Where public work informed the engineering, it informed the _technique_ and was
reimplemented inside this codebase's own architecture:

| Source                                                   | What was learned                                                                                                                                                                                                                                                                                                 | What was used                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| GSAP's official ScrollTrigger documentation and examples | Correct trigger lifecycle: registering the plugin once, scoping with `useGSAP`, attaching triggers to a top-level timeline, `scrub` for continuous animation versus `toggleActions` for discrete, animating children rather than the pinned wrapper, killing triggers on unmount, refreshing after layout change | Patterns only. No code copied. See `lib/story/use-chapter-progress.ts`. |
| `pmndrs/react-three-fiber` examples                      | On-demand frameloop, DPR capping, buffer reuse, disposing geometry, reading imperative state without re-rendering                                                                                                                                                                                                | Patterns only. No code copied.                                          |
| Codrops scroll-animation experiments                     | Scroll-linked reveal pacing and the general shape of pinned storytelling                                                                                                                                                                                                                                         | Approach only. No code or assets used.                                  |

No visual asset, image, font file, model or texture from any reference site or
repository is present in this project.

## Dependencies

All runtime dependencies are permissively licensed (MIT, ISC or Apache-2.0).

| Package                      | Licence                      | Why it is here                    |
| ---------------------------- | ---------------------------- | --------------------------------- |
| `next`, `react`, `react-dom` | MIT                          | Framework                         |
| `three`                      | MIT                          | WebGL                             |
| `@react-three/fiber`         | MIT                          | React renderer for three.js       |
| `@react-three/drei`          | MIT                          | R3F helpers                       |
| `gsap`, `@gsap/react`        | Standard "No Charge" licence | Scroll orchestration              |
| `motion`                     | MIT                          | Small DOM interactions            |
| `d3-scale`, `d3-shape`       | ISC                          | Scale and path utilities          |
| `zod`                        | MIT                          | Schema validation at module scope |
| `tailwindcss`                | MIT                          | Styling                           |

Run `npm ls --omit=dev` for the resolved tree, and `npm audit` before release.

**A note on GSAP.** GSAP is distributed under Club GreenSock's standard "No
Charge" licence, which permits use in most non-commercial and commercial contexts
but is **not** an OSI-approved open-source licence. Read the current terms at
<https://gsap.com/licensing/> and confirm they cover your intended use before
deploying commercially. This is the one dependency here whose licence deserves a
deliberate decision rather than an assumption.

## Typefaces

- **Cormorant Garamond** — SIL Open Font License 1.1
- **IBM Plex Sans** and **IBM Plex Mono** — SIL Open Font License 1.1

Both are loaded through `next/font/google`, which fetches them at build time and
serves them from this site's own origin. No request reaches a font provider at
runtime, so no third party learns that a visitor loaded a page.

## Evidence and quoted sources

Every evidence record cites a real, publicly retrievable document published by
the named organisation. Those documents remain the property of their publishers.

This project:

- links to sources rather than reproducing them;
- quotes claims with the source's own units, scenario conditions and hedges
  intact;
- records what each figure does _not_ say alongside what it does;
- marks any record not yet checked against its primary document as unverified,
  wherever that record appears.

Characterisations of a source's findings are this project's own. Any error in one
is this project's, not the publisher's, and corrections are welcome through the
contact page.

## The site's own content

The written argument, the causal graphs, the decision scopes and the illustrative
scenarios were authored for this project.

The scenarios are explicitly labelled **illustrative**: they demonstrate the
shape of a causal analysis and are not findings about any organisation, market or
asset. Nothing on the site is output from a running Yukthi system.
