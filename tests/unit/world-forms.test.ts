import { describe, expect, it } from "vitest";
import { FORM_CONSTANTS, positionFor, relationPairs, writePositions } from "@/lib/world/forms";
import { seeded } from "@/lib/world/random";
import { CAMERA_POSES, damp } from "@/lib/world/camera";
import { ROOMS, type WorldForm } from "@/lib/story/chapters";

const FORMS: WorldForm[] = [
  "abstract",
  "planet",
  "global-network",
  "fragmented-network",
  "causal-graph",
  "hypergraph",
  "world-model",
  "futures",
];

describe("world geometry", () => {
  it("is deterministic — the world looks identical on every reload", () => {
    for (const form of FORMS) {
      const first = positionFor(form, 42, 1000);
      const second = positionFor(form, 42, 1000);
      expect(second, form).toEqual(first);
    }
  });

  it("keeps every particle inside the camera's working volume", () => {
    for (const form of FORMS) {
      for (let index = 0; index < 400; index += 1) {
        const point = positionFor(form, index, 400);
        const radius = Math.hypot(point.x, point.y, point.z);
        expect(Number.isFinite(radius), `${form}/${index}`).toBe(true);
        expect(radius, `${form}/${index}`).toBeLessThan(9);
      }
    }
  });

  it("puts the planet on a sphere", () => {
    for (let index = 0; index < 200; index += 1) {
      const point = positionFor("planet", index, 200);
      const radius = Math.hypot(point.x, point.y, point.z);
      expect(radius).toBeGreaterThanOrEqual(FORM_CONSTANTS.RADIUS - 0.01);
      expect(radius).toBeLessThan(FORM_CONSTANTS.RADIUS + 0.45);
    }
  });

  it("separates the causal graph into distinct depths", () => {
    const heights = new Set<number>();
    for (let index = 0; index < 140; index += 1) {
      heights.add(Number(positionFor("causal-graph", index, 140).y.toFixed(4)));
    }
    expect(heights.size).toBe(FORM_CONSTANTS.LAYERS);
  });

  it("fills a buffer without allocating one", () => {
    const buffer = new Float32Array(30);
    writePositions(buffer, "hypergraph", 10);
    expect(buffer.some((value) => value !== 0)).toBe(true);
    expect(buffer.every((value) => Number.isFinite(value))).toBe(true);
  });

  it("emits in-range relation indices for every form", () => {
    for (const form of FORMS) {
      const pairs = relationPairs(form, 300, 120);
      expect(pairs.length, form).toBe(240);
      for (const index of pairs) {
        expect(index, form).toBeGreaterThanOrEqual(0);
        expect(index, form).toBeLessThan(300);
      }
    }
  });

  it("links only adjacent depths in the causal graph", () => {
    const pairs = relationPairs("causal-graph", 140, 60);
    for (let index = 0; index < 60; index += 1) {
      const a = positionFor("causal-graph", pairs[index * 2]!, 140);
      const b = positionFor("causal-graph", pairs[index * 2 + 1]!, 140);
      // Depth spacing is 5 / (LAYERS - 1); adjacent layers differ by one step.
      const step = 5 / (FORM_CONSTANTS.LAYERS - 1);
      expect(Math.abs(a.y - b.y)).toBeCloseTo(step, 4);
    }
  });
});

describe("seeded random", () => {
  it("repeats exactly for a given seed", () => {
    const a = seeded(7);
    const b = seeded(7);
    for (let index = 0; index < 50; index += 1) expect(b()).toBe(a());
  });

  it("stays within the unit interval", () => {
    const random = seeded(99);
    for (let index = 0; index < 500; index += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("camera", () => {
  it("defines a pose for every mode a room asks for", () => {
    for (const room of ROOMS) {
      expect(CAMERA_POSES[room.camera], room.id).toBeDefined();
    }
  });

  it("damps toward the goal without overshooting", () => {
    let value = 0;
    for (let frame = 0; frame < 240; frame += 1) value = damp(value, 10, 2, 1 / 60);
    expect(value).toBeGreaterThan(9.9);
    expect(value).toBeLessThanOrEqual(10);
  });

  it("is frame-rate independent to within a tolerance", () => {
    let fast = 0;
    for (let frame = 0; frame < 120; frame += 1) fast = damp(fast, 1, 3, 1 / 120);
    let slow = 0;
    for (let frame = 0; frame < 30; frame += 1) slow = damp(slow, 1, 3, 1 / 30);
    expect(Math.abs(fast - slow)).toBeLessThan(0.001);
  });
});
