"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { Chapter } from "@/lib/story/chapters";
import { ROOMS } from "@/lib/story/chapters";
import { setChapter, setOverall, setProgress } from "@/lib/story/store";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ============================================================================
   SCROLL DRIVER  (§31)
   ----------------------------------------------------------------------------
   ScrollTrigger's only job here is to write two numbers into the story store:
   which room holds the viewport, and how far through it the visitor is. Nothing
   is animated from this file.

   That indirection is what makes the DOM and the WebGL scene consume identical
   state, and what makes reverse scroll work without a second code path — the
   store holds a position, not a playhead, so there is no direction to reverse.

   Rooms are held in place with CSS `position: sticky` rather than with
   ScrollTrigger's pin. Sticky does not clone or re-parent the element, so focus
   order, anchor links and the accessibility tree stay exactly as authored.
   ========================================================================== */

export function ScrollDriver() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const triggers: ScrollTrigger[] = [];

      for (const room of ROOMS) {
        const element = document.getElementById(room.domId);
        if (!element) continue;

        triggers.push(
          ScrollTrigger.create({
            trigger: element,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (self.isActive) setChapter(room.id as Chapter);
            },
          }),
        );

        // Progress spans the whole traversal of the room, not just the window
        // in which it is "current", so a held room scrubs across its full hold.
        triggers.push(
          ScrollTrigger.create({
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => setProgress(room.id as Chapter, self.progress),
          }),
        );
      }

      triggers.push(
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => setOverall(self.progress),
        }),
      );

      // Late-loading fonts and the world canvas both change layout height.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);

      return () => {
        window.removeEventListener("load", refresh);
        for (const trigger of triggers) trigger.kill();
      };
    },
    { scope },
  );

  return <div ref={scope} aria-hidden="true" />;
}
