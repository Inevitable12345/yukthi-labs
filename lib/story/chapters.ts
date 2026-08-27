/* ============================================================================
   STORY CHAPTERS
   ----------------------------------------------------------------------------
   The single ordered definition of the argument. Everything downstream — the
   scroll orchestration, the chapter rail, the WebGL world state and the DOM copy
   — reads from this list. There is no second place where chapter order lives.
   ========================================================================== */

/** §27. The deterministic chapter union. */
export type StoryChapter =
  | "stability"
  | "rupture"
  | "rare-earth"
  | "semiconductor"
  | "structural-break"
  | "feedback"
  | "coming-decade"
  | "ai"
  | "yukthi"
  | "operating-loop"
  | "decision-scopes"
  | "investment"
  | "finale";

/**
 * The eight forms the Causal World takes (§5).
 *
 * The world is one continuous instrument; these are the representations it
 * resolves into. The transformation that carries the whole argument is
 * `chokepoint → causal-graph`: the moment geography stops being the organising
 * principle and causal relation takes over.
 */
export type WorldForm =
  | "earth"
  | "global-network"
  | "fragmented-network"
  | "chokepoint"
  | "causal-graph"
  | "hypergraph"
  | "world-model"
  | "futures";

/** §24. Camera grammar — movement communicates intellectual scale, not spectacle. */
export type CameraMode =
  /** Global argument. The whole system, held at a distance. */
  | "far"
  /** Chokepoint. One node, close enough to read its mechanism. */
  | "close"
  /** Interaction. A layered orbit that shows depth between strata. */
  | "orbit"
  /** Structural break. The world flattens into an analytical plane. */
  | "flatten"
  /** The reveal. Abstract graph space, no horizon. */
  | "abstract"
  /** Finale. A slow pullback that never quite returns to where it began. */
  | "pullback";

export type ChapterDefinition = {
  id: StoryChapter;
  /** Rail number. Several chapters can share a rail entry; see RAIL below. */
  index: number;
  /** Short name for the chapter rail (§25). */
  railLabel: string;
  /** Accessible name announced when the chapter becomes current. */
  title: string;
  /** DOM id of the section. Anchors, skip links and ScrollTrigger all use it. */
  domId: string;
  world: WorldForm;
  camera: CameraMode;
  /**
   * Whether this chapter pins its scene while its timeline scrubs.
   * Pinning is expensive and disorienting when overused — it is reserved for
   * chapters whose content is a transformation rather than a statement.
   */
  pinned: boolean;
};

export const CHAPTERS: readonly ChapterDefinition[] = [
  {
    id: "stability",
    index: 1,
    railLabel: "Stability",
    title: "The world we built for",
    domId: "stability",
    world: "earth",
    camera: "far",
    pinned: false,
  },
  {
    id: "rupture",
    index: 2,
    railLabel: "Rupture",
    title: "The structure began to change",
    domId: "rupture",
    world: "fragmented-network",
    camera: "orbit",
    pinned: true,
  },
  {
    id: "rare-earth",
    index: 3,
    railLabel: "Chokepoint",
    title: "The chokepoint",
    domId: "rare-earth",
    world: "chokepoint",
    camera: "close",
    pinned: true,
  },
  {
    id: "semiconductor",
    index: 4,
    railLabel: "Cascade",
    title: "Reality is not a chain",
    domId: "semiconductor",
    world: "causal-graph",
    camera: "orbit",
    pinned: true,
  },
  {
    id: "structural-break",
    index: 5,
    railLabel: "Break",
    title: "Structural break",
    domId: "structural-break",
    world: "causal-graph",
    camera: "flatten",
    pinned: false,
  },
  {
    id: "feedback",
    index: 6,
    railLabel: "Interaction",
    title: "Feedback",
    domId: "feedback",
    world: "causal-graph",
    camera: "orbit",
    pinned: false,
  },
  {
    id: "coming-decade",
    index: 7,
    railLabel: "Why now",
    title: "The coming decade",
    domId: "coming-decade",
    world: "hypergraph",
    camera: "far",
    pinned: false,
  },
  {
    id: "ai",
    index: 7,
    railLabel: "Why now",
    title: "Why AI changes what is possible",
    domId: "ai",
    world: "hypergraph",
    camera: "orbit",
    pinned: false,
  },
  {
    id: "yukthi",
    index: 8,
    railLabel: "The bet",
    title: "The technical bet",
    domId: "yukthi",
    world: "hypergraph",
    camera: "abstract",
    pinned: true,
  },
  {
    id: "operating-loop",
    index: 9,
    railLabel: "World model",
    title: "The operating loop",
    domId: "operating-loop",
    world: "world-model",
    camera: "abstract",
    pinned: true,
  },
  {
    id: "decision-scopes",
    index: 10,
    railLabel: "Decisions",
    title: "The 3 a.m. problems",
    domId: "decision-scopes",
    world: "world-model",
    camera: "orbit",
    pinned: false,
  },
  {
    id: "investment",
    index: 10,
    railLabel: "Decisions",
    title: "The investment bet",
    domId: "investment",
    world: "world-model",
    camera: "far",
    pinned: false,
  },
  {
    id: "finale",
    index: 11,
    railLabel: "Ambition",
    title: "Civilizational ambition",
    domId: "finale",
    world: "futures",
    camera: "pullback",
    pinned: false,
  },
] as const;

export const CHAPTER_IDS: readonly StoryChapter[] = CHAPTERS.map((chapter) => chapter.id);

export const CHAPTER_BY_ID: Record<StoryChapter, ChapterDefinition> = Object.fromEntries(
  CHAPTERS.map((chapter) => [chapter.id, chapter]),
) as Record<StoryChapter, ChapterDefinition>;

/**
 * The chapter rail (§25): eleven entries, deduplicated from thirteen chapters.
 *
 * Two pairs of chapters share a rail position because they are one movement of
 * the argument told in two scenes — the reader should not feel the rail tick
 * twice for a single idea.
 */
export const RAIL: readonly { index: number; label: string; chapters: StoryChapter[] }[] =
  CHAPTERS.reduce<{ index: number; label: string; chapters: StoryChapter[] }[]>(
    (accumulator, chapter) => {
      const existing = accumulator.find((entry) => entry.index === chapter.index);
      if (existing) {
        existing.chapters.push(chapter.id);
        return accumulator;
      }
      accumulator.push({
        index: chapter.index,
        label: chapter.railLabel,
        chapters: [chapter.id],
      });
      return accumulator;
    },
    [],
  );

/** Zero-padded rail numeral: `01`, `02`, … Used verbatim in the DOM. */
export function railNumeral(index: number): string {
  return index.toString().padStart(2, "0");
}
