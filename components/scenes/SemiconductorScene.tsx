"use client";

import { useState } from "react";

import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { CausalDiagram } from "@/components/hypergraph/CausalDiagram";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { semiconductorHypergraph } from "@/data/graphs";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   ACT IV — REALITY IS NOT A CHAIN (§10)
   ----------------------------------------------------------------------------
   The first intuitive explanation of why hypergraphs matter.

   The reader is given the linear diagram first — supplier → component → vehicle
   — and invited to add the causes that were actually operating. The diagram
   becomes visibly inadequate before any argument is made about representation.
   That order matters: the inadequacy has to be felt, not asserted.

   Both views are in the DOM. The toggle changes which is shown, not which
   exists.
   ========================================================================== */

const ADDED_CAUSES = [
  "Pandemic demand shift",
  "Consumer electronics demand",
  "Order cancellations",
  "Fab concentration",
  "Assembly & test lockdowns",
  "Drought",
  "Fab fire",
  "Logistics disruption",
  "Just-in-time inventory",
];

export function SemiconductorScene() {
  const chapterRef = useChapterProgress("semiconductor");
  const [revealed, setRevealed] = useState(0);

  const complete = revealed >= ADDED_CAUSES.length;

  return (
    <section
      ref={chapterRef as React.RefObject<HTMLElement>}
      id="semiconductor"
      aria-labelledby="semiconductor-heading"
      className="u-gutter relative scroll-mt-24 border-t border-[color:var(--hairline)] py-24 sm:py-32 lg:pl-[calc(var(--gutter)+var(--rail-width))]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
        <InstrumentLabel tone="gold" className="tabular-nums">
          04
        </InstrumentLabel>
        <InstrumentLabel>The cascade</InstrumentLabel>
      </div>

      <h2 id="semiconductor-heading" className="u-display-2 mt-8 max-w-[18ch] text-bone">
        Reality is not a chain. It is an interacting causal system.
      </h2>

      <p className="u-lede u-measure mt-8">
        Here is the supply chain as it is usually drawn. Three nodes, one direction. Now add the
        things that were actually happening in 2021.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
        <div>
          {/* The linear diagram — deliberately, visibly insufficient. */}
          <figure className="m-0 min-w-0 border border-[color:var(--hairline)] p-8">
            <figcaption className="u-instrument">The chain, as usually drawn</figcaption>
            <ol className="mt-8 space-y-6">
              {["Supplier", "Component", "Vehicle"].map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full bg-bone"
                  />
                  <span className="font-mono text-[0.75rem] tracking-[0.16em] text-bone uppercase">
                    {step}
                  </span>
                  {index < 2 ? (
                    <span aria-hidden="true" className="ml-auto text-dim-bone">
                      ↓
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="mt-10 border-t border-[color:var(--hairline)] pt-6">
              <p className="u-body">Causes actually operating, added one at a time:</p>

              <ul className="mt-5 flex flex-wrap gap-2" aria-live="polite">
                {ADDED_CAUSES.slice(0, revealed).map((cause) => (
                  <li
                    key={cause}
                    className="border border-rupture-deep px-2.5 py-1.5 font-mono text-[0.5625rem] tracking-[0.12em] text-rupture uppercase"
                  >
                    {cause}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setRevealed((current) => Math.min(ADDED_CAUSES.length, current + 1))
                  }
                  disabled={complete}
                  className={cn(
                    "border px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors",
                    complete
                      ? "cursor-not-allowed border-[color:var(--hairline)] text-dim-bone"
                      : "border-[color:var(--hairline-strong)] text-bone hover:border-gold hover:text-gold",
                  )}
                >
                  {complete ? "All nine added" : "Add a cause"}
                </button>

                {revealed > 0 ? (
                  <button
                    type="button"
                    onClick={() => setRevealed(0)}
                    className="u-instrument border-b border-[color:var(--hairline-strong)] pb-1 transition-colors hover:border-bone hover:text-bone"
                  >
                    Reset
                  </button>
                ) : null}
              </div>

              {complete ? (
                <p className="mt-8 border-l-2 border-rupture pl-5 text-[0.9375rem] leading-relaxed text-bone">
                  Nine causes. Three nodes. The diagram cannot hold this, and neither can the
                  model drawn from it — not because the model is bad, but because the
                  representation has the wrong shape.
                </p>
              ) : null}
            </div>
          </figure>
        </div>

        <div>
          <CausalDiagram graph={semiconductorHypergraph} height={520} minWidth={620} />

          <div className="mt-10 border-t border-[color:var(--hairline)] pt-8">
            <p className="u-body u-measure">
              Two junctions, not eleven arrows. The demand-side causes had to occur{" "}
              <em>together</em> to reassign the queue; the supply-side shocks had to land on a
              base concentrated enough that they could not be routed around. Decomposing either
              conjunction into separate arrows loses the only thing that explains the outcome.
            </p>

            <p className="u-body u-measure mt-5">
              The evidence for this is the revision. AlixPartners forecast USD 110 billion and
              3.9 million units lost; four months later the same analysts said USD 210 billion
              and 7.7 million units. A forecast that must nearly double within a quarter is a
              forecast whose causal structure was incomplete.
            </p>

            <EvidenceInspector ids={["E-009"]} className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
