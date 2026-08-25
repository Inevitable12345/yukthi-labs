import { Act } from "./Act";
import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { uriLoop } from "@/data/uri";

/* ACT 08 — FEEDBACK CASCADE
   The point is not that a weather forecast was wrong. The point is that two
   physical systems were coupled, and the coupling turned a shock into a process. */
export function UriFeedbackLoop() {
  return (
    <Act
      id="feedback"
      index="Act 08"
      eyebrow="Reinforcement"
      headline="Risk compounds through feedback."
      lede={
        <>
          In February 2021, cold weather removed roughly 61,800 MW of generation across Texas
          and the South Central United States, and more than 4.5 million customers lost power.
          The weather was the trigger. What made it an emergency was the loop that formed
          afterwards. <EvidenceMarker id="E-010" />
        </>
      }
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <CausalHypergraph graph={uriLoop} height={560} minWidth={620} />

        <div>
          <InstrumentLabel as="h3" tone="rupture">
            The coupling
          </InstrumentLabel>
          <p className="u-body mt-4">
            Natural gas production, gathering, compression and processing draw electricity from
            the grid that gas-fired generation supplies. Shedding load to protect the grid
            therefore reduced the fuel available to restore it. Electricity and gas were not two
            sectors during that week. They were one system with a positive feedback term.
          </p>

          <div className="mt-10 space-y-8 border-t border-[color:var(--hairline)] pt-8">
            <Point
              term="The trigger appears once"
              detail="Cold weather enters the loop at the top and plays no further causal role. Everything after it is the system acting on itself."
            />
            <Point
              term="Each turn shortens the next"
              detail="Reinforcement compresses the window in which an operator can intervene. Response time is itself consumed by the cascade."
            />
            <Point
              term="Sector boundaries hide the loop"
              detail="A model of the power system and a model of the gas system, each excellent, cannot between them represent the edge that connects them."
            />
          </div>

          <p className="mt-10 text-[0.8125rem] leading-relaxed text-dim-bone">
            This is why the causal representation has to cross domain boundaries. The most
            consequential edge in the diagram is the one that no single discipline owns.
          </p>
        </div>
      </div>
    </Act>
  );
}

function Point({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <h4 className="text-[0.9375rem] text-bone">{term}</h4>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-bone">{detail}</p>
    </div>
  );
}
