/**
 * Deterministic geometry for the causal field.
 *
 * Seeded rather than random so that the server render, the client render and the
 * static fallback are the same picture — and so the composition can be tuned
 * rather than re-rolled.
 */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type FieldNode = {
  x: number;
  y: number;
  z: number;
  /** 0–1. Drives size and brightness; a few nodes carry the composition. */
  weight: number;
};

export type FieldEdge = { a: number; b: number; strength: number };

export type Field = { nodes: FieldNode[]; edges: FieldEdge[] };

/**
 * Points distributed through a flattened ellipsoid, with edges only between
 * neighbours inside a radius — so the field reads as structure rather than noise.
 */
export function buildField(count: number, seed = 20260825): Field {
  const random = mulberry32(seed);
  const nodes: FieldNode[] = [];

  for (let index = 0; index < count; index += 1) {
    // Rejection-free spherical distribution, flattened on z and stretched on x.
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 0.42 + Math.pow(random(), 0.65) * 0.58;

    nodes.push({
      x: Math.sin(phi) * Math.cos(theta) * radius * 1.55,
      y: Math.sin(phi) * Math.sin(theta) * radius * 0.86,
      z: Math.cos(phi) * radius * 0.62,
      weight: Math.pow(random(), 2.4),
    });
  }

  const edges: FieldEdge[] = [];
  const maxDistance = 0.46;

  for (let i = 0; i < nodes.length; i += 1) {
    let linked = 0;
    for (let j = i + 1; j < nodes.length && linked < 3; j += 1) {
      const a = nodes[i]!;
      const b = nodes[j]!;
      const distance = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
      if (distance < maxDistance) {
        edges.push({ a: i, b: j, strength: 1 - distance / maxDistance });
        linked += 1;
      }
    }
  }

  return { nodes, edges };
}
