# Speaker photographs

Drop approved speaker portraits in this folder, then point at them from
`src/content/speakers.ts`.

## How to add one

1. Save the file here, named after the speaker's `id`:

   | Speaker | `id` | Expected file |
   | --- | --- | --- |
   | Prof. N. Ramakrishnan | `n-ramakrishnan` | `n-ramakrishnan.jpg` |
   | Prof. A. Tholappan | `a-tholappan` | `a-tholappan.jpg` |
   | Prof. Robert Lee | `robert-lee` | `robert-lee.jpg` |

2. Set the `photo` field in `src/content/speakers.ts`:

   ```ts
   photo: "/speakers/n-ramakrishnan.jpg",
   ```

That is the only change needed. Until `photo` is set, the card shows a neutral
monogram and the caption "Official photograph awaited" — never a stand-in face.

## Image requirements

- Square crop, at least 600×600 px (cards render at 4:3, face centred).
- `.jpg` or `.webp`. Next.js serves AVIF/WebP automatically.
- Keep file size under ~200 KB.

## Where the photo must come from

Only one of:

- the speaker directly, or
- their institution's communications/press office, or
- an official faculty profile page **with written permission to reuse**.

Do **not** take a portrait from a web image search. These are three named,
identifiable academics — "Robert Lee" alone matches many people — and an
official conference site showing the wrong person's face, or a photograph used
without licence, creates a real problem for the individual and for SCSVMV. When
requesting a photo, ask for written confirmation that the university may publish
it on the conference website.
