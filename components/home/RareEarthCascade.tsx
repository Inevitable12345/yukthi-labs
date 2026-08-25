import { Act } from "./Act";
import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { rareEarthCascade } from "@/data/rare-earth";

/* ACT 05 — RARE-EARTH CASCADE
   The flagship. Not a large number on a dark background: an upstream node, a
   concentration, a control event, a propagation path, and a downstream region
   whose scenario conditions are stated. */
export function RareEarthCascadeAct() {
  return (
    <Act
      id="rare-earth"
      index="Act 05"
      eyebrow="Chokepoint"
      headline="Small choke points. Massive consequences."
      lede={
        <>
          Tiny quantities of obscure minerals can sit beneath trillions of dollars of economic
          activity. The asymmetry is not an accident of geology — it is a consequence of where
          processing capacity was built. <EvidenceMarker id="E-005" />
        </>
      }
    >
      <CausalHypergraph
        graph={rareEarthCascade}
        height={560}
        minWidth={1000}
        caption="Select any node to inspect its state, its mechanism, its evidence and its second- and third-order effects."
      />

      <div className="mt-16 grid gap-10 border-t border-[color:var(--hairline)] pt-12 lg:grid-cols-3">
        <Reading
          label="Upstream"
          value="~90%"
          unit="of rare-earth refining capacity"
          detail="Concentration sits at processing, not at the mine. That is what makes an administrative decision propagate globally."
          evidenceId="E-005"
        />
        <Reading
          label="Control event"
          value="7"
          unit="elements, plus certain magnets"
          detail="Licensing imposed 4 April 2025. Not an embargo — a queue, which is harder to see and just as binding."
          evidenceId="E-004"
        />
        <Reading
          label="Downstream exposure"
          value="Up to $6.5T"
          unit="of annual activity outside China"
          detail="Activity that sits behind the chokepoint under full implementation of the controls. Not a loss. Not a forecast. Not a probability."
          evidenceId="E-006"
        />
      </div>

      <p className="u-body mt-12 max-w-2xl">
        This is the case a linear dashboard cannot make. A dashboard would show magnet lead
        times rising. It would not show that four unrelated sectors share the input, that the
        constraint binds at a tier below the one being monitored, or that the exposure is
        measured in trillions while the material is measured in tonnes.
      </p>
    </Act>
  );
}

function Reading({
  label,
  value,
  unit,
  detail,
  evidenceId,
}: {
  label: string;
  value: string;
  unit: string;
  detail: string;
  evidenceId: string;
}) {
  return (
    <div>
      <InstrumentLabel as="h3" tone="steel">
        {label}
      </InstrumentLabel>
      <p className="u-display-3 mt-4 text-gold tabular-nums">{value}</p>
      <p className="mt-2 font-mono text-[0.625rem] tracking-[0.14em] text-dim-bone uppercase">
        {unit}
      </p>
      <p className="mt-4 text-[0.875rem] leading-relaxed text-muted-bone">{detail}</p>
      <p className="mt-3">
        <EvidenceMarker id={evidenceId} />
      </p>
    </div>
  );
}
