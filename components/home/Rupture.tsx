import { Act } from "./Act";
import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { rupturedTopology } from "@/data/demo-hypergraph";

/* ACT 03 — THE RUPTURE
   The graph does not explode. The nodes barely move. What changes is topology —
   which is precisely the change a model fitted on the previous topology cannot
   absorb. */
export function Rupture() {
  return (
    <Act
      id="rupture"
      index="Act 03"
      eyebrow="The change"
      headline="The structure is changing."
      lede={
        <>
          Not more volatility around a stable arrangement — a different arrangement. Trade,
          technology, finance, energy and supply chains are increasingly used as instruments of
          state power, which makes the arrangement of the global economy a variable rather than
          a setting. <EvidenceMarker id="E-003" /> <EvidenceMarker id="E-017" />
        </>
      }
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
        <CausalHypergraph graph={rupturedTopology} height={440} minWidth={680} />

        <div>
          <div className="border border-[color:var(--color-rupture-deep)] p-6">
            <InstrumentLabel tone="rupture">Distinction</InstrumentLabel>
            <p className="u-display-3 mt-4 text-bone">Rupture ≠ transition</p>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-muted-bone">
              A transition moves a system along relationships that continue to hold. A rupture
              changes which relationships hold at all. The first can be forecast by
              extrapolation. The second cannot be — by anyone, however well resourced.
            </p>
          </div>

          <ol className="mt-10 space-y-6">
            <Change
              index="01"
              term="Routes become conditional"
              detail="A path that existed unconditionally now depends on a policy state that can change without notice."
            />
            <Change
              index="02"
              term="Policy enters as a node"
              detail="Export controls, industrial policy and tariffs stop being context around the system and become part of it, with their own causal effects."
            />
            <Change
              index="03"
              term="Independent layers couple"
              detail="Two domains that could be modelled separately begin to move together, and the diversification between them quietly stops working."
            />
            <Change
              index="04"
              term="Some relations simply break"
              detail="An edge that carried flow for thirty years stops carrying it. Nothing in the historical record contains this event."
            />
          </ol>

          <p className="mt-10 border-t border-[color:var(--hairline)] pt-6 text-[0.8125rem] leading-relaxed text-dim-bone">
            The schematic above is illustrative. The change it depicts is not: IMF and WTO staff
            both estimate long-run global output costs from fragmentation in the low single
            digits of percent, rising sharply under fast fragmentation and technological
            decoupling. <EvidenceMarker id="E-001" /> <EvidenceMarker id="E-002" />
          </p>
        </div>
      </div>
    </Act>
  );
}

function Change({ index, term, detail }: { index: string; term: string; detail: string }) {
  return (
    <li className="flex gap-5">
      <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">{index}</span>
      <span>
        <span className="block text-[0.9375rem] text-bone">{term}</span>
        <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-muted-bone">
          {detail}
        </span>
      </span>
    </li>
  );
}
