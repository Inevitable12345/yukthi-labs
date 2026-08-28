import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROOMS } from "@/lib/story/chapters";
import {
  getSnapshot,
  readOverall,
  readProgress,
  resetStory,
  setChapter,
  setOverall,
  setProgress,
  subscribe,
} from "@/lib/story/store";

describe("story store", () => {
  beforeEach(() => resetStory());

  it("starts in the observatory", () => {
    expect(getSnapshot().chapter).toBe("observatory");
    expect(getSnapshot().entered).toBe(false);
  });

  it("notifies subscribers when the room changes, and only then", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    setChapter("chokepoint");
    expect(listener).toHaveBeenCalledTimes(1);

    // Re-entering the same room is not a change.
    setChapter("chokepoint");
    expect(listener).toHaveBeenCalledTimes(1);

    // Progress is deliberately off the React channel.
    setProgress("chokepoint", 0.5);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setChapter("finale");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("records the room's ordinal", () => {
    setChapter("yukthi");
    expect(getSnapshot().order).toBe(ROOMS.findIndex((room) => room.id === "yukthi"));
    expect(getSnapshot().entered).toBe(true);
  });

  it("clamps progress and overall into 0..1", () => {
    setProgress("cascade", 1.9);
    expect(readProgress("cascade")).toBe(1);
    setProgress("cascade", -3);
    expect(readProgress("cascade")).toBe(0);
    setOverall(4);
    expect(readOverall()).toBe(1);
  });

  it("keeps rooms independent", () => {
    setProgress("map", 0.25);
    setProgress("monitor", 0.75);
    expect(readProgress("map")).toBe(0.25);
    expect(readProgress("monitor")).toBe(0.75);
  });

  it("supports reverse traversal without special-casing direction", () => {
    setChapter("finale");
    setChapter("observatory");
    expect(getSnapshot().chapter).toBe("observatory");
    expect(getSnapshot().order).toBe(0);
  });
});
