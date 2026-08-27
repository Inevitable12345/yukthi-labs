"use client";

import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import {
  CHAPTER_BY_ID,
  railNumeral,
  type StoryChapter as ChapterId,
} from "@/lib/story/chapters";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   ONE CHAPTER
   ----------------------------------------------------------------------------
   The rhythm is fixed — coordinate, statement, space, structure — so the reader
   learns the shape of the argument once and then follows it without effort.

   The section registers itself with the story store, which is what drives the
   world and the rail. It is a plain `<section>` with a real heading: the chapter
   is complete and readable as static HTML before any script runs.
   ========================================================================== */

export function StoryChapterSection({
  chapter,
  eyebrow,
  headline,
  lede,
  children,
  className,
  headlineClassName,
  wide = false,
}: {
  chapter: ChapterId;
  eyebrow?: string;
  headline: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headlineClassName?: string;
  /** Lets a chapter's figure use the full width rather than the reading measure. */
  wide?: boolean;
}) {
  const ref = useChapterProgress(chapter);
  const definition = CHAPTER_BY_ID[chapter];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={definition.domId}
      aria-labelledby={`${definition.domId}-heading`}
      className={cn(
        "u-gutter relative scroll-mt-24 border-t border-[color:var(--hairline)] py-24 sm:py-32 lg:pl-[calc(var(--gutter)+var(--rail-width))]",
        className,
      )}
    >
      <div className={cn("relative", wide ? "" : "")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
          <InstrumentLabel className="shrink-0 tabular-nums" tone="gold">
            {railNumeral(definition.index)}
          </InstrumentLabel>
          {eyebrow ? <InstrumentLabel className="shrink-0">{eyebrow}</InstrumentLabel> : null}
        </div>

        <h2
          id={`${definition.domId}-heading`}
          className={cn("u-display-2 mt-8 max-w-[18ch] text-bone", headlineClassName)}
        >
          {headline}
        </h2>

        {lede ? <div className="u-lede u-measure mt-8">{lede}</div> : null}

        {children ? <div className="mt-16 sm:mt-20">{children}</div> : null}
      </div>
    </section>
  );
}
