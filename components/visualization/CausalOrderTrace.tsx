"use client";

import { useState } from "react";

import { IllustrativeBadge } from "@/components/evidence/IllustrativeBadge";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ORDER_LABEL } from "@/lib/graph/tokens";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   SECOND- AND THIRD-ORDER CONSEQUENCES
   ----------------------------------------------------------------------------
   Causal distance is encoded by a printed degree and by the colour of the rule
   beneath each step. It is deliberately *not* encoded by dimming the panel: doing
   that pushed the small type below the WCAG AA contrast floor, and an encoding
   that costs a reader the text is not an encoding worth having.

   Illustrative: this is the shape of a consequence chain, not a claim that this
   particular chain is running anywhere.
   ========================================================================== */

type Step = { order: 1 | 2 | 3; label: string; mechanism: string };

const FIRST_TRACE: Step[] = [
  {
    order: 1,
    label: "Tariff",
    mechanism: "An import duty is imposed on a category of goods.",
  },
  {
    order: 1,
    label: "Input price",
    mechanism: "Landed cost rises for every firm that uses the good as an input.",
  },
  {
    order: 2,
    label: "Margin pressure",
    mechanism:
      "Firms that cannot pass the cost through absorb it. Which firms those are depends on contract structure, not on the tariff.",
  },
  {
    order: 3,
    label: "Capex response",
    mechanism:
      "Investment plans are revised — deferred, relocated, or brought forward to beat the next measure.",
  },
];

const EXTENSION: Step[] = [
  {
    order: 1,
    label: "Capex response",
    mechanism: "The previous chain's third-order effect becomes the new origin.",
  },
  {
    order: 1,
    label: "Capacity",
    mechanism: "Capacity arrives, or fails to arrive, two to four years after the decision.",
  },
  {
    order: 2,
    label: "Supply",
    mechanism:
      "Available volume in the later period is set by the earlier investment decision.",
  },
  {
    order: 3,
    label: "Market price",
    mechanism:
      "Price in the later period is shaped by a policy taken years before, through a path nobody was tracking.",
  },
];

export function CausalOrderTrace({ className }: { className?: string }) {
  const [extended, setExtended] = useState(false);
  const steps = extended ? EXTENSION : FIRST_TRACE;

  return (
    <div className={cn("relative", className)}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <InstrumentLabel tone="steel">
          {extended
            ? "Trace · continued from the third-order effect"
            : "Trace · from a single policy action"}
        </InstrumentLabel>
        <IllustrativeBadge />
      </div>

      <ol className="grid gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="relative bg-void p-6">
            <div className="flex items-baseline justify-between gap-3">
              <InstrumentLabel tone={index === 0 ? "gold" : "dim"}>
                {index === 0
                  ? "Origin"
                  : `${ORDER_LABEL[step.order]} · ${degreeWord(step.order)}`}
              </InstrumentLabel>
              <span
                aria-hidden="true"
                className="font-mono text-[0.625rem] text-dim-bone tabular-nums"
              >
                {String(index).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 text-[1.0625rem] leading-tight text-bone">{step.label}</h3>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-bone">
              {step.mechanism}
            </p>
            <div
              aria-hidden="true"
              className="absolute right-0 bottom-0 left-0 h-px"
              style={{
                background:
                  index === 0
                    ? "var(--color-gold)"
                    : step.order === 1
                      ? "var(--color-steel)"
                      : step.order === 2
                        ? "var(--color-steel-dim)"
                        : "var(--color-dim-bone)",
                opacity: index === 0 ? 0.9 : 0.7,
              }}
            />
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
        <button
          type="button"
          onClick={() => setExtended((previous) => !previous)}
          className="group inline-flex min-h-11 items-baseline gap-3 border-b border-[color:var(--hairline-strong)] pb-1 font-mono text-[0.625rem] tracking-[0.2em] text-bone uppercase transition-colors hover:border-gold hover:text-gold"
        >
          {extended ? "Return to the origin" : "Expand the third-order effect"}
          <span
            aria-hidden="true"
            className="text-gold transition-transform duration-500 group-hover:translate-x-1"
          >
            {extended ? "↺" : "→"}
          </span>
        </button>
        <p className="max-w-md text-[0.8125rem] leading-relaxed text-dim-bone">
          Every third-order effect is another chain&rsquo;s origin. This is why a consequence
          view has to be walkable rather than fixed at three steps.
        </p>
      </div>
    </div>
  );
}

function degreeWord(order: 1 | 2 | 3): string {
  return order === 1 ? "direct" : order === 2 ? "second order" : "third order";
}
