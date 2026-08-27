"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { ScrollTrigger, gsap } from "./gsap";
import { storyStore } from "./store";
import type { StoryChapter } from "./chapters";

/* ============================================================================
   CHAPTER → STORY STATE (§6, §27)
   ----------------------------------------------------------------------------
   Attaches one ScrollTrigger to a chapter section and reports normalised
   progress into the story store.

   Engineering rules this hook exists to enforce in one place:
     · one trigger per chapter, created inside a `useGSAP` scope so that its
       revert() removes the trigger on unmount and on every hot reload;
     · `scrub`-style continuous reporting via onUpdate, never a tween on the
       pinned wrapper itself;
     · progress is read from the trigger rather than accumulated, so reverse
       scrolling reconstructs the identical value.
   ========================================================================== */

export function useChapterProgress(chapter: StoryChapter) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const report = (self: ScrollTrigger) => {
        // `isActive` is true only while the section spans the trigger band, so a
        // chapter scrolling away cannot claim the current-chapter slot from the
        // one arriving beneath it.
        storyStore.setChapterProgress(chapter, self.progress, self.isActive);
      };

      const trigger = ScrollTrigger.create({
        trigger: element,
        // The chapter owns the story state from the moment its top reaches the
        // lower third of the viewport until its bottom leaves the upper third.
        start: "top 66%",
        end: "bottom 33%",
        onUpdate: report,
        onToggle: report,
      });

      // Report once on creation so a reload deep in the page starts correct
      // rather than waiting for the first scroll event.
      storyStore.setChapterProgress(chapter, trigger.progress, trigger.isActive);

      return () => {
        trigger.kill();
      };
    },
    { scope: ref, dependencies: [chapter] },
  );

  return ref;
}

/**
 * A scrubbed timeline pinned to a section (§6).
 *
 * `build` receives a timeline whose playhead is driven by scroll position. It
 * must animate children — never the pinned wrapper — and must not create its own
 * ScrollTriggers.
 */
export function usePinnedTimeline(
  build: (timeline: gsap.core.Timeline) => void,
  options: { enabled?: boolean; endDistance?: string; anticipatePin?: boolean } = {},
) {
  const { enabled = true, endDistance = "+=140%", anticipatePin = true } = options;
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !enabled) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: endDistance,
          scrub: 0.6,
          pin: true,
          // Pinning without this causes a one-frame jump on fast scroll as the
          // pin spacer is inserted.
          anticipatePin: anticipatePin ? 1 : 0,
          invalidateOnRefresh: true,
        },
      });

      build(timeline);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: ref, dependencies: [enabled] },
  );

  return ref;
}
