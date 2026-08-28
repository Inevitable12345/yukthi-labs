"use client";

import { ROOMS } from "@/lib/story/chapters";
import { useStory } from "@/lib/story/use-story";
import { cn } from "@/lib/utils/cn";

/**
 * The room index (§29): a column of ticks down the right edge, each an anchor
 * into its room. Navigation is a plain in-page link, which means the browser's
 * own smooth scrolling carries the transition and the URL stays meaningful.
 */
export function RoomIndex() {
  const { chapter } = useStory();
  const numbered = ROOMS.filter((room) => room.room !== null);

  return (
    <nav
      aria-label="Exhibition rooms"
      data-print-hidden="true"
      className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="space-y-[7px]">
        {numbered.map((room) => {
          const active = room.id === chapter;
          return (
            <li key={room.id}>
              <a
                href={`#${room.domId}`}
                aria-current={active ? "true" : undefined}
                className="group flex items-center justify-end gap-2.5 focus-visible:outline-offset-4"
              >
                <span
                  className={cn(
                    // The label sits over the page, so it carries its own
                    // ground rather than colliding with whatever is beneath it.
                    "bg-void/88 px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.12em] whitespace-nowrap transition-opacity duration-300",
                    active
                      ? "text-brass opacity-100"
                      : "text-ash opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {room.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-px transition-all duration-500",
                    active ? "w-7 bg-brass" : "w-3 bg-graphite group-hover:w-5 group-hover:bg-ash",
                  )}
                />
                <span className="sr-only">
                  Room {room.room}, {room.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
