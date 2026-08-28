/* ============================================================================
   EXHIBITION STRUCTURE  (§3, §31)
   ----------------------------------------------------------------------------
   One ordered definition of the argument. Scroll orchestration, the coordinate
   readout, the WebGL world and every piece of DOM copy read from this list.
   There is no second place where room order lives.

   A note on numbering. The brief's coordinate system (§3) lists an OBSERVATORY
   entry, twenty numbered rooms and an EPILOGUE; its chapter union (§31) omits
   `world-model`, which §3 numbers as room 12 and §18 describes in full. The
   coordinate list is the visitor-facing contract — `ROOM 12 / 20` has to mean
   something — so `world-model` is present here and the two are reconciled.
   ========================================================================== */

export type Chapter =
  | "observatory"
  | "stability"
  | "rupture"
  | "chokepoint"
  | "cascade"
  | "structural-break"
  | "feedback"
  | "convergence"
  | "old-tools"
  | "gap"
  | "ai"
  | "yukthi"
  | "world-model"
  | "map"
  | "monitor"
  | "forecast"
  | "simulate"
  | "remap"
  | "decisions"
  | "investment"
  | "finale";

/**
 * The eight forms the persistent world instrument takes (§5).
 *
 * It is one object throughout. These are the representations it resolves into,
 * and the transformation that carries the whole argument is
 * `fragmented-network → causal-graph`: the moment geography stops being the
 * organising principle and causal relation takes over.
 */
export type WorldForm =
  | "abstract"
  | "planet"
  | "global-network"
  | "fragmented-network"
  | "causal-graph"
  | "hypergraph"
  | "world-model"
  | "futures";

/** Camera grammar (§35). Movement communicates scale of attention, not spectacle. */
export type CameraMode =
  /** The whole system, held at a distance. */
  | "far"
  /** One node, close enough to read its mechanism. */
  | "macro"
  /** Inside the network, depth between strata visible. */
  | "deep"
  /** The world flattened into an analytical plane. */
  | "flat"
  /** Abstract graph space. No horizon. */
  | "abstract"
  /** A single decision scope, everything else dimmed. */
  | "focus"
  /** A slow withdrawal that never quite returns to where it began. */
  | "pullback";

export type RoomDefinition = {
  id: Chapter;
  /** Displayed coordinate. `null` for the observatory, which precedes room 01. */
  room: number | null;
  /** Short name in the coordinate readout and room index. */
  label: string;
  /** Accessible name announced when the room becomes current. */
  title: string;
  /** DOM id. Anchors, the room index and the scroll driver all use it. */
  domId: string;
  world: WorldForm;
  camera: CameraMode;
  /**
   * Rooms whose content is a transformation rather than a statement hold the
   * viewport while their timeline scrubs. Pinning is disorienting when
   * overused, so it is spent carefully.
   */
  held: boolean;
};

export const ROOMS: readonly RoomDefinition[] = [
  {
    id: "observatory",
    room: null,
    label: "Observatory",
    title: "Observatory",
    domId: "observatory",
    world: "abstract",
    camera: "far",
    held: true,
  },
  {
    id: "stability",
    room: 1,
    label: "The stable world",
    title: "The world we inherited",
    domId: "stable-world",
    world: "planet",
    camera: "far",
    held: false,
  },
  {
    id: "rupture",
    room: 2,
    label: "Rupture",
    title: "The structure began to change",
    domId: "rupture",
    world: "fragmented-network",
    camera: "deep",
    held: false,
  },
  {
    id: "chokepoint",
    room: 3,
    label: "Chokepoint",
    title: "The chokepoint",
    domId: "chokepoint",
    world: "fragmented-network",
    camera: "macro",
    held: false,
  },
  {
    id: "cascade",
    room: 4,
    label: "Cascade",
    title: "Cascade",
    domId: "cascade",
    world: "causal-graph",
    camera: "deep",
    held: false,
  },
  {
    id: "structural-break",
    room: 5,
    label: "Structural break",
    title: "Reality is not a line",
    domId: "structural-break",
    world: "causal-graph",
    camera: "flat",
    held: false,
  },
  {
    id: "feedback",
    room: 6,
    label: "Feedback",
    title: "Feedback",
    domId: "feedback",
    world: "causal-graph",
    camera: "deep",
    held: false,
  },
  {
    id: "convergence",
    room: 7,
    label: "Convergence",
    title: "Interacting systems",
    domId: "convergence",
    world: "hypergraph",
    camera: "far",
    held: false,
  },
  {
    id: "old-tools",
    room: 8,
    label: "The old instruments",
    title: "The old instruments",
    domId: "old-instruments",
    world: "hypergraph",
    camera: "flat",
    held: false,
  },
  {
    id: "gap",
    room: 9,
    label: "The gap",
    title: "The gap",
    domId: "the-gap",
    world: "hypergraph",
    camera: "flat",
    held: false,
  },
  {
    id: "ai",
    room: 10,
    label: "Why now",
    title: "Why AI changes what is possible",
    domId: "why-now",
    world: "hypergraph",
    camera: "deep",
    held: false,
  },
  {
    id: "yukthi",
    room: 11,
    label: "Yukthi",
    title: "Yukthi",
    domId: "yukthi",
    world: "hypergraph",
    camera: "abstract",
    held: true,
  },
  {
    id: "world-model",
    room: 12,
    label: "The world model",
    title: "What scoped means",
    domId: "world-model",
    world: "world-model",
    camera: "focus",
    held: false,
  },
  {
    id: "map",
    room: 13,
    label: "Map",
    title: "Map",
    domId: "map",
    world: "world-model",
    camera: "abstract",
    held: true,
  },
  {
    id: "monitor",
    room: 14,
    label: "Monitor",
    title: "Monitor",
    domId: "monitor",
    world: "world-model",
    camera: "abstract",
    held: true,
  },
  {
    id: "forecast",
    room: 15,
    label: "Forecast",
    title: "Forecast",
    domId: "forecast",
    world: "futures",
    camera: "abstract",
    held: true,
  },
  {
    id: "simulate",
    room: 16,
    label: "Simulate",
    title: "Simulate",
    domId: "simulate",
    world: "world-model",
    camera: "focus",
    held: false,
  },
  {
    id: "remap",
    room: 17,
    label: "Re-map",
    title: "Re-map",
    domId: "remap",
    world: "world-model",
    camera: "abstract",
    held: true,
  },
  {
    id: "decisions",
    room: 18,
    label: "The 3 a.m. problem",
    title: "The 3 a.m. problem",
    domId: "three-am",
    world: "world-model",
    camera: "focus",
    held: false,
  },
  {
    id: "investment",
    room: 19,
    label: "The bet",
    title: "The investment bet",
    domId: "investment",
    world: "world-model",
    camera: "far",
    held: false,
  },
  {
    id: "finale",
    room: 20,
    label: "Civilizational",
    title: "The civilizational bet",
    domId: "finale",
    world: "futures",
    camera: "pullback",
    held: false,
  },
] as const;

export const ROOM_COUNT = ROOMS.filter((room) => room.room !== null).length;

export const CHAPTER_IDS: readonly Chapter[] = ROOMS.map((room) => room.id);

export const ROOM_BY_ID = Object.fromEntries(ROOMS.map((room) => [room.id, room])) as Record<
  Chapter,
  RoomDefinition
>;

/** Zero-padded coordinate: `01`, `12`, `20`. Rendered verbatim in the DOM. */
export function coordinate(room: number | null): string {
  return room === null ? "—" : room.toString().padStart(2, "0");
}

/** `YUKTHI / OBSERVATORY / 12` — the persistent architectural readout (§3). */
export function coordinateLine(id: Chapter): string {
  const room = ROOM_BY_ID[id];
  return room.room === null
    ? "YUKTHI / OBSERVATORY"
    : `YUKTHI / OBSERVATORY / ${coordinate(room.room)}`;
}
