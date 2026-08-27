"use client";

import { RAIL, railNumeral } from "@/lib/story/chapters";
import { useStory } from "@/lib/story/use-story";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   THE CHAPTER RAIL (§25)
   ----------------------------------------------------------------------------
   An engraved measurement rail: eleven ticks, astronomical rather than
   navigational in feeling. It reports position in the argument and offers
   direct movement to any chapter.

   It is a real `<nav>` with real anchors, so it works without JavaScript, is
   reachable by keyboard, and gives a screen reader a sensible table of contents.
   Hidden below `lg` — on a phone it would occupy space the argument needs, and
   the same navigation is available from the header menu.
   ========================================================================== */

export function StoryProgress() {
  const story = useStory();

  const activeIndex =
    RAIL.find((entry) => entry.chapters.includes(story.chapter))?.index ?? RAIL[0]!.index;

  return (
    <nav
      aria-label="Chapters"
      className="u-no-print pointer-events-none fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 lg:block"
      style={{ width: "var(--rail-width)" }}
    >
      <ol className="pointer-events-auto flex flex-col items-center gap-0 py-2">
        {RAIL.map((entry) => {
          const active = entry.index === activeIndex;
          const passed = entry.index < activeIndex;

          return (
            <li key={entry.index} className="group relative flex items-center">
              <a
                href={`#${entry.chapters[0]}`}
                aria-current={active ? "step" : undefined}
                className="flex h-9 w-[var(--rail-width)] items-center justify-center focus-visible:outline-offset-[-4px]"
              >
                <span className="u-sr-only">
                  Chapter {railNumeral(entry.index)}: {entry.label}
                </span>

                {/* The tick. Length and brightness encode position — never colour
                    alone, so the rail is legible without colour perception. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active
                      ? "w-7 bg-gold"
                      : passed
                        ? "w-4 bg-[color:var(--hairline-strong)] group-hover:bg-bone"
                        : "w-2.5 bg-[color:var(--hairline)] group-hover:w-4 group-hover:bg-muted-bone",
                  )}
                />
              </a>

              {/* Label on hover or focus. Never permanently on screen: the rail
                  is an instrument reading, not a menu. */}
              <span
                aria-hidden="true"
                className={cn(
                  "u-instrument pointer-events-none absolute left-[var(--rail-width)] whitespace-nowrap",
                  "translate-x-2 opacity-0 transition-all duration-300",
                  "group-hover:translate-x-0 group-hover:opacity-100",
                  "group-focus-within:translate-x-0 group-focus-within:opacity-100",
                  active && "text-gold",
                )}
              >
                {railNumeral(entry.index)} {entry.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
