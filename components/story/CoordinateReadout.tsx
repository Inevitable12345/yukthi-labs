"use client";

import { ROOM_BY_ID, ROOM_COUNT, coordinate, coordinateLine } from "@/lib/story/chapters";
import { useStory } from "@/lib/story/use-story";

/**
 * The persistent coordinate (§3).
 *
 * Architectural, not a progress bar: it states where you are, not how much is
 * left. It is a live region so the room announces itself to a screen reader on
 * arrival, which is the same information the sighted visitor gets from it.
 */
export function CoordinateReadout() {
  const { chapter } = useStory();
  const room = ROOM_BY_ID[chapter];

  return (
    <div
      data-print-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 z-40 hidden bg-gradient-to-tr from-void via-void/90 to-transparent py-5 pr-16 pl-5 sm:block sm:pl-8"
    >
      <p aria-live="polite" className="font-mono text-[0.66rem] tracking-[0.22em] uppercase">
        <span className="text-brass">{coordinateLine(chapter)}</span>
        {room.room !== null ? (
          <span className="text-ash">
            {" "}
            / {coordinate(room.room)} of {ROOM_COUNT}
          </span>
        ) : null}
      </p>
      <p className="mt-1 font-mono text-[0.66rem] tracking-[0.16em] text-ash">{room.label}</p>
    </div>
  );
}
