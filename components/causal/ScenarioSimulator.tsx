"use client";

import { useEffect, useMemo, useState } from "react";
import { CausalDiagram } from "@/components/causal/CausalDiagram";
import { EvidenceRack } from "@/components/evidence/EvidenceRack";
import { CHOKEPOINT_GRAPH, EXPORT_RESTRICTION_SCENARIO } from "@/content/scenarios";
import { propagate } from "@/lib/graph/hypergraph";
import { useReducedMotion } from "@/lib/accessibility/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   SCENARIO SIMULATOR  (§22)
   ----------------------------------------------------------------------------
   One lever, one traversal. Turning the restriction on fires the hyperedges
   whose conditions are met, in the order their conditions are met.

   What this is not, stated in the interface and not only in the small print:
   nothing is sampled, no probability is produced, and the mechanisms were
   written by hand. It demonstrates the shape of a traversal. It does not
   forecast an outcome (§46).

   Under reduced motion the waves arrive at once rather than in sequence — the
   full structure and its ordering remain readable, only the staging goes (§40).
   ========================================================================== */

const WAVE_INTERVAL_MS = 900;

export function ScenarioSimulator() {
  const scenario = EXPORT_RESTRICTION_SCENARIO;
  const graph = CHOKEPOINT_GRAPH;
  const reducedMotion = useReducedMotion();

  const [on, setOn] = useState(false);
  /** Waves the timer has released. Reset by the lever, never by an effect. */
  const [tick, setTick] = useState(0);

  const waves = useMemo(
    () => propagate(graph, [...scenario.lever.activates, "processing", "inventory"]),
    [graph, scenario.lever.activates],
  );

  useEffect(() => {
    if (!on || reducedMotion) return;
    let released = 0;
    const timer = window.setInterval(() => {
      released += 1;
      setTick(released);
      if (released >= waves.length) window.clearInterval(timer);
    }, WAVE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [on, reducedMotion, waves.length]);

  // Derived, not mirrored. Under reduced motion every wave is present at once:
  // the ordering is still readable, only the staging is gone (§40).
  const visibleWaves = !on ? 0 : reducedMotion ? waves.length : Math.min(tick, waves.length);

  const { activeNodes, activeRelations } = useMemo(() => {
    const nodes = new Set<string>();
    const relations = new Set<string>();
    if (on) {
      for (const id of scenario.lever.activates) nodes.add(id);
      nodes.add("processing");
      nodes.add("inventory");
      for (const wave of waves.slice(0, visibleWaves)) {
        for (const id of wave.relationIds) relations.add(id);
        for (const id of wave.nodeIds) nodes.add(id);
      }
    }
    return { activeNodes: nodes, activeRelations: relations };
  }, [on, scenario.lever.activates, visibleWaves, waves]);

  const reached = activeNodes.size;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-5 border border-graphite bg-ink/50 px-5 py-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => {
            setTick(0);
            setOn((value) => !value);
          }}
          className={cn(
            "flex items-center gap-3 border px-4 py-2 font-mono text-[0.72rem] tracking-[0.16em] uppercase transition-colors",
            on ? "border-rupture text-rupture" : "border-graphite text-ash hover:text-bone",
          )}
        >
          <span
            aria-hidden="true"
            className={cn("block h-2.5 w-2.5 transition-colors", on ? "bg-rupture" : "bg-graphite")}
          />
          {scenario.lever.label}: {on ? "On" : "Off"}
        </button>

        <p aria-live="polite" className="font-mono text-[0.68rem] tracking-[0.1em] text-ash">
          {on
            ? `Wave ${Math.min(visibleWaves, waves.length)} of ${waves.length} · ${reached} nodes reached`
            : "Structure present, inert"}
        </p>
      </div>

      <p className="mt-4 max-w-[62ch] text-[0.88rem] leading-relaxed text-bone/80">
        {on ? scenario.lever.onCaption : scenario.lever.offCaption}
      </p>

      <div className="mt-8">
        <CausalDiagram
          graph={graph}
          activeNodeIds={on ? activeNodes : new Set()}
          activeRelationIds={on ? activeRelations : new Set()}
        />
      </div>

      <ol className="mt-8 space-y-3">
        {waves.map((wave, index) => {
          const shown = on && index < visibleWaves;
          return (
            <li
              key={wave.order}
              className={cn(
                "border-l pl-4 transition-colors duration-500",
                shown ? "border-signal" : "border-graphite",
              )}
            >
              {/* State is carried by colour rather than by opacity: a wave that
                  has not fired yet must still be readable (§42). */}
              <p
                className={cn(
                  "font-mono text-[0.68rem] tracking-[0.14em] uppercase transition-colors duration-500",
                  shown ? "text-brass" : "text-ash",
                )}
              >
                Order {wave.order}
              </p>
              <p
                className={cn(
                  "mt-1 text-[0.86rem] leading-relaxed transition-colors duration-500",
                  shown ? "text-bone/85" : "text-ash",
                )}
              >
                {wave.relationIds
                  .map((id) => graph.relations.find((relation) => relation.id === id)?.mechanism)
                  .filter(Boolean)
                  .join(" ")}
              </p>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 border border-rupture/40 bg-rupture/5 px-4 py-3 font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-rupture">
        {scenario.disclaimer}
      </p>

      <EvidenceRack
        className="mt-8"
        label="Evidence beneath this structure"
        evidenceIds={[
          "mofcom-rare-earth-controls",
          "usgs-rare-earth-concentration",
          "alixpartners-auto-chip",
        ]}
      />
    </div>
  );
}
