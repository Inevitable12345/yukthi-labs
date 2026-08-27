"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { gsap } from "@/lib/story/gsap";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { usePrefersReducedMotion } from "@/lib/utils/use-capability";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/* ============================================================================
   ACT VIII — WHY AI MAKES THIS PLAUSIBLE (§14)
   ----------------------------------------------------------------------------
   No chatbot. No assistant. The claim is narrow and the evidence is handled
   carefully, because overstating it here would undermine everything else on the
   site.

   What the evidence supports: machine forecasting has crossed a human *crowd*
   baseline and has not crossed an *expert* one. That is enough to make a new
   analytical architecture plausible. It is not enough to claim uncertainty has
   been eliminated, and this act says so explicitly.
   ========================================================================== */

const PIPELINE = [
  { step: "Search", detail: "Retrieve what has been published, continuously, across sources." },
  {
    step: "Resolve",
    detail: "Identify which entities and relations a document actually concerns.",
  },
  {
    step: "Synthesize",
    detail: "Reconcile sources that disagree, keeping the disagreement visible.",
  },
  { step: "Reason", detail: "Work out what follows, given the structure and the evidence." },
  { step: "Forecast", detail: "Produce a probabilistic view along causal paths." },
  {
    step: "Calibrate",
    detail: "Score against outcomes. Calibration is measured, not asserted.",
  },
  { step: "Update", detail: "Revise as new evidence lands. The loop never terminates." },
];

export function AIReasoningScene() {
  const chapterRef = useChapterProgress("ai");
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.from("[data-pipeline-step]", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 74%",
          end: "bottom 68%",
          scrub: 0.7,
        },
        // See RuptureScene: the arrival is carried by offset, never by an
        // opacity low enough to fail contrast.
        y: 12,
        stagger: 0.25,
        ease: "none",
      });
    },
    { scope: container, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={chapterRef as React.RefObject<HTMLElement>}
      id="ai"
      aria-labelledby="ai-heading"
      className="u-gutter relative scroll-mt-24 border-t border-[color:var(--hairline)] py-24 sm:py-32 lg:pl-[calc(var(--gutter)+var(--rail-width))]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
        <InstrumentLabel tone="gold" className="tabular-nums">
          07
        </InstrumentLabel>
        <InstrumentLabel>Why now</InstrumentLabel>
      </div>

      <h2 id="ai-heading" className="u-display-2 mt-8 max-w-[22ch] text-bone">
        AI has made a new analytical architecture plausible. It has not eliminated uncertainty.
      </h2>

      <p className="u-lede u-measure mt-8">
        The evidence for what machine forecasting can now do is real, recent, and narrower than
        the claims usually made about it. Both halves of that sentence matter.
      </p>

      <div
        ref={container}
        className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24"
      >
        <div>
          <InstrumentLabel as="h3">The pipeline that now runs end to end</InstrumentLabel>

          <ol className="mt-8">
            {PIPELINE.map((item, index) => (
              <li
                key={item.step}
                data-pipeline-step
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-[color:var(--hairline)] py-5"
              >
                <InstrumentLabel tone="steel" className="tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </InstrumentLabel>
                <div>
                  <h4 className="font-mono text-[0.75rem] tracking-[0.16em] text-bone uppercase">
                    {item.step}
                  </h4>
                  <p className="u-body mt-1.5">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-10">
          <div>
            <InstrumentLabel as="h3" tone="steel">
              What the evidence actually establishes
            </InstrumentLabel>
            <p className="u-body mt-4">
              An ensemble of twelve language models forecasting across a three-month tournament
              was statistically indistinguishable from a crowd of 925 human forecasters. A
              retrieval-augmented system that searches news, summarises it and produces
              calibrated probabilities approaches aggregated crowd accuracy. Frontier models
              have since surpassed a general crowd baseline — one reaching a Brier score of
              0.1352 against a crowd baseline of 0.149.
            </p>
          </div>

          <div className="border-l-2 border-rupture-deep pl-6">
            <InstrumentLabel as="h3" tone="rupture">
              And what it does not
            </InstrumentLabel>
            <p className="u-body mt-4">
              None of these results beats expert forecasters. The ensemble result is about
              aggregation, not about any single model. The retrieval system&rsquo;s title verb
              is &ldquo;approaching&rdquo;. The frontier-model comparison is a preprint, and
              Brier scores compare only within the same question set.
            </p>
            <p className="u-body mt-4">
              Yukthi does not claim to predict the future, and would not be able to support the
              claim if it made it.
            </p>
          </div>

          <EvidenceInspector ids={["E-015", "E-016", "E-017"]} />

          <div className="border-t border-[color:var(--hairline)] pt-8">
            <p className="font-display text-[1.75rem] leading-snug font-light text-bone">
              The missing layer is explicit causal structure.
            </p>
            <p className="u-body mt-5">
              Every system above reasons over text and produces a number. None of them holds a
              model of <em>how the world is wired</em> that persists between questions,
              accumulates evidence, and can be simulated against. That is the gap — and it is an
              architectural gap, not a capability one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
