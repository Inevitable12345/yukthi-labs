/* ============================================================================
   STORY STATE  (§31)
   ----------------------------------------------------------------------------
   Deterministic room state, held outside React.

   Two channels, deliberately:

     • Chapter changes are rare and every consumer cares  → React subscription.
     • Progress changes on every scroll frame              → plain reads.

   Pushing per-frame progress through React would re-render the document sixty
   times a second for no benefit. WebGL reads it inside `useFrame`; the handful
   of DOM scenes that need it poll through `useChapterProgress`, which throttles
   to meaningful change. Scroll direction is irrelevant to all of it, which is
   why reverse scroll works without a second code path.
   ========================================================================== */

import { CHAPTER_IDS, ROOMS, type Chapter } from "./chapters";

export type StorySnapshot = {
  /** The room currently occupying the viewport. */
  chapter: Chapter;
  /** Ordinal of `chapter` within ROOMS. */
  order: number;
  /** Whether the visitor has scrolled past the observatory. */
  entered: boolean;
};

const progress = new Map<Chapter, number>(CHAPTER_IDS.map((id) => [id, 0]));

let snapshot: StorySnapshot = { chapter: "observatory", order: 0, entered: false };
let overall = 0;

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): StorySnapshot {
  return snapshot;
}

export function setChapter(chapter: Chapter): void {
  if (snapshot.chapter === chapter) return;
  const order = ROOMS.findIndex((room) => room.id === chapter);
  snapshot = { chapter, order: order < 0 ? 0 : order, entered: chapter !== "observatory" };
  notify();
}

/** Normalised 0→1 progress through one room. Written by the scroll driver. */
export function setProgress(chapter: Chapter, value: number): void {
  progress.set(chapter, value < 0 ? 0 : value > 1 ? 1 : value);
}

export function readProgress(chapter: Chapter): number {
  return progress.get(chapter) ?? 0;
}

/** Normalised 0→1 progress through the whole exhibition. */
export function setOverall(value: number): void {
  overall = value < 0 ? 0 : value > 1 ? 1 : value;
}

export function readOverall(): number {
  return overall;
}

/** Test seam — restores the module to its initial state. */
export function resetStory(): void {
  for (const id of CHAPTER_IDS) progress.set(id, 0);
  overall = 0;
  snapshot = { chapter: "observatory", order: 0, entered: false };
  notify();
}
