import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { convergenceChain, convergenceForces } from "@/data/convergence";

/* INTERSTITIAL — WHY THIS DECADE
   Placed between the physical cascade and the decision frame, because the reader
   has just seen one loop and needs to see that the loops interconnect.

   Not numbered as an act: the twelve-act sequence is the argument's spine, and
   this is the widening shot between two of its beats. */
export function Convergence() {
  return (
    <section
      id="convergence"
      aria-labelledby="convergence-heading"
      className="u-gutter relative scroll-mt-20 border-t border-[color:var(--hairline)] py-24 sm:py-32"
    >
      <InstrumentLabel tone="steel">Interstitial · convergence</InstrumentLabel>

      <h2 id="convergence-heading" className="u-display-2 mt-8 max-w-[17ch] text-bone">
        These forces do not operate independently.
      </h2>

      <p className="u-lede u-measure mt-8">
        Each is usually filed under its own heading, given to its own team, and modelled by its
        own specialists. They share inputs, share infrastructure, and feed each other.
      </p>

      <ul className="mt-16 grid gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
        {convergenceForces.map((force, index) => (
          <li key={force.id} className="bg-void p-5">
            <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 text-[0.9375rem] leading-snug text-bone">{force.label}</p>
            <p className="mt-3 flex flex-wrap gap-1.5">
              {force.evidenceIds.map((id) => (
                <EvidenceMarker key={id} id={id} />
              ))}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
        <div>
          <InstrumentLabel as="h3" tone="gold">
            One path through the system
          </InstrumentLabel>
          <p className="u-body mt-4">
            Follow a single thread. An AI build-out becomes data-centre construction, which
            becomes electricity demand — the IEA estimates data-centre consumption roughly
            doubling to about 945 TWh by 2030. <EvidenceMarker id="E-015" /> Electricity demand
            becomes transformer demand, which becomes copper and critical-material demand, which
            arrives at processing capacity concentrated in one jurisdiction.{" "}
            <EvidenceMarker id="E-005" />
          </p>
          <p className="u-body mt-4">
            That concentration is what makes an export control effective rather than symbolic.{" "}
            <EvidenceMarker id="E-016" /> Control raises infrastructure cost and lead time. Cost
            and lead time delay data centres. Delayed data centres constrain compute.
            Constrained compute intensifies the competition that drove the build-out in the
            first place.
          </p>
          <p className="mt-6 border-l border-[color:var(--color-rupture-deep)] pl-5 text-[0.8125rem] leading-relaxed text-dim-bone">
            The chain is drawn as illustrative because its <em>combination</em> into this single
            path is a construction. Each stage is evidenced; the sequence is an explanation.
          </p>
        </div>

        <CausalHypergraph graph={convergenceChain} height={860} minWidth={520} />
      </div>
    </section>
  );
}
