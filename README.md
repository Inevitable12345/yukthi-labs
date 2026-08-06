# ICRTET-2026 — Official Conference Website

1st International Conference on Recent Trends in Educational Technology
School of Education, SCSVMV · in association with TNTEU
**September 18–19, 2026 · Hybrid Mode · Kanchipuram, Tamil Nadu, India**

**Stage:** Implemented multi-page website in pre-launch verification. The codebase and static routes are complete; organizer-owned links, approved assets, and production financial details must be confirmed before launch.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Production build (all 20 routes prerender statically) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check without emitting |

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide.
No GSAP — Framer Motion plus a small set of CSS keyframes covers every effect
here, and mixing both for the same job was ruled out by the brief.

---

## Site structure

| Route | Contains |
| --- | --- |
| `/` | Hero, quick facts, about, why participate, key areas, dates, speakers, leadership + full committees, call for papers, fees, publication, payment, contact |
| `/registration` | **The single destination for authors and delegates** — call for papers, key areas, important dates, submission guidelines, fees, scan-to-register, payment, publication, all as anchored sections with a sticky jump nav |
| `/about` | Overview, theme, objectives, **scope of the conference**, intended participants, host institutions |
| `/about/scsvmv`, `/about/tnteu` | Institution profiles |
| `/speakers` | Tentative list of speakers |
| `/venue` | Address, map, travel guidance |
| `/faq` | Frequently asked questions |
| `/contact` | Contacts and enquiry form |

Authors, important dates and registration were previously six separate routes
(`/call-for-papers`, `/key-areas`, `/important-dates`, `/author-guidelines`,
`/publication`) plus `/committees`. They are now consolidated: the first five
became anchored sections of `/registration`, and the committee listing expands
inline on the homepage. All six old paths return 404 — add redirects in
`next.config.mjs` if any were shared publicly before launch.

## Editing content without touching design

Everything an administrator needs to change lives in `src/content/`. No component
needs editing to update dates, names, fees or links.

| File | Controls |
| --- | --- |
| `conference.ts` | Title, acronym, dates, mode, venue, **all outbound links**, announcement bar, SEO defaults |
| `institutions.ts` | SCSVMV, School of Education and TNTEU details |
| `navigation.ts` | Header dropdowns and footer link columns |
| `speakers.ts` | Keynote speakers, tentative flags, photos, biographies |
| `committees.ts` | Every committee and member |
| `key-areas.ts` | The 20 key areas, icons and search keywords |
| `important-dates.ts` | The three confirmed milestones |
| `registration-fees.ts` | Fee categories, inclusions, registration process |
| `publication.ts` | The approved publication statement |
| `payment.ts` | **Bank details and QR codes** |
| `contacts.ts` | Organising secretaries, email, enquiry types |
| `faq.ts` | Questions, answers and their approval status |

---

## Before this goes public

The conference poster was not available to this build, so the site was
assembled from the written master context. Every fact from it is in place;
the items below are the ones that need a file or a confirmation.

### Must verify — financial and destination data

- [ ] **Bank details** in `src/content/payment.ts` are deliberately redacted in
      this public portfolio copy. Obtain approved values directly from the
      organising committee before any production deployment.
- [ ] **Account holder name** — `bankDetails.accountName` is `undefined` and the
      row renders "To be confirmed" until set.
- [ ] **QR codes** — add the approved images and set `image` + `href` in
      `payment.ts`. Scan each one and confirm it resolves to the intended
      destination. Until then the site shows an honest placeholder, never a
      broken or wrong code.
- [ ] **Registration and submission URLs** — `conference.links` are `#`
      placeholders.
- [ ] **Final domain** — `conference.seo.siteUrl` drives canonicals, sitemap and
      structured data.

### Assets to add to `/public`

- [ ] High-resolution SCSVMV and TNTEU logos → `/logos/`. The hero currently
      shows lettered plates. Per the brief, do **not** upscale marks lifted
      from the poster.
- [ ] Speaker photographs → drop the file in `public/speakers/` and set `photo`
      in `speakers.ts`. See `public/speakers/README.md` for the exact filenames
      and where the images must come from. Cards show a neutral monogram until
      then — never a stand-in face. Photographs must be supplied by the speaker
      or their institution; do not take one from an image search, since these
      are named individuals and a misidentified or unlicensed portrait on an
      official university site is a real problem.
- [ ] Conference brochure and call-for-papers PDFs.
- [ ] Social sharing image, 1200×630 → `conference.seo.ogImage`.
- [ ] Campus photographs for the venue page.

### Copy awaiting approval

- [ ] Official SCSVMV and TNTEU profile text — both pages list the expected
      headings behind a visible "profile awaited" notice rather than inventing
      institutional history.
- [ ] Author guidelines — paper length, format, citation style, plagiarism
      policy and presentation rules. `/author-guidelines` separates what is
      confirmed from what is pending; nothing is estimated.
- [ ] What each registration fee includes — `includes: []` in
      `registration-fees.ts`.
- [ ] Three pending FAQ answers (certificates, paper format, accommodation).
      Flip `status` to `"confirmed"` once approved; only confirmed answers are
      exposed to search engines.
- [ ] Speaker biographies and session titles.

### Contact form

`ContactSection` validates client-side, blocks bots with a honeypot, then hands
the enquiry to the visitor's mail client — no university submission endpoint was
provided. To move to a real backend, replace the `mailto:` block in
`src/components/home/ContactSection.tsx` and keep the validation above it.

---

## Deliberate restraint

A few things are intentionally *not* done, because the brief prohibits them:

- Publication is described as **considered for** the conference proceedings
  with ISBN — never as guaranteed. No publisher logos.
- No dates exist beyond the three on the poster.
- Speakers are presented as a **tentative list** and stay badged Tentative
  until `tentative: false` is set.
- Key area cards expand only when an approved `description` exists.
- Payment-proof upload is off (`paymentProofWorkflowEnabled = false`) until an
  official workflow is supplied.

There is deliberately **no route-level `loading.tsx`**. Every page is fully
static with no data fetching, and a root `loading.tsx` forced each route into a
streamed Suspense boundary — which shipped HTML whose `<main>` held only a
skeleton, with the real content in a hidden div that JavaScript had to relocate.
That broke no-JS access and meant non-rendering crawlers saw a loading state
instead of the conference. `error.tsx` is kept; it does useful work.

**There are no illustrations.** The site carries no decorative artwork — the
hero backdrop is a gradient field with soft colour blooms and a fine rule grid,
and nothing more. The earlier wireframe globe, digital skyline, drifting
book/cap/laptop motifs, smart-classroom scene and paper-plane graphic were all
removed: they read as generic filler and competed with the conference title and
dates. Where an illustration used to occupy a column, `ui/AtAGlance` now shows
real information instead. The only remaining vector art is Lucide UI icons,
which are functional labelling, not decoration. Please don't reintroduce
generated or stock illustration.

**Nothing in this project uses `AnimatePresence` or exit animations.** Every
appearing element animates in and unmounts immediately on close. In this
Framer Motion / React 19 combination, exiting subtrees reliably failed to
unmount here — leaving collapsed accordions, closed dropdowns, filtered-out
cards and even a dismissed dialog parked in the DOM at `height: 0` or
`opacity: 0`. Invisible to sighted users, but still focusable, still read by
screen readers, and in the dialog's case still carrying `aria-modal="true"`
while the focus-restoring cleanup never ran. Opening animates; closing is
instant. If you reintroduce an exit animation anywhere, verify the element
actually leaves the DOM afterwards.

Modal focus is moved **synchronously** in the effect, not inside
`requestAnimationFrame` — rAF never fires in a background or non-compositing
tab, which would silently leave focus behind the open dialog.

## Accessibility & motion

WCAG AA contrast, semantic headings, a skip link, full keyboard support with a
focus-trapped modal and visible focus rings throughout. QR destinations always
appear as text links so a camera is never required.

`prefers-reduced-motion: reduce` disables parallax, the ambient globe, drifting
motifs and all transitions; the scroll timeline renders complete rather than
drawing in. Only `opacity`, `transform` and `filter` are animated.
