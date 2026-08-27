import {
  CHAPTERS,
  CHAPTER_BY_ID,
  type CameraMode,
  type StoryChapter,
  type WorldForm,
} from "./chapters";

/* ============================================================================
   STORY STATE (§27)
   ----------------------------------------------------------------------------
   One source of truth, read at two different rates.

   ScrollTrigger writes progress continuously. The WebGL world needs that value
   every frame; the DOM needs it almost never. Routing both through React state
   would re-render the tree sixty times a second to change a heading that changes
   twice a minute.

   So the store keeps a single mutable snapshot:

     · `read()` returns the live object. The r3f frame loop reads it directly and
       never subscribes. No allocation, no render.
     · `subscribe()` notifies only when a *coarse* value changes — the active
       chapter, the world form, the camera mode. That is what the DOM binds to.

   Because every value is derived from scroll position alone, scrolling backwards
   reconstructs prior states exactly: there is no accumulated or event-sourced
   state to drift.
   ========================================================================== */

export type StorySnapshot = {
  /** The chapter currently occupying the viewport. */
  chapter: StoryChapter;
  /** Progress through the current chapter, 0–1. */
  chapterProgress: number;
  /** Progress through the whole narrative, 0–1. */
  globalProgress: number;
  /** The form the world should be rendering. */
  world: WorldForm;
  /** Where the camera should be. */
  camera: CameraMode;
  /**
   * Continuous position along the chapter list — `2.5` means halfway through the
   * third chapter. The world uses this to interpolate between forms rather than
   * snapping at chapter boundaries.
   */
  timeline: number;
  /** True once the reader has moved at all. Used to retire the scroll hint. */
  engaged: boolean;
};

const FIRST = CHAPTERS[0]!;

function initialSnapshot(): StorySnapshot {
  return {
    chapter: FIRST.id,
    chapterProgress: 0,
    globalProgress: 0,
    world: FIRST.world,
    camera: FIRST.camera,
    timeline: 0,
    engaged: false,
  };
}

let snapshot: StorySnapshot = initialSnapshot();

/** Per-chapter progress, retained so the rail can show partially-read chapters. */
const progressByChapter = new Map<StoryChapter, number>();

type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) listener();
}

export const storyStore = {
  /** Live read. Safe to call every frame; never allocates. */
  read(): StorySnapshot {
    return snapshot;
  },

  progressFor(chapter: StoryChapter): number {
    return progressByChapter.get(chapter) ?? 0;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Report progress for one chapter. Called by that chapter's ScrollTrigger.
   *
   * `active` is false when a chapter's trigger fires while another chapter owns
   * the viewport — a chapter leaving the top of the screen still reports its
   * final progress, but must not steal the current-chapter slot from the one
   * arriving.
   */
  setChapterProgress(chapter: StoryChapter, progress: number, active: boolean): void {
    const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress;
    progressByChapter.set(chapter, clamped);

    if (!active) return;

    const definition = CHAPTER_BY_ID[chapter];
    const position = CHAPTERS.indexOf(definition);
    const timeline = position + clamped;
    const globalProgress = CHAPTERS.length > 1 ? timeline / (CHAPTERS.length - 1) : 0;

    const coarseChanged =
      snapshot.chapter !== chapter ||
      snapshot.world !== definition.world ||
      snapshot.camera !== definition.camera ||
      (!snapshot.engaged && (clamped > 0.02 || position > 0));

    snapshot = {
      chapter,
      chapterProgress: clamped,
      globalProgress: globalProgress > 1 ? 1 : globalProgress,
      world: definition.world,
      camera: definition.camera,
      timeline,
      engaged: snapshot.engaged || clamped > 0.02 || position > 0,
    };

    if (coarseChanged) notify();
  },

  /** Test and hot-reload hygiene: drops all state and listeners' cached values. */
  reset(): void {
    snapshot = initialSnapshot();
    progressByChapter.clear();
    notify();
  },
};

/* --------------------------------------------------------------------------
   Interpolation helpers used by the world layer
   -------------------------------------------------------------------------- */

/**
 * How far the world has travelled between two chapters, as 0–1.
 *
 * Returns 0 before `from` and 1 after `to`, so a morph driven by this value
 * holds its endpoints instead of snapping back when the reader scrolls past.
 */
export function span(timeline: number, from: StoryChapter, to: StoryChapter): number {
  const start = CHAPTERS.findIndex((chapter) => chapter.id === from);
  const end = CHAPTERS.findIndex((chapter) => chapter.id === to);
  if (start < 0 || end < 0 || end === start) return 0;
  const value = (timeline - start) / (end - start);
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Smoothstep. Used so morphs ease at both ends without a tween library. */
export function smoothstep(value: number): number {
  const t = value < 0 ? 0 : value > 1 ? 1 : value;
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Frame-rate-independent approach toward a target. `speed` is per second. */
export function damp(current: number, target: number, speed: number, delta: number): number {
  return lerp(current, target, 1 - Math.exp(-speed * delta));
}
