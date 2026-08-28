import type { ReactNode } from "react";
import { ROOM_BY_ID, coordinate, type Chapter } from "@/lib/story/chapters";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   A ROOM  (§3)
   ----------------------------------------------------------------------------
   Semantically a `<section>` with an accessible name taken from the exhibition
   structure, so the document outline reads as the argument even with every
   stylesheet and script removed.

   Two independent properties, which it is a mistake to conflate:

     • `hold` gives the room extra scroll length, so a scrubbed visual has room
       to run.
     • `pinned` holds the room's contents in the viewport while that happens.

   A room can want the first without the second. Rooms that carry several
   paragraphs are given the length and left to scroll, with their figure made
   sticky by the scene itself — pinning a column of prose taller than the
   viewport does not hold it still, it truncates it.
   ========================================================================== */

export function Room({
  id,
  children,
  className,
  contentClassName,
  /** Scroll length, in multiples of viewport height. */
  hold,
  /** Overrides the room definition's own decision. */
  pinned,
}: {
  id: Chapter;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  hold?: number;
  pinned?: boolean;
}) {
  const room = ROOM_BY_ID[id];
  const held = pinned ?? room.held;
  const holdHeight = hold ?? (held ? 2.4 : undefined);

  return (
    <section
      id={room.domId}
      data-room={room.id}
      data-coordinate={coordinate(room.room)}
      aria-labelledby={`${room.domId}-heading`}
      style={holdHeight ? { minHeight: `${holdHeight * 100}vh` } : undefined}
      className={cn("relative", !holdHeight && "min-h-screen", className)}
    >
      <div
        className={cn(
          held
            ? "sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden"
            : "flex min-h-screen flex-col justify-center",
          "px-5 py-24 sm:px-8",
          contentClassName,
        )}
      >
        <div className="mx-auto w-full max-w-[86rem]">{children}</div>
      </div>
    </section>
  );
}
