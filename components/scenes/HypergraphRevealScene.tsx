"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

import { ScrollTrigger } from "@/lib/story/gsap";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { usePrefersReducedMotion } from "@/lib/utils/use-capability";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ClaimClassChip } from "@/components/evidence/ClaimClassChip";
import { SITE } from "@/lib/metadata/site";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   ACT IX — THE YUKTHI REVEAL (§15)
   ----------------------------------------------------------------------------
   Only now is Yukthi fully revealed — after the problem has been established,
   not before it.

   The eleven-step transformation is narrated here in the DOM while the
   persistent world behind the page performs it in geometry. The two are driven
   by the same story state, so they cannot drift apart.

   The realisation this act exists to produce, stated plainly at the end: the
   system moves from a map of *where things are* to a model of *why things
   happen, how they interact, and where change can propagate*.
   ========================================================================== */

const TRANSFORMATION = [
  "The globe shell fades.",
  "Geographic nodes remain.",
  "Nodes detach from geography.",
  "Nodes reorganise by causal relation.",
  "Pairwise edges emerge.",
  "Many-to-many hyperedges emerge.",
  "Evidence attaches.",
  "Mechanisms appear.",
  "Uncertainty appears.",
  "Second-order effects unfold.",
  "Third-order effects unfold.",
];

export function HypergraphRevealScene() {
  const chapterRef = useChapterProgress("yukthi");
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const element = container.current;
      if (!element || reducedMotion) return;

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: () => `+=${TRANSFORMATION.length * 34}%`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setStep(
            Math.min(
              TRANSFORMATION.length - 1,
              Math.floor(self.progress * TRANSFORMATION.length),
            ),
          );
        },
      });

      return () => trigger.kill();
    },
    { scope: container, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={chapterRef as React.RefObject<HTMLElement>}
      id="yukthi"
      aria-labelledby="yukthi-heading"
      className="relative border-t border-[color:var(--hairline)]"
    >
      <div
        ref={container}
        className={cn(
          "u-gutter flex min-h-screen flex-col justify-center py-24 lg:pl-[calc(var(--gutter)+var(--rail-width))]",
          reducedMotion && "min-h-0",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
          <InstrumentLabel tone="gold" className="tabular-nums">
            08
          </InstrumentLabel>
          <InstrumentLabel>The bet</InstrumentLabel>
        </div>

        <h2 id="yukthi-heading" className="u-display-2 mt-8 max-w-[20ch] text-bone">
          Yukthi is building a {SITE.bet}.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
          <div>
            <InstrumentLabel as="h3">The transformation</InstrumentLabel>

            {/* Every step is always in the DOM. Emphasis moves; content does not
                appear or disappear. */}
            <ol className="mt-8 space-y-0" aria-live="polite">
              {TRANSFORMATION.map((line, index) => {
                const active = reducedMotion || index <= step;
                const current = !reducedMotion && index === step;

                return (
                  <li
                    key={line}
                    className={cn(
                      "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-l py-3 pl-5 transition-all duration-500",
                      current
                        ? "border-gold"
                        : active
                          ? "border-[color:var(--hairline-strong)]"
                          : "border-[color:var(--hairline)]",
                    )}
                  >
                    <InstrumentLabel tone={current ? "gold" : "dim"} className="tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </InstrumentLabel>
                    <span
                      className={cn(
                        "text-[0.9375rem] transition-colors duration-500",
                        current ? "text-bone" : active ? "text-muted-bone" : "text-dim-bone",
                      )}
                    >
                      {line}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="space-y-10">
            <div className="border-l-2 border-gold-dim pl-6">
              <p className="font-display text-[1.75rem] leading-snug font-light text-bone">
                The system moves from a map of <em>where things are</em> to a model of{" "}
                <em>why things happen, how they interact, and where change can propagate</em>.
              </p>
            </div>

            <div>
              <InstrumentLabel as="h3" tone="steel">
                Why a hypergraph
              </InstrumentLabel>
              <p className="u-body mt-4">
                Because the situations that matter are conjunctive. Cold weather <em>and</em>{" "}
                unwinterised equipment <em>and</em> gas-fired generation share produce an
                outage. Decomposing that into three arrows loses the conjunction — and the
                conjunction is the mechanism.
              </p>
              <p className="u-body mt-4">
                A hyperedge connects a <em>set</em> of causes to a <em>set</em> of effects.
                Pairwise edges are the degenerate case, not the primitive.
              </p>
            </div>

            <div>
              <InstrumentLabel as="h3" tone="steel">
                Why scoped
              </InstrumentLabel>
              <p className="u-body mt-4">
                Because modelling the entire planet is neither possible nor necessary. A
                consequential decision defines which entities matter, which relations are worth
                representing, and how deep the trace must run before the answer stops changing.
                Scope is what makes the model tractable and the claim honest.
              </p>
            </div>

            <div className="border-t border-[color:var(--hairline)] pt-8">
              <ClaimClassChip claimClass="product-ambition" />
              <p className="u-body mt-5">
                This describes what Yukthi is building. It is not a description of a deployed
                system, and nothing on this site is output from one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
