"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { gsap } from "@/lib/story/gsap";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { usePrefersReducedMotion } from "@/lib/utils/use-capability";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/* ============================================================================
   ACT II — RUPTURE (§8)
   ----------------------------------------------------------------------------
   The world is not exploded. It is rewired.

   That distinction is the content of this act: an explosion would say the system
   was destroyed, when what actually happened is that it was *rearranged* and
   kept running. The five stages below are a progression in one property —
   whether economic connection is a matter of efficiency or of strategy.
   ========================================================================== */

const STAGES = [
  {
    label: "Globalisation",
    detail: "Connection organised by comparative advantage. Cost is the criterion.",
  },
  {
    label: "Strategic interdependence",
    detail: "The same connections are recognised as dependencies. Nothing physical changes.",
  },
  {
    label: "Friend-shoring and industrial policy",
    detail:
      "Connection is re-formed by political alignment. Cost becomes one criterion among several.",
  },
  {
    label: "Multipolar competition",
    detail: "Blocs consolidate. Trade grows faster within them than between them.",
  },
  {
    label: "Networks as leverage",
    detail:
      "Economic connection becomes an instrument. The network is now something to be used.",
  },
];

export function RuptureScene() {
  const chapterRef = useChapterProgress("rupture");
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      // A scrubbed reveal of stages that are already present. The timeline
      // animates children of the trigger, never the section itself.
      gsap.from("[data-rupture-stage]", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 72%",
          end: "bottom 62%",
          scrub: 0.8,
        },
        // No opacity in this reveal. Any value low enough to read as a fade
        // takes this type below AA contrast, and a reveal that renders its own
        // text unreadable while it is on screen is a reveal that failed. The
        // sequential arrival is carried entirely by the horizontal offset.
        x: -18,
        stagger: 0.35,
        ease: "none",
      });
    },
    { scope: container, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={chapterRef as React.RefObject<HTMLElement>}
      id="rupture"
      aria-labelledby="rupture-heading"
      className="u-gutter relative scroll-mt-24 border-t border-[color:var(--hairline)] py-24 sm:py-32 lg:pl-[calc(var(--gutter)+var(--rail-width))]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
        <InstrumentLabel tone="gold" className="tabular-nums">
          02
        </InstrumentLabel>
        <InstrumentLabel>The rupture</InstrumentLabel>
      </div>

      <h2 id="rupture-heading" className="u-display-2 mt-8 max-w-[20ch] text-bone">
        The world did not simply become noisier. Its structure began to change.
      </h2>

      <p className="u-lede u-measure mt-8">
        Noise is a property of a system whose structure holds. What happened instead was a
        rewiring: the same nodes, connected differently, for different reasons. Trade did not
        stop. It reorganised — and a model fitted to the old arrangement has no way to notice.
      </p>

      <div
        ref={container}
        className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24"
      >
        <ol className="space-y-0">
          {STAGES.map((stage, index) => (
            <li
              key={stage.label}
              data-rupture-stage
              className="border-l border-[color:var(--hairline)] py-6 pl-6"
            >
              <div className="flex items-baseline gap-4">
                <InstrumentLabel tone="steel" className="tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </InstrumentLabel>
                <h3 className="font-display text-[1.5rem] leading-tight font-light text-bone">
                  {stage.label}
                </h3>
              </div>
              <p className="u-body mt-2">{stage.detail}</p>
            </li>
          ))}
        </ol>

        <div className="space-y-10">
          <p className="u-body u-measure">
            The measurable form of this is visible in the trade data. WTO staff find trade
            growth between geopolitical blocs slowing relative to growth within them — and are
            careful to say that reorganisation visible in the data is not the same thing as
            fragmentation as a completed state. This site keeps that distinction.
          </p>

          <p className="u-body u-measure">
            The cost is not hypothetical either. IMF staff put long-run output losses from
            fragmentation between roughly 0.2% and nearly 7% of global GDP depending on how deep
            it runs; independent WTO simulation work puts full decoupling into two blocs at
            around 5%. Two different modelling traditions, the same order of magnitude.
          </p>

          <p className="u-body u-measure">
            And it is recognised by the people it affects: geoeconomic confrontation is ranked
            the risk most likely to trigger a material global crisis in the coming year. That
            expectation is not merely a reading of the system — it is one of the forces
            reshaping it.
          </p>

          <EvidenceInspector ids={["E-001", "E-002", "E-003", "E-004"]} />
        </div>
      </div>
    </section>
  );
}
