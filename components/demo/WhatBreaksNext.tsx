"use client";

import { useState } from "react";

import { demoScenarios } from "@/data/scenarios";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { ClaimClassChip } from "@/components/evidence/ClaimClassChip";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   "WHAT BREAKS NEXT?" (§18)
   ----------------------------------------------------------------------------
   An illustrative scenario walk-through, structured exactly as the brief
   specifies:

     what changed → where it propagates → affected systems → second-order
     → third-order → what to monitor → possible intervention points

   The label is not a disclaimer tucked underneath. It is placed above the
   output, in the same visual weight as the output, because a reader who takes
   this for live model output has been misled regardless of what the small print
   says.

   There are no probability values anywhere in this component, and there is no
   code path that could introduce one.
   ========================================================================== */

export function WhatBreaksNext() {
  const [activeId, setActiveId] = useState(demoScenarios[0]!.id);
  const active = demoScenarios.find((scenario) => scenario.id === activeId)!;

  return (
    <div className="border border-[color:var(--hairline)]">
      {/* The label, above the output and impossible to scroll past. */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--hairline)] bg-substrate px-6 py-4 sm:px-8">
        <ClaimClassChip claimClass="illustrative-scenario" />
        <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-dim-bone uppercase">
          Not live model output · no probabilities
        </p>
      </div>

      <div className="px-6 py-10 sm:px-8 sm:py-12">
        <fieldset>
          <legend className="u-instrument">Select a condition to change</legend>
          <div className="mt-5 flex flex-wrap gap-2">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setActiveId(scenario.id)}
                aria-pressed={scenario.id === activeId}
                className={cn(
                  "border px-4 py-2.5 text-left font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors",
                  scenario.id === activeId
                    ? "border-gold text-gold"
                    : "border-[color:var(--hairline)] text-muted-bone hover:border-bone hover:text-bone",
                )}
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* aria-live so a screen reader user hears that the output changed when
            they pick a different condition. */}
        <div className="mt-14 space-y-12" aria-live="polite">
          <Block label="What changed" tone="gold">
            <p className="text-[1.0625rem] leading-relaxed text-bone u-measure">
              {active.change}
            </p>
          </Block>

          <Block label="Where it propagates">
            <ol className="space-y-3">
              {active.propagation.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <InstrumentLabel className="mt-1 shrink-0 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </InstrumentLabel>
                  <span className="u-body">{step}</span>
                </li>
              ))}
            </ol>
          </Block>

          <Block label="Affected systems">
            <ul className="flex flex-wrap gap-2">
              {active.affected.map((system) => (
                <li
                  key={system}
                  className="border border-[color:var(--hairline)] px-3 py-2 font-mono text-[0.625rem] tracking-[0.12em] text-muted-bone uppercase"
                >
                  {system}
                </li>
              ))}
            </ul>
          </Block>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Block label="Second-order effects">
              <OrderList items={active.secondOrder} order={2} />
            </Block>
            <Block label="Third-order effects">
              <OrderList items={active.thirdOrder} order={3} />
            </Block>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Block label="What to monitor" tone="steel">
              <ul className="space-y-3">
                {active.monitor.map((item) => (
                  <li key={item} className="u-body flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-steel" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block label="Possible intervention points" tone="gold">
              <ul className="space-y-3">
                {active.interventions.map((item) => (
                  <li key={item} className="u-body flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold-dim" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <div className="border-t border-[color:var(--hairline)] pt-8">
            <EvidenceInspector
              ids={active.evidenceIds}
              label="Mechanisms in this trace are drawn from"
            />
            <p className="u-body mt-5 u-measure">
              The mechanisms above are sourced. Their arrangement into this particular path is
              explanatory — it shows the shape of an answer a scoped causal model would produce,
              not a finding about any organisation or a claim that this path is currently
              active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({
  label,
  children,
  tone = "dim",
}: {
  label: string;
  children: React.ReactNode;
  tone?: "dim" | "gold" | "steel";
}) {
  return (
    <section>
      <InstrumentLabel as="h3" tone={tone}>
        {label}
      </InstrumentLabel>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function OrderList({ items, order }: { items: string[]; order: 2 | 3 }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
          <InstrumentLabel className="tabular-nums" tone={order === 3 ? "rupture" : "dim"}>
            {order}°
          </InstrumentLabel>
          <span className="u-body">{item}</span>
        </li>
      ))}
    </ul>
  );
}
