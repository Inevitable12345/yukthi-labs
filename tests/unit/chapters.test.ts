import { describe, expect, it } from "vitest";
import { ROOMS, ROOM_COUNT, coordinate, coordinateLine } from "@/lib/story/chapters";
import { ROOM_COPY } from "@/content/thesis";

describe("exhibition structure", () => {
  it("has twenty numbered rooms plus the observatory", () => {
    expect(ROOM_COUNT).toBe(20);
    expect(ROOMS).toHaveLength(21);
    expect(ROOMS[0]!.id).toBe("observatory");
    expect(ROOMS[0]!.room).toBeNull();
  });

  it("numbers the rooms 01 to 20 without gaps", () => {
    const numbers = ROOMS.filter((room) => room.room !== null).map((room) => room.room);
    expect(numbers).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
  });

  it("gives every room a unique DOM id", () => {
    const ids = ROOMS.map((room) => room.domId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has copy for every room", () => {
    for (const room of ROOMS) {
      const copy = ROOM_COPY[room.id];
      expect(copy, room.id).toBeDefined();
      expect(copy.headline.length, room.id).toBeGreaterThan(0);
      expect(copy.body.length, room.id).toBeGreaterThan(0);
    }
  });

  it("formats coordinates architecturally, not as a progress bar", () => {
    expect(coordinate(1)).toBe("01");
    expect(coordinate(20)).toBe("20");
    expect(coordinate(null)).toBe("—");
    expect(coordinateLine("yukthi")).toBe("YUKTHI / OBSERVATORY / 11");
    expect(coordinateLine("observatory")).toBe("YUKTHI / OBSERVATORY");
  });
});
