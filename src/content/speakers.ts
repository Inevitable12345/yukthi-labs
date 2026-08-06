/**
 * Tentative list of speakers.
 *
 * ADDING A PHOTOGRAPH
 *  1. Save the approved image to `public/speakers/` (square crop, ≥600×600,
 *     .jpg or .webp) — see `public/speakers/README.md`.
 *  2. Set `photo: "/speakers/<file>"` on the speaker below. That is the whole
 *     change; the card swaps from monogram to portrait automatically.
 *
 * RULES (do not relax without organising-committee approval):
 *  - `tentative: true` must stay set until participation is formally confirmed.
 *  - `photo` may only point at an official photograph supplied by the speaker
 *    or their institution. Never use a stock or search-engine image: these are
 *    named individuals, and a misidentified or unlicensed portrait on an
 *    official conference site is a problem for them and for the university.
 *  - `bio` and `sessionTitle` stay empty until approved text is provided.
 *    The UI hides the biography modal automatically when `bio` is empty.
 */

export type Speaker = {
  id: string;
  name: string;
  position: string;
  institution: string;
  tentative: boolean;
  photo?: string;
  bio?: string;
  sessionTitle?: string;
};

export const speakers: Speaker[] = [
  {
    id: "n-ramakrishnan",
    name: "Prof. N. Ramakrishnan",
    position: "Professor and Head, Department of Educational Technology",
    institution: "Tamil Nadu Teachers Education University (TNTEU)",
    tentative: true,
    photo: undefined, // TODO(assets): approved photograph
    bio: undefined, // TODO(content): approved biography
    sessionTitle: undefined, // TODO(content): session title once scheduled
  },
  {
    id: "a-tholappan",
    name: "Prof. A. Tholappan",
    position: "Professor, Department of Education",
    institution: "Bharathidasan University (BDU)",
    tentative: true,
    photo: undefined,
    bio: undefined,
    sessionTitle: undefined,
  },
  {
    id: "robert-lee",
    name: "Prof. Robert Lee",
    position: "Former Dean",
    institution: "City University, Hong Kong",
    tentative: true,
    photo: undefined,
    bio: undefined,
    sessionTitle: undefined,
  },
];
