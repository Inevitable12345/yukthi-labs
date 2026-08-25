import { Act } from "./Act";
import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { stableLattice } from "@/data/demo-hypergraph";

/* ACT 02 — THE STABLE OPERATING SYSTEM
   The reader has to feel why extrapolation once made sense before being shown
   why it stopped. Nothing here is framed as naive. */
export function StableWorld() {
  return (
    <Act
      id="stable-world"
      index="Act 02"
      eyebrow="The prior regime"
      headline="The last era was built on an assumption of stability."
      lede={
        <>
          Expanding globalisation. Predictable trade. Dependable supply chains. Functioning
          multilateral institutions. Above all, the belief that the past was a usable guide to
          the future — because the relationships producing the past were still the relationships
          producing the present.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
        <CausalHypergraph graph={stableLattice} height={420} minWidth={640} />

        <div className="space-y-10">
          <Property
            term="Predictable cycles"
            detail="Relationships recur. The same shock produces the same response, at roughly the same lag."
          />
          <Property
            term="Narrow confidence"
            detail="Uncertainty is bounded because the structure generating the data is not in question."
          />
          <Property
            term="Simple paths"
            detail="Any two parts of the system are a short, direct distance apart. Effects are traceable by hand."
          />
          <Property
            term="Repeatable relationships"
            detail="A model fitted on history transfers to the present, because the present is made the same way."
          />
          <p className="border-t border-[color:var(--hairline)] pt-8 text-[0.875rem] leading-relaxed text-muted-bone">
            Under these conditions, extrapolation is not laziness. It is the correct method.
            Every argument that follows depends on that being true — and on it no longer being
            true.
          </p>
        </div>
      </div>
    </Act>
  );
}

function Property({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <h3 className="font-mono text-[0.6875rem] tracking-[0.18em] text-steel uppercase">
        {term}
      </h3>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-bone">{detail}</p>
    </div>
  );
}
