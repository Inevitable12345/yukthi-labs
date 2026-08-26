"use client";

import { useState } from "react";

import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { IllustrativeBadge } from "@/components/evidence/IllustrativeBadge";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { scenarios } from "@/data/scenarios";
import { ORDER_LABEL } from "@/lib/graph/tokens";
import { track } from "@/lib/analytics/analytics";
import { announceScope } from "@/lib/world/use-scene-progress";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   THE 3 A.M. PROBLEM
   ----------------------------------------------------------------------------
   A decision frame, not a set of persona cards.

   Choosing a scope is the first act of the system itself — structure is scoped
   before it is mapped — so the interface makes the reader perform that act before
   any causal content appears.
   ========================================================================== */

export function ScenarioSelector({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState(scenarios[0]!.id);
  const active = scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0]!;

  return (
    <div
      className={cn(
        "relative border border-[color:var(--hairline)] bg-[color:var(--color-deep-field)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="u-graticule pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* scope selector */}
        <div className="border-b border-[color:var(--hairline)] lg:border-r lg:border-b-0">
          <div className="px-6 pt-6 pb-4">
            <InstrumentLabel tone="gold">Select decision scope</InstrumentLabel>
          </div>
          <div role="tablist" aria-label="Decision scope" className="flex flex-wrap lg:block">
            {scenarios.map((scenario, index) => {
              const isActive = scenario.id === activeId;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  role="tab"
                  id={`scope-tab-${scenario.id}`}
                  aria-selected={isActive}
                  aria-controls={`scope-panel-${scenario.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    setActiveId(scenario.id);
                    // The world layer behind the page rebuilds around the chosen
                    // scope. It listens rather than being driven, so this control
                    // works identically with the layer absent.
                    announceScope(scenario.id);
                    track("scenario_select", { scope: scenario.id });
                  }}
                  onKeyDown={(event) => {
                    const currentIndex = scenarios.findIndex((item) => item.id === activeId);
                    let nextIndex: number | null = null;
                    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                      nextIndex = (currentIndex + 1) % scenarios.length;
                    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                      nextIndex = (currentIndex - 1 + scenarios.length) % scenarios.length;
                    }
                    if (nextIndex !== null) {
                      event.preventDefault();
                      const next = scenarios[nextIndex]!;
                      setActiveId(next.id);
                      announceScope(next.id);
                      document.getElementById(`scope-tab-${next.id}`)?.focus();
                    }
                  }}
                  className={cn(
                    "flex min-h-12 flex-1 items-center gap-3 border-t border-[color:var(--hairline)] px-6 py-3 text-left transition-colors duration-300 lg:w-full lg:flex-none",
                    index === 0 ? "border-t-0 lg:border-t" : "",
                    isActive ? "bg-void text-gold" : "text-muted-bone hover:text-bone",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-1 w-1 shrink-0 transition-colors",
                      isActive ? "bg-gold" : "bg-[color:var(--color-dim-bone)]",
                    )}
                  />
                  <span className="font-mono text-[0.625rem] tracking-[0.18em] uppercase">
                    {scenario.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* the frame */}
        <div
          role="tabpanel"
          id={`scope-panel-${active.id}`}
          aria-labelledby={`scope-tab-${active.id}`}
          className="p-6 sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <InstrumentLabel tone="steel">{active.role}</InstrumentLabel>
            <IllustrativeBadge label="Illustrative causal trace" />
          </div>

          <blockquote className="mt-8">
            <p className="u-display-3 max-w-3xl text-bone">{active.question}</p>
          </blockquote>

          <div className="mt-10 border-l border-[color:var(--color-rupture-deep)] pl-5">
            <InstrumentLabel as="p" tone="rupture">
              The assumption that would have to break
            </InstrumentLabel>
            <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-muted-bone">
              {active.assumption}
            </p>
          </div>

          <ol className="mt-10 grid gap-px bg-[color:var(--hairline)] sm:grid-cols-3">
            {active.trace.map((step) => (
              <li key={step.label} className="bg-deep-field p-5">
                <InstrumentLabel>
                  {ORDER_LABEL[step.order]} ·{" "}
                  {step.order === 1
                    ? "direct"
                    : step.order === 2
                      ? "second order"
                      : "third order"}
                </InstrumentLabel>
                <h3 className="mt-3 text-[0.9375rem] leading-snug text-bone">{step.label}</h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-bone">
                  {step.mechanism}
                </p>
              </li>
            ))}
          </ol>

          {active.evidenceIds?.length ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              <InstrumentLabel>Evidence</InstrumentLabel>
              {active.evidenceIds.map((id) => (
                <EvidenceMarker key={id} id={id} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
