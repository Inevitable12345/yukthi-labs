import type { ComponentType } from "react";

import Coupled, { meta as coupledMeta } from "./2026-08-25-coupled-systems-are-one-system.mdx";
import Licensing, { meta as licensingMeta } from "./2026-08-25-licensing-is-the-mechanism.mdx";
import Revision, { meta as revisionMeta } from "./2026-08-25-the-revision-is-the-signal.mdx";

/**
 * Field notes.
 *
 * Registered explicitly rather than discovered from the filesystem: a static
 * import list is type-checked, tree-shaken and works identically at build time and
 * at request time. Adding a note is two lines here and one `.mdx` file.
 */
export type FieldNoteMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  evidenceIds?: string[];
};

export type FieldNote = FieldNoteMeta & { Content: ComponentType };

const entries: FieldNote[] = [
  { ...(licensingMeta as FieldNoteMeta), Content: Licensing },
  { ...(revisionMeta as FieldNoteMeta), Content: Revision },
  { ...(coupledMeta as FieldNoteMeta), Content: Coupled },
];

/** Newest first. */
export const fieldNotes: FieldNote[] = [...entries].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getFieldNote(slug: string): FieldNote | undefined {
  return fieldNotes.find((note) => note.slug === slug);
}
