"use client";

import { useState } from "react";

import { Act } from "./Act";
import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { semiconductorChain, semiconductorHypergraph } from "@/data/semiconductor";
import { cn } from "@/lib/utils/cn";

/* ACT 06 — THE LINEAR MODEL FAILS
   Two representations of one episode, switched by the reader. The switch is the
   argument: the same facts, held in a structure that can or cannot contain them. */
export function LinearModelFailure() {
  const [view, setView] = useState<"chain" | "hypergraph">("chain");

  return (
    <Act
      id="linear-failure"
      index="Act 06"
      eyebrow="Representation"
      headline="Reality is not a chain."
      lede={
        <>
          Most supply-chain systems hold a line: supplier, component, vehicle. In 2020 and 2021
          at least seven conditions — a pandemic demand shift, foundry concentration, a
          Malaysian lockdown, a Texas winter storm, a fab fire, a demand surge and logistics
          congestion — converged on one shared input. A line has nowhere to put that.
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <InstrumentLabel>Representation</InstrumentLabel>
        <div role="group" aria-label="Choose representation" className="flex flex-wrap gap-6">
          <ViewToggle active={view === "chain"} onClick={() => setView("chain")}>
            The chain
          </ViewToggle>
          <ViewToggle active={view === "hypergraph"} onClick={() => setView("hypergraph")}>
            The hypergraph
          </ViewToggle>
        </div>
      </div>

      <div className="mt-10">
        {view === "chain" ? (
          <CausalHypergraph
            key="chain"
            graph={semiconductorChain}
            height={280}
            minWidth={620}
            caption="Three stages, two relations, one direction. Nothing in this structure can represent seven simultaneous causes acting on one input — so a model built on it will forecast the shortfall as a supplier problem."
          />
        ) : (
          <CausalHypergraph
            key="hypergraph"
            graph={semiconductorHypergraph}
            height={620}
            minWidth={1020}
            caption="Seven conditions meeting at a single junction. The junction is the claim: they acted jointly, and none of them was sufficient alone. Select it to read the mechanism and the alternative readings."
          />
        )}
      </div>

      <div className="mt-14 grid gap-12 border-t border-[color:var(--hairline)] pt-12 lg:grid-cols-2">
        <div>
          <InstrumentLabel as="h3" tone="gold">
            Why a hyperedge
          </InstrumentLabel>
          <p className="u-body mt-4">
            A pairwise edge can only say <em>A affects C</em>. To describe 2021 you need to say
            <em> A, B, D and E together produce C, and none of them does alone</em>. That
            sentence has no representation in an ordinary graph — it needs an edge that connects
            sets rather than pairs. That is a hypergraph, and it is why Yukthi&rsquo;s world
            model is built on one.
          </p>
        </div>
        <div>
          <InstrumentLabel as="h3" tone="gold">
            The tell
          </InstrumentLabel>
          <p className="u-body mt-4">
            In May 2021, AlixPartners estimated the shortage would cost vehicle manufacturers
            USD 110 billion and 3.9 million units. By September the same analysts had revised it
            to USD 210 billion and 7.7 million units. <EvidenceMarker id="E-007" /> The revision
            is the evidence: a forecast that must double mid-year was built on a structure that
            did not contain all the active pathways.
          </p>
        </div>
      </div>
    </Act>
  );
}

function ViewToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-11 border-b pb-1 font-mono text-[0.625rem] tracking-[0.18em] uppercase transition-colors",
        active
          ? "border-gold text-gold"
          : "border-transparent text-dim-bone hover:text-muted-bone",
      )}
    >
      {children}
    </button>
  );
}
