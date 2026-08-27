import { beforeEach, describe, expect, it, vi } from "vitest";

import { CHAPTERS } from "@/lib/story/chapters";
import { smoothstep, span, storyStore } from "@/lib/story/store";

describe("story store", () => {
  beforeEach(() => storyStore.reset());

  it("starts at the first chapter, unengaged", () => {
    const snapshot = storyStore.read();
    expect(snapshot.chapter).toBe(CHAPTERS[0]!.id);
    expect(snapshot.chapterProgress).toBe(0);
    expect(snapshot.engaged).toBe(false);
  });

  it("adopts the world form and camera of the active chapter", () => {
    storyStore.setChapterProgress("rare-earth", 0.5, true);
    const snapshot = storyStore.read();

    expect(snapshot.chapter).toBe("rare-earth");
    expect(snapshot.world).toBe("chokepoint");
    expect(snapshot.camera).toBe("close");
  });

  it("clamps progress into 0..1", () => {
    storyStore.setChapterProgress("rupture", 4.2, true);
    expect(storyStore.read().chapterProgress).toBe(1);

    storyStore.setChapterProgress("rupture", -3, true);
    expect(storyStore.read().chapterProgress).toBe(0);
  });

  it("does not let an inactive chapter claim the current slot", () => {
    storyStore.setChapterProgress("rupture", 0.4, true);
    storyStore.setChapterProgress("stability", 1, false);

    // The departing chapter still records its own progress...
    expect(storyStore.progressFor("stability")).toBe(1);
    // ...but does not become current.
    expect(storyStore.read().chapter).toBe("rupture");
  });

  it("reconstructs identical state when scrolled backwards", () => {
    storyStore.setChapterProgress("semiconductor", 0.42, true);
    const forward = { ...storyStore.read() };

    // Travel onward, then come back to precisely the same scroll position.
    storyStore.setChapterProgress("feedback", 0.8, true);
    storyStore.setChapterProgress("coming-decade", 0.3, true);
    storyStore.setChapterProgress("semiconductor", 0.42, true);

    const returned = storyStore.read();

    // `engaged` is deliberately sticky — it records that the reader has moved at
    // all, which cannot become false again. Everything else must match exactly.
    expect(returned.chapter).toBe(forward.chapter);
    expect(returned.chapterProgress).toBe(forward.chapterProgress);
    expect(returned.timeline).toBe(forward.timeline);
    expect(returned.globalProgress).toBe(forward.globalProgress);
    expect(returned.world).toBe(forward.world);
    expect(returned.camera).toBe(forward.camera);
  });

  it("advances the timeline monotonically through the chapter list", () => {
    const seen: number[] = [];
    for (const chapter of CHAPTERS) {
      storyStore.setChapterProgress(chapter.id, 0, true);
      seen.push(storyStore.read().timeline);
    }

    const sorted = [...seen].sort((a, b) => a - b);
    expect(seen).toEqual(sorted);
  });

  it("keeps global progress within 0..1 at the very end", () => {
    const last = CHAPTERS[CHAPTERS.length - 1]!;
    storyStore.setChapterProgress(last.id, 1, true);
    expect(storyStore.read().globalProgress).toBeLessThanOrEqual(1);
    expect(storyStore.read().globalProgress).toBeGreaterThan(0.9);
  });

  it("notifies subscribers only when a coarse value changes", () => {
    const listener = vi.fn();
    const unsubscribe = storyStore.subscribe(listener);

    storyStore.setChapterProgress("rupture", 0.1, true);
    const afterChapterChange = listener.mock.calls.length;
    expect(afterChapterChange).toBeGreaterThan(0);

    // Continuous movement inside one chapter must not re-render the DOM.
    storyStore.setChapterProgress("rupture", 0.2, true);
    storyStore.setChapterProgress("rupture", 0.3, true);
    storyStore.setChapterProgress("rupture", 0.4, true);

    expect(listener.mock.calls.length).toBe(afterChapterChange);

    unsubscribe();
  });
});

describe("interpolation helpers", () => {
  it("span holds its endpoints outside the range", () => {
    expect(span(0, "stability", "rupture")).toBe(0);
    expect(span(-5, "stability", "rupture")).toBe(0);
    expect(span(99, "stability", "rupture")).toBe(1);
  });

  it("span reaches 0.5 at the midpoint", () => {
    const start = CHAPTERS.findIndex((chapter) => chapter.id === "stability");
    const end = CHAPTERS.findIndex((chapter) => chapter.id === "rare-earth");
    expect(span((start + end) / 2, "stability", "rare-earth")).toBeCloseTo(0.5, 5);
  });

  it("smoothstep is clamped and eases at both ends", () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
    expect(smoothstep(0.5)).toBeCloseTo(0.5, 5);
    // Eased, so early progress is slower than linear.
    expect(smoothstep(0.25)).toBeLessThan(0.25);
    expect(smoothstep(0.75)).toBeGreaterThan(0.75);
  });
});
