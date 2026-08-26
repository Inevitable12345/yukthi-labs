import { worldNodeById } from "@/data/world-model";

/* ============================================================================
   SCENE STATE
   ----------------------------------------------------------------------------
   The world layer holds no animation timeline and no imperative sequence. It
   holds one number — scroll position, expressed as a continuous coordinate over
   the thirteen scenes — and every visual quantity is a pure function of it.

   That is the whole reversibility strategy. Scrolling up is not an "exit"
   animation that has to undo anything; it is the same function evaluated at a
   smaller number. There is no state to become stale, and no transition that can
   fire twice.
   ========================================================================== */

export type WorldScene =
  | "invocation"
  | "stability"
  | "rupture"
  | "evidence"
  | "chokepoint"
  | "hypergraph-intro"
  | "structural-break"
  | "feedback"
  | "decision-scope"
  | "ai-organization"
  | "world-model"
  | "future-space"
  | "horizon";

export type SceneDefinition = {
  id: WorldScene;
  /** Homepage sections this scene is pinned to, in document order. */
  anchors: string[];
  /** Instrument-panel name for the scene. */
  label: string;
  /** What the world layer is doing, in one line, for the readout and for readers. */
  state: string;
  /** Read in place of the scene by anyone who cannot see it. */
  textAlternative: string;
  /** Node the camera and the labels attend to. */
  focus?: string;
  camera: { distance: number; height: number; fov: number };
};

export const WORLD_SCENES: readonly SceneDefinition[] = [
  {
    id: "invocation",
    anchors: ["invocation"],
    label: "Invocation",
    state: "Latent · a horizon and a few distant points",
    textAlternative:
      "Near-darkness. A faint horizon line with a handful of distant points above it, not yet connected.",
    camera: { distance: 7.6, height: -1.7, fov: 34 },
  },
  {
    id: "stability",
    anchors: ["stable-world"],
    label: "Stable world",
    state: "Recurrent · routes running on their expected paths",
    textAlternative:
      "An abstract sphere with a cartographic graticule and coarse landmass hints. Trade, energy and component routes run between real locations as smooth great-circle arcs, repeating at a regular cadence. Nothing about the arrangement suggests it is contingent.",
    focus: "suez",
    camera: { distance: 4.9, height: 0.18, fov: 34 },
  },
  {
    id: "rupture",
    anchors: ["rupture"],
    label: "Structural rupture",
    state: "Rewiring · routes rerouted, conditional or broken",
    textAlternative:
      "The same sphere and the same endpoints. The routes between them change: some are redrawn the long way round, some are marked conditional, and one is marked broken. Nothing is destroyed; the arrangement is rewired and the uncertainty around it widens.",
    focus: "suez",
    camera: { distance: 4.8, height: 0.1, fov: 36 },
  },
  {
    id: "evidence",
    anchors: ["evidence-field"],
    label: "Evidence field",
    state: "Docking · sourced claims anchoring to structure",
    textAlternative:
      "Small square markers arrive from outside the sphere and anchor themselves to specific nodes and routes. Each marker corresponds to a record in the evidence library, with its source, date and verification status.",
    focus: "rotterdam",
    camera: { distance: 4.6, height: 0.24, fov: 36 },
  },
  {
    id: "chokepoint",
    anchors: ["rare-earth"],
    label: "Strategic chokepoint",
    state: "Propagating · one upstream constraint, four downstream sectors",
    textAlternative:
      "The view closes on one upstream node: rare-earth separation and refining capacity. A licensing constraint activates there, and the activation propagates outward along the routes to vehicle assembly, grid and wind equipment, and data-centre build-out. The upstream node stays small while the region it reaches keeps widening.",
    focus: "rare-earth-refining",
    camera: { distance: 3.4, height: 0.32, fov: 32 },
  },
  {
    id: "hypergraph-intro",
    anchors: ["linear-failure"],
    label: "Chain to hypergraph",
    state: "Detaching · nodes leaving their map coordinates",
    textAlternative:
      "A single chain of supplier, component and vehicle is shown to be insufficient. Five separate conditions — fabrication concentration, back-end assembly, a plant interruption, a demand reversal and a weather event — connect jointly to one shared constraint. The nodes begin to leave their geographic positions and arrange themselves by relationship instead.",
    focus: "fab-concentration",
    camera: { distance: 5.1, height: 0.05, fov: 38 },
  },
  {
    id: "structural-break",
    anchors: ["structural-break"],
    label: "Structural break",
    state: "Analytic · fitted path against observed path",
    textAlternative:
      "Part of the scene flattens into an analytic plane. A fitted relationship continues along the path history implies, while the observed path departs from it at a break point. The divergence between the two is the subject; the causal regime generating the data changed while the model kept applying the old one.",
    focus: "ecb",
    camera: { distance: 4.6, height: 0.02, fov: 34 },
  },
  {
    id: "feedback",
    anchors: ["feedback", "convergence"],
    label: "Feedback cascade",
    state: "Reinforcing · the output is also an input",
    textAlternative:
      "A closed loop of six states: extreme cold, generation failure, power shortage, gas infrastructure disruption, gas shortage, and further generation failure. A pulse travels the loop, and the loop tightens with each pass, because each pass makes the next one faster.",
    focus: "ercot",
    camera: { distance: 4.0, height: 0.08, fov: 34 },
  },
  {
    id: "decision-scope",
    anchors: ["three-am"],
    label: "Decision scope",
    state: "Scoped · structure rebuilt around one decision",
    textAlternative:
      "The structure narrows to a chosen scope — industry, energy, insurance, supply chain, portfolio or government. Selecting a scope re-lights a different subset of the same world: this is what the word scoped means in the technical bet.",
    focus: "data-centres",
    camera: { distance: 4.7, height: 0.1, fov: 36 },
  },
  {
    id: "ai-organization",
    anchors: ["ai-capability"],
    label: "Evidence organised",
    state: "Resolving · fragments into a causal field",
    textAlternative:
      "Scattered unresolved fragments — documents, events, policy updates, market states — drift without structure, then are resolved, linked and organised into a coherent field. The added layer is not more information; it is explicit causal structure.",
    camera: { distance: 5.4, height: 0.0, fov: 40 },
  },
  {
    id: "world-model",
    anchors: ["the-bet"],
    label: "Causal hypergraph",
    state: "Map → Monitor → Forecast → Simulate → Re-map",
    textAlternative:
      "The geographic shell fades. Meridians disappear, the sphere recedes, and the nodes rearrange by causal relationship into a layered hypergraph running from upstream conditions to outcomes. Many-to-many relationships are drawn through junctions, because the sources act jointly. The loop then runs: structure is mapped, new evidence arrives, forecast paths extend, one state is changed, and the structure reorganises.",
    camera: { distance: 6.0, height: 0.05, fov: 42 },
  },
  {
    id: "future-space",
    anchors: ["futures"],
    label: "Possible futures",
    state: "Branching · illustrative, not model output",
    textAlternative:
      "From the present state, four branches extend forward and widen as they go. Each names its drivers and the assumptions it depends on. No probabilities are attached, because no model has produced any; every branch is labelled illustrative.",
    camera: { distance: 5.8, height: 0.12, fov: 42 },
  },
  {
    id: "horizon",
    anchors: ["ambition"],
    label: "Horizon",
    state: "Receding · paths collapsing to a horizon line",
    textAlternative:
      "The structure recedes and the remaining paths collapse into a single horizon line.",
    camera: { distance: 8.4, height: -0.9, fov: 32 },
  },
];

export const SCENE_COUNT = WORLD_SCENES.length;

/** Every section id the world layer needs to measure, in document order. */
export const WORLD_ANCHORS: readonly string[] = WORLD_SCENES.flatMap((scene) => scene.anchors);

/* --------------------------------------------------------------------------
   Interpolation primitives
   ------------------------------------------------------------------------ */

export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Hermite ramp. Zero below `edge0`, one above `edge1`, smooth in between. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 === edge0) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** A ramp up and back down again — presence of a scene that later hands over. */
export function band(
  x: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  return smoothstep(inStart, inEnd, x) * (1 - smoothstep(outStart, outEnd, x));
}

/* --------------------------------------------------------------------------
   The state itself
   ------------------------------------------------------------------------ */

export type WorldState = {
  /** Continuous position over the scenes, 0 … SCENE_COUNT − 1. */
  t: number;
  index: number;
  scene: WorldScene;
  /** Progress through the current scene, 0 … 1. */
  local: number;

  /** Globe materialises out of darkness. */
  resolve: number;
  /** Cartographic shell: meridians, landmass hints, coordinate ticks. */
  geoShell: number;
  /** Recurrent, legible circulation — the stable era's signature. */
  stability: number;
  /** Routes rerouted, made conditional, or broken. */
  rewire: number;
  /** Evidence markers docked onto nodes and relations. */
  evidence: number;
  /** Chokepoint activation propagating downstream. */
  chokepoint: number;
  /** Geographic positions → causal positions. */
  morph: number;
  /** The analytic plane: fitted path against observed path. */
  analytic: number;
  /** Reinforcing loop presence, and how tight it has become. */
  feedback: number;
  /** Structure narrowed to one decision scope. */
  scope: number;
  /** Unresolved fragments resolving into structure. */
  organize: number;
  /** Map → Monitor → Forecast → Simulate → Re-map, 0 … 1 across the loop. */
  loop: number;
  /** Position within that loop, 0 … 5, one unit per phase. */
  loopPhase: number;
  /** Simulate: a state has been changed and the change is propagating. */
  perturb: number;
  /** Re-map: the structure reorganising around what the evidence now says. */
  remap: number;
  /** Future branches extended and widened. */
  futures: number;
  /** Everything receding to a horizon line. */
  horizon: number;
  /** Overall intensity of the layer, so it never fights the text. */
  presence: number;
};

/**
 * The whole visual system as a function of one number.
 *
 * Ramps overlap deliberately: a scene begins arriving before the previous one has
 * finished leaving, which is what makes the sequence read as one continuous world
 * rather than thirteen slides.
 */
export function worldStateAt(t: number): WorldState {
  // The coordinate runs 0 … SCENE_COUNT: each scene owns one unit, so the final
  // scene can run to completion rather than stopping at its own beginning.
  const clamped = Math.min(Math.max(t, 0), SCENE_COUNT);
  const index = Math.min(SCENE_COUNT - 1, Math.max(0, Math.floor(clamped)));
  const local = clamped - index;

  const morph = 0.42 * smoothstep(4.85, 5.8, clamped) + 0.58 * smoothstep(9.35, 10.35, clamped);
  const horizon = smoothstep(11.55, 12.6, clamped);
  // The operating loop runs across the reveal act: five phases, one section.
  const loopPhase = clamp01((clamped - 9.95) / 1.02) * 5;
  const resolve = smoothstep(0.12, 1.0, clamped) * (1 - 0.75 * horizon);

  return {
    t: clamped,
    index,
    scene: WORLD_SCENES[index]!.id,
    local,

    resolve,
    geoShell: resolve * (1 - morph),
    stability: band(clamped, 0.35, 1.0, 1.55, 2.25),
    rewire: smoothstep(1.7, 2.65, clamped),
    evidence: smoothstep(2.55, 3.45, clamped) * (1 - 0.6 * horizon),
    chokepoint: band(clamped, 3.45, 4.15, 4.7, 5.3),
    morph,
    analytic: band(clamped, 5.6, 6.15, 6.6, 7.15),
    feedback: band(clamped, 6.65, 7.2, 8.35, 8.95),
    scope: band(clamped, 7.7, 8.25, 8.7, 9.3),
    organize: band(clamped, 8.7, 9.3, 9.9, 10.5),
    loop: smoothstep(9.7, 10.4, clamped) * (1 - smoothstep(10.9, 11.5, clamped)),
    loopPhase,
    // Simulate: one policy state is changed, and the change is carried outward.
    perturb: band(loopPhase, 2.55, 3.15, 4.25, 4.9),
    // Re-map: the structure settles into the arrangement the new evidence implies,
    // and stays there. Nothing here restores the previous map.
    remap: smoothstep(3.85, 4.9, loopPhase),
    futures: band(clamped, 10.5, 11.2, 11.9, 12.5),
    horizon,
    // The layer is always secondary to the argument in front of it.
    presence: smoothstep(0.05, 0.7, clamped) * (1 - 0.55 * horizon),
  };
}

const DEG = Math.PI / 180;

/**
 * Rotation that brings a scene's focus node to face the camera.
 *
 * Derived rather than authored, so a change of coordinates in the data moves the
 * globe correctly without anyone remembering to update an angle.
 */
export function focusRotation(scene: SceneDefinition): { x: number; y: number } {
  if (!scene.focus) return { x: 0.06, y: 0 };
  const node = worldNodeById.get(scene.focus);
  if (!node) return { x: 0.06, y: 0 };
  return {
    // A point at longitude L faces the camera when the globe is rotated by −90° − L.
    y: (-90 - node.lon) * DEG,
    // Tilt part of the way to the node's latitude: enough to bring it into view,
    // not so much that the poles swing.
    x: node.lat * DEG * 0.45,
  };
}

export type CameraKeyframe = {
  distance: number;
  height: number;
  fov: number;
  rotationX: number;
  rotationY: number;
};

/** Camera and globe orientation at a continuous scene position. */
export function cameraAt(t: number): CameraKeyframe {
  const clamped = Math.min(Math.max(t, 0), SCENE_COUNT);
  const index = Math.min(SCENE_COUNT - 2, Math.floor(clamped));
  const local = clamp01(clamped - index);
  const eased = local * local * (3 - 2 * local);

  const from = WORLD_SCENES[index]!;
  const to = WORLD_SCENES[index + 1] ?? from;
  const fromRotation = focusRotation(from);
  const toRotation = focusRotation(to);

  // Rotate the short way round. Without this a focus change of 200° spins the
  // globe the long way and reads as a flourish rather than as a movement.
  let deltaY = toRotation.y - fromRotation.y;
  while (deltaY > Math.PI) deltaY -= Math.PI * 2;
  while (deltaY < -Math.PI) deltaY += Math.PI * 2;

  return {
    distance: lerp(from.camera.distance, to.camera.distance, eased),
    height: lerp(from.camera.height, to.camera.height, eased),
    fov: lerp(from.camera.fov, to.camera.fov, eased),
    rotationX: lerp(fromRotation.x, toRotation.x, eased),
    rotationY: fromRotation.y + deltaY * eased,
  };
}

/**
 * Scroll position → scene coordinate.
 *
 * Each scene owns the span of the sections pinned to it. The reading line is the
 * middle of the viewport, so a scene is at its peak when its section is being
 * read, not when its top edge crosses the fold.
 */
export type AnchorSpan = { id: WorldScene; start: number; end: number };

export function sceneCoordinate(spans: readonly AnchorSpan[], reading: number): number {
  if (spans.length === 0) return 0;

  const first = spans[0]!;
  if (reading <= first.start) return 0;

  for (let index = 0; index < spans.length; index += 1) {
    const span = spans[index]!;
    if (reading >= span.start && reading < span.end) {
      const length = Math.max(1, span.end - span.start);
      return index + clamp01((reading - span.start) / length);
    }
    const next = spans[index + 1];
    // Gaps between sections — borders, margins, the space a diagram leaves — are
    // held at the boundary rather than interpolated across, so a scene does not
    // start arriving before its section does.
    if (next && reading >= span.end && reading < next.start) return index + 1;
  }

  // Past the last section the sequence is complete, not restarted.
  return spans.length;
}
