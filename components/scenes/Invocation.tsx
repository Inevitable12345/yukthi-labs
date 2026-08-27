"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { gsap } from "@/lib/story/gsap";
import { usePrefersReducedMotion } from "@/lib/utils/use-capability";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { SITE } from "@/lib/metadata/site";

/* ============================================================================
   THE OPENING (§7)
   ----------------------------------------------------------------------------
   Near-darkness. The mission first, before any explanation of what Yukthi is or
   what it sells — because the mission is the argument's premise, not its
   conclusion.

   The animation is a slow reveal of text that is already in the DOM. Nothing
   here is hidden from a crawler, a screen reader, or a reader whose JavaScript
   never arrives: the GSAP timeline animates *from* a visible state, so if it
   never runs, the opening is simply already legible.
   ========================================================================== */

export function Invocation() {
  const container = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      // `from` rather than `to`: the resting state in the DOM is the final one.
      gsap.from("[data-invocation-line]", {
        opacity: 0,
        y: 18,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.5,
        delay: 0.35,
      });

      gsap.from("[data-invocation-meta]", {
        opacity: 0,
        duration: 1.6,
        ease: "power2.out",
        delay: 2.1,
      });
    },
    { scope: container, dependencies: [reducedMotion] },
  );

  return (
    <header
      ref={container}
      className="u-gutter relative flex min-h-[92svh] flex-col justify-between py-20 lg:pl-[calc(var(--gutter)+var(--rail-width))]"
    >
      <div data-invocation-meta className="flex items-baseline justify-between gap-6">
        <InstrumentLabel tone="gold">Yukthi Lab</InstrumentLabel>
        <InstrumentLabel className="text-right">
          Causal intelligence for consequential decisions
        </InstrumentLabel>
      </div>

      <div className="max-w-[22ch]">
        <h1 data-invocation-line className="u-display-1 text-bone">
          {SITE.mission}
        </h1>

        <p data-invocation-line className="u-lede mt-12 max-w-[46ch]">
          The world&rsquo;s structure is changing faster than the models used to reason about
          it. Yukthi is building an explicit causal layer for the decisions that cannot wait for
          the historical relationship to reassert itself.
        </p>
      </div>

      <div
        data-invocation-meta
        className="flex flex-wrap items-end justify-between gap-8 border-t border-[color:var(--hairline)] pt-8"
      >
        <div className="u-measure">
          <InstrumentLabel as="p">The technical bet</InstrumentLabel>
          <p className="mt-3 font-display text-[1.375rem] leading-snug font-light text-bone">
            A {SITE.bet}
          </p>
        </div>

        <InstrumentLabel className="hidden sm:block">
          Scroll — the argument is the sequence
        </InstrumentLabel>
      </div>
    </header>
  );
}
