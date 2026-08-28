/* ============================================================================
   THE WORLD INSTRUMENT — FORM GEOMETRY  (§5)
   ----------------------------------------------------------------------------
   One point cloud and one set of relations, written into the same buffers for
   every form the world takes. Nothing is created or destroyed as the argument
   advances; the same particles are re-addressed. That constraint is the reason
   the world reads as a single object being re-understood rather than as eight
   scenes played in sequence.

   Everything here is a pure function of (form, index, count), so the geometry
   is identical on every reload and can be tested without a renderer.
   ========================================================================== */

import type { WorldForm } from "@/lib/story/chapters";
import { gaussian, seeded } from "./random";

const RADIUS = 2.05;

/** Strategic hubs, distributed by a Fibonacci spiral rather than by geography. */
const HUB_COUNT = 26;

/** Blocs the network fragments into (§7). Four, because more reads as noise. */
const BLOC_COUNT = 4;

/** Causal depths in the layered forms (§9). */
const LAYERS = 7;

/** Hyperedges in the hypergraph forms (§10). */
const HYPEREDGES = 14;

type Vec3 = { x: number; y: number; z: number };

/** Evenly distributed direction on a sphere. */
function fibonacci(index: number, count: number): Vec3 {
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));
  const y = index * offset - 1 + offset / 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = index * increment;
  return { x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
}

function hub(index: number): Vec3 {
  return fibonacci(index % HUB_COUNT, HUB_COUNT);
}

/** Which bloc a hub falls into once the world fragments. */
function blocOf(hubIndex: number): number {
  return hubIndex % BLOC_COUNT;
}

function blocCentre(bloc: number): Vec3 {
  const direction = fibonacci(bloc, BLOC_COUNT);
  return { x: direction.x * 1.55, y: direction.y * 0.85, z: direction.z * 1.55 };
}

/**
 * Writes the target position of one particle for one form.
 *
 * `random` is seeded per (form, index) so a particle keeps its personality
 * across frames while every form remains reproducible.
 */
export function positionFor(form: WorldForm, index: number, count: number): Vec3 {
  const random = seeded(index * 2654435761 + formSeed(form));

  switch (form) {
    case "abstract": {
      // Room 00. Nothing has resolved yet: an ambiguous shell, thin in y so it
      // reads as a field of traces rather than as a body.
      const direction = fibonacci(index, count);
      const radius = 2.6 + random() * 2.4;
      return {
        x: direction.x * radius,
        y: direction.y * radius * 0.42 + gaussian(random) * 0.35,
        z: direction.z * radius,
      };
    }

    case "planet": {
      const direction = fibonacci(index, count);
      // A thin proportion lifts off the surface, so the sphere has an edge
      // rather than a hard silhouette.
      const lift = random() < 0.14 ? 0.1 + random() * 0.28 : 0;
      const radius = RADIUS + lift;
      return { x: direction.x * radius, y: direction.y * radius, z: direction.z * radius };
    }

    case "global-network": {
      // Most particles gather at hubs; the remainder keep the sphere legible.
      if (random() < 0.72) {
        const hubIndex = index % HUB_COUNT;
        const centre = hub(hubIndex);
        const spread = 0.16;
        return {
          x: centre.x * RADIUS + gaussian(random) * spread,
          y: centre.y * RADIUS + gaussian(random) * spread,
          z: centre.z * RADIUS + gaussian(random) * spread,
        };
      }
      const direction = fibonacci(index, count);
      return { x: direction.x * RADIUS, y: direction.y * RADIUS, z: direction.z * RADIUS };
    }

    case "fragmented-network": {
      // The same hubs, pulled apart into blocs. The planet is still implied by
      // the gaps it leaves behind.
      const hubIndex = index % HUB_COUNT;
      const centre = hub(hubIndex);
      const bloc = blocCentre(blocOf(hubIndex));
      const pull = 0.42;
      const spread = random() < 0.75 ? 0.19 : 0.5;
      return {
        x: centre.x * RADIUS * (1 - pull) + bloc.x * pull * 1.9 + gaussian(random) * spread,
        y: centre.y * RADIUS * (1 - pull) + bloc.y * pull * 1.9 + gaussian(random) * spread,
        z: centre.z * RADIUS * (1 - pull) + bloc.z * pull * 1.9 + gaussian(random) * spread,
      };
    }

    case "causal-graph": {
      // Geography is gone. Depth from the causes is the only vertical axis.
      const layer = index % LAYERS;
      const within = Math.floor(index / LAYERS);
      const perLayer = Math.max(1, Math.ceil(count / LAYERS));
      const angle = (within / perLayer) * Math.PI * 2 + layer * 0.7;
      const ring = 0.9 + (within % 3) * 0.62 + random() * 0.12;
      return {
        x: Math.cos(angle) * ring,
        y: 2.5 - (layer / (LAYERS - 1)) * 5,
        z: Math.sin(angle) * ring,
      };
    }

    case "hypergraph": {
      // Each particle belongs to a hyperedge and sits in the plane that edge
      // spans — the visual reason a hyperedge is not a line.
      const edge = index % HYPEREDGES;
      const centre = fibonacci(edge, HYPEREDGES);
      const angle = random() * Math.PI * 2;
      const radius = 0.28 + random() * 0.5;
      const tiltA = { x: -centre.z, y: 0, z: centre.x };
      const norm = Math.hypot(tiltA.x, tiltA.z) || 1;
      const uX = tiltA.x / norm;
      const uZ = tiltA.z / norm;
      const vX = centre.y * uZ;
      const vY = centre.z * uX - centre.x * uZ;
      const vZ = -centre.y * uX;
      const cos = Math.cos(angle) * radius;
      const sin = Math.sin(angle) * radius;
      return {
        x: centre.x * 1.75 + uX * cos + vX * sin,
        y: centre.y * 1.75 + vY * sin,
        z: centre.z * 1.75 + uZ * cos + vZ * sin,
      };
    }

    case "world-model": {
      // The hypergraph, plus an outer shell of evidence still attaching to it.
      if (random() < 0.34) {
        const direction = fibonacci(index, count);
        const shell = 3.1 + random() * 0.75;
        return { x: direction.x * shell, y: direction.y * shell * 0.7, z: direction.z * shell };
      }
      return positionFor("hypergraph", index, count);
    }

    case "futures": {
      // A trunk of settled structure, then divergence. Branches spread in x and
      // fan in z, so the futures separate without any of them looking chosen.
      const along = random();
      if (along < 0.3) {
        return {
          x: gaussian(random) * 0.32,
          y: -2.6 + along * 5.2,
          z: gaussian(random) * 0.32,
        };
      }
      const branch = index % 3;
      const spread = (along - 0.3) / 0.7;
      const direction = branch - 1;
      return {
        x: direction * spread * 2.5 + gaussian(random) * 0.24 * spread,
        y: -1.05 + spread * 3.4,
        z: (branch % 2 === 0 ? 1 : -1) * spread * 1.15 + gaussian(random) * 0.22,
      };
    }
  }
}

function formSeed(form: WorldForm): number {
  switch (form) {
    case "abstract":
      return 11;
    case "planet":
      return 23;
    case "global-network":
      return 37;
    case "fragmented-network":
      return 53;
    case "causal-graph":
      return 71;
    case "hypergraph":
      return 97;
    case "world-model":
      return 113;
    case "futures":
      return 131;
  }
}

/** Fills `target` with `count` positions for `form`. Allocation-free. */
export function writePositions(target: Float32Array, form: WorldForm, count: number): void {
  for (let index = 0; index < count; index += 1) {
    const point = positionFor(form, index, count);
    target[index * 3] = point.x;
    target[index * 3 + 1] = point.y;
    target[index * 3 + 2] = point.z;
  }
}

/**
 * Relation topology per form: pairs of particle indices to be drawn as segments.
 *
 * Connectivity is chosen to say something. A global network links hubs across
 * the sphere; a fragmented one mostly links within blocs; a causal graph only
 * ever links a layer to the one below it; a hypergraph links members of an edge
 * to their shared centre, which is what makes conjunction visible.
 */
export function relationPairs(form: WorldForm, count: number, relations: number): Uint32Array {
  const pairs = new Uint32Array(relations * 2);
  const random = seeded(formSeed(form) * 7919);

  for (let i = 0; i < relations; i += 1) {
    let a = 0;
    let b = 0;

    switch (form) {
      case "abstract": {
        // Neighbouring indices are neighbours on the Fibonacci spiral, so
        // linking nearby ones yields short orbital traces. Fully random pairs
        // would draw long spikes across the frame, which reads as noise rather
        // than as a structure that has not resolved yet.
        a = Math.floor(random() * count);
        b = (a + 1 + Math.floor(random() * 4)) % count;
        break;
      }
      case "planet":
      case "global-network": {
        const hubA = Math.floor(random() * HUB_COUNT);
        // A trade network reaches across the sphere, but not from every hub to
        // every other — most links are regional.
        const hubB =
          random() < 0.7
            ? (hubA + 1 + Math.floor(random() * 4)) % HUB_COUNT
            : Math.floor(random() * HUB_COUNT);
        a = nearestIndexForHub(hubA, count, i);
        b = nearestIndexForHub(hubB, count, i * 3 + 1);
        break;
      }
      case "fragmented-network": {
        const hubA = Math.floor(random() * HUB_COUNT);
        // Four in five relations stay inside a bloc. The survivors across blocs
        // are the strategic dependencies the argument is about.
        const sameBloc = random() < 0.8;
        const hubB = sameBloc
          ? pickHubInBloc(blocOf(hubA), random)
          : Math.floor(random() * HUB_COUNT);
        a = nearestIndexForHub(hubA, count, i);
        b = nearestIndexForHub(hubB, count, i * 5 + 2);
        break;
      }
      case "causal-graph": {
        const layer = Math.floor(random() * (LAYERS - 1));
        a = indexInLayer(layer, count, i);
        b = indexInLayer(layer + 1, count, i * 3 + 1);
        break;
      }
      case "hypergraph":
      case "world-model": {
        const edge = Math.floor(random() * HYPEREDGES);
        a = indexInEdge(edge, count, i);
        b = indexInEdge(edge, count, i * 7 + 3);
        break;
      }
      case "futures": {
        const branch = i % 3;
        a = indexInBranch(branch, count, i);
        b = indexInBranch(branch, count, i * 3 + 1);
        break;
      }
    }

    pairs[i * 2] = a % count;
    pairs[i * 2 + 1] = b % count;
  }

  return pairs;
}

function nearestIndexForHub(hubIndex: number, count: number, salt: number): number {
  const stride = Math.max(1, Math.floor(count / HUB_COUNT));
  return (hubIndex + salt * HUB_COUNT) % Math.max(1, stride * HUB_COUNT);
}

function pickHubInBloc(bloc: number, random: () => number): number {
  const perBloc = Math.max(1, Math.floor(HUB_COUNT / BLOC_COUNT));
  return (bloc + BLOC_COUNT * Math.floor(random() * perBloc)) % HUB_COUNT;
}

function indexInLayer(layer: number, count: number, salt: number): number {
  const perLayer = Math.max(1, Math.floor(count / LAYERS));
  return (layer + LAYERS * (salt % perLayer)) % count;
}

function indexInEdge(edge: number, count: number, salt: number): number {
  const perEdge = Math.max(1, Math.floor(count / HYPEREDGES));
  return (edge + HYPEREDGES * (salt % perEdge)) % count;
}

function indexInBranch(branch: number, count: number, salt: number): number {
  return (branch + 3 * (salt % Math.max(1, Math.floor(count / 3)))) % count;
}

export const FORM_CONSTANTS = { RADIUS, HUB_COUNT, BLOC_COUNT, LAYERS, HYPEREDGES } as const;
