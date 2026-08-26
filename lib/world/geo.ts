/* ============================================================================
   SPHERICAL GEOMETRY
   ----------------------------------------------------------------------------
   Everything the world layer draws is procedural: coordinates, graticule,
   great-circle routes and coarse landmass hints are computed from numbers held
   in `data/world-model.ts`, never downloaded as an asset.

   Two consequences that matter:
     · the globe costs a few kilobytes of arithmetic instead of a texture;
     · every point on it is addressable by latitude and longitude, so a causal
       node and its place on Earth are the same object.
   ========================================================================== */

export type Vec3 = readonly [number, number, number];

const DEG = Math.PI / 180;

/**
 * Latitude/longitude to a point on a sphere of `radius`.
 *
 * Longitude 0 faces +Z, so the default camera looks at the prime meridian and
 * the familiar orientation of a globe is preserved.
 */
export function latLonToVec3(latitude: number, longitude: number, radius = 1): Vec3 {
  const phi = (90 - latitude) * DEG;
  const theta = (longitude + 180) * DEG;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

export function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** Angle between two directions, in radians. The distance metric on a sphere. */
export function angleBetween(a: Vec3, b: Vec3): number {
  const clamped = Math.min(1, Math.max(-1, dot(normalize(a), normalize(b))));
  return Math.acos(clamped);
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/**
 * Spherical interpolation between two surface points.
 *
 * A route between two places on a globe is an arc, not a chord — drawing the
 * chord would sink the line through the planet.
 */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const from = normalize(a);
  const to = normalize(b);
  const omega = angleBetween(from, to);

  if (omega < 1e-6) return lerpVec3(a, b, t);

  const sinOmega = Math.sin(omega);
  const wa = Math.sin((1 - t) * omega) / sinOmega;
  const wb = Math.sin(t * omega) / sinOmega;
  return [from[0] * wa + to[0] * wb, from[1] * wa + to[1] * wb, from[2] * wa + to[2] * wb];
}

/**
 * Points along a great-circle route, lifted off the surface in the middle so
 * that long routes read as trajectories rather than as scratches on the sphere.
 * `lift` is a fraction of the radius at the apex.
 */
export function arcPoints(a: Vec3, b: Vec3, segments: number, radius = 1, lift = 0.18): Vec3[] {
  const separation = angleBetween(a, b) / Math.PI; // 0 (adjacent) … 1 (antipodal)
  const apex = radius * (1 + lift * separation);
  const points: Vec3[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const direction = normalize(slerp(a, b, t));
    // Sine bow: zero at both ends, maximum halfway along the route.
    const height = radius + (apex - radius) * Math.sin(t * Math.PI);
    points.push([direction[0] * height, direction[1] * height, direction[2] * height]);
  }

  return points;
}

/** A route forced through an intermediate point — a re-routed supply path. */
export function viaArcPoints(
  a: Vec3,
  via: Vec3,
  b: Vec3,
  segments: number,
  radius = 1,
  lift = 0.14,
): Vec3[] {
  const half = Math.max(2, Math.round(segments / 2));
  const first = arcPoints(a, via, half, radius, lift);
  const second = arcPoints(via, b, half, radius, lift);
  return [...first, ...second.slice(1)];
}

/** Flattens a polyline into the pairwise vertex list `THREE.LineSegments` wants. */
export function toLineSegments(points: Vec3[]): number[] {
  const values: number[] = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index]!;
    const b = points[index + 1]!;
    values.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  }
  return values;
}

/**
 * Meridians and parallels — the cartographic scaffold of the sphere.
 * Returned as line segments so the whole graticule is one draw call.
 */
export function graticuleSegments({
  meridians = 24,
  parallels = 11,
  radius = 1,
  resolution = 64,
}: {
  meridians?: number;
  parallels?: number;
  radius?: number;
  resolution?: number;
} = {}): number[] {
  const values: number[] = [];

  for (let m = 0; m < meridians; m += 1) {
    const longitude = -180 + (360 / meridians) * m;
    const points: Vec3[] = [];
    for (let step = 0; step <= resolution; step += 1) {
      const latitude = -90 + (180 / resolution) * step;
      points.push(latLonToVec3(latitude, longitude, radius));
    }
    values.push(...toLineSegments(points));
  }

  for (let p = 1; p <= parallels; p += 1) {
    const latitude = -90 + (180 / (parallels + 1)) * p;
    const points: Vec3[] = [];
    for (let step = 0; step <= resolution; step += 1) {
      const longitude = -180 + (360 / resolution) * step;
      points.push(latLonToVec3(latitude, longitude, radius));
    }
    values.push(...toLineSegments(points));
  }

  return values;
}

/**
 * A measurement ring: an orbital circle at an arbitrary tilt, with tick marks.
 * The astrolabe reference — an instrument that measures, rather than a halo.
 */
export function ringSegments({
  radius = 1.34,
  tiltX = 0.42,
  tiltZ = 0.12,
  resolution = 180,
  ticks = 36,
  tickLength = 0.045,
}: {
  radius?: number;
  tiltX?: number;
  tiltZ?: number;
  resolution?: number;
  ticks?: number;
  tickLength?: number;
} = {}): number[] {
  const values: number[] = [];

  const place = (angle: number, r: number): Vec3 => {
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    // Tilt about X then Z, so the ring reads as an instrument set at an angle.
    const y0 = 0;
    const y1 = y0 * Math.cos(tiltX) - z * Math.sin(tiltX);
    const z1 = y0 * Math.sin(tiltX) + z * Math.cos(tiltX);
    const x2 = x * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
    const y2 = x * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);
    return [x2, y2, z1];
  };

  const circle: Vec3[] = [];
  for (let step = 0; step <= resolution; step += 1) {
    circle.push(place((step / resolution) * Math.PI * 2, radius));
  }
  values.push(...toLineSegments(circle));

  for (let tick = 0; tick < ticks; tick += 1) {
    const angle = (tick / ticks) * Math.PI * 2;
    const long = tick % 6 === 0 ? tickLength * 2.2 : tickLength;
    const inner = place(angle, radius - long);
    const outer = place(angle, radius);
    values.push(inner[0], inner[1], inner[2], outer[0], outer[1], outer[2]);
  }

  return values;
}

/** Ray-tests a latitude/longitude against a closed lat/lon polygon. */
export function pointInPolygon(
  latitude: number,
  longitude: number,
  polygon: readonly (readonly [number, number])[],
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [lonI, latI] = polygon[i]!;
    const [lonJ, latJ] = polygon[j]!;
    const straddles = latI > latitude !== latJ > latitude;
    if (!straddles) continue;
    const crossing = ((lonJ - lonI) * (latitude - latI)) / (latJ - latI) + lonI;
    if (longitude < crossing) inside = !inside;
  }
  return inside;
}

/* --------------------------------------------------------------------------
   ORTHOGRAPHIC PROJECTION
   --------------------------------------------------------------------------
   Used by the non-WebGL rendering of the world. The same coordinates, the same
   rotation, drawn as SVG — so the fallback is the same picture rather than a
   different, poorer illustration.
   ------------------------------------------------------------------------ */

export function rotateY(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [v[0] * cos + v[2] * sin, v[1], -v[0] * sin + v[2] * cos];
}

export function rotateX(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [v[0], v[1] * cos - v[2] * sin, v[1] * sin + v[2] * cos];
}

export type Projected = { x: number; y: number; depth: number; visible: boolean };

/** Rotate, then drop the depth axis. `visible` is false on the far side. */
export function orthographic(v: Vec3, rotationX: number, rotationY: number): Projected {
  const rotated = rotateX(rotateY(v, rotationY), rotationX);
  return {
    x: rotated[0],
    // SVG's y axis runs downward; the world's does not.
    y: -rotated[1],
    depth: rotated[2],
    visible: rotated[2] > -0.02,
  };
}
