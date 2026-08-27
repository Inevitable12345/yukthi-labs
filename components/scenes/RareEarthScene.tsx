import { StoryChapterSection } from "@/components/story/StoryChapter";
import { CausalDiagram } from "@/components/hypergraph/CausalDiagram";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { rareEarthCascade } from "@/data/graphs";

/* ACT III — THE CHOKEPOINT (§9)
   Zoom from planetary scale to one material system. The job of this act is to
   make a single upstream administrative state visibly threaten an enormous
   downstream base — and to be exact about what the numbers do and do not say. */
export function RareEarthScene() {
  return (
    <StoryChapterSection
      chapter="rare-earth"
      eyebrow="The chokepoint"
      headline="Tiny quantities of obscure materials can become causal chokepoints for trillions of dollars of economic activity."
      headlineClassName="max-w-[24ch]"
      lede={
        <>
          On 4 April 2025, China introduced export licensing requirements covering seven medium
          and heavy rare earth elements and certain permanent magnets. Not an embargo — a
          licensing regime. Shipments continue, at the rate licences are granted.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-24">
        <CausalDiagram graph={rareEarthCascade} height={560} minWidth={640} />

        <div className="space-y-12">
          <Figure
            value="≈90%"
            label="Global rare-earth refining capacity"
            detail="Concentration sits at the refining and separation stage, not at the mine. Mined production is materially more distributed than processing — which is precisely why the chokepoint is where it is. The IEA projects this falling toward about 70% by 2035 as announced projects deliver."
            evidenceIds={["E-006"]}
          />

          <Figure
            value="USD 6.5tn"
            label="Annual activity exposed, full-implementation scenario"
            detail="This is exposed downstream activity, not a loss that has occurred and not a prediction that it will. It measures how much output sits behind the chokepoint — over USD 3 trillion of it automotive — not how much of it would stop."
            evidenceIds={["E-007"]}
          />

          <div className="border-t border-[color:var(--hairline)] pt-8">
            <InstrumentLabel as="h3" tone="gold">
              Why this is a causal structure, not a statistic
            </InstrumentLabel>
            <p className="u-body mt-4">
              The concentration had been documented for years before it bound. Nothing about the
              physical world changed on the day of the announcement — the refining share was
              already what it was. What changed was the <em>state of an edge</em>: a relation
              that had been latent became active.
            </p>
            <p className="u-body mt-4">
              A model that watches prices sees nothing until allocation reaches it. A model that
              holds the structure can see the exposure before the mechanism fires, because the
              exposure was always there to be read.
            </p>
            <EvidenceInspector ids={["E-005", "E-008"]} className="mt-6" />
          </div>
        </div>
      </div>
    </StoryChapterSection>
  );
}

function Figure({
  value,
  label,
  detail,
  evidenceIds,
}: {
  value: string;
  label: string;
  detail: string;
  evidenceIds: string[];
}) {
  return (
    <div>
      <p className="font-display text-[3.25rem] leading-none font-light text-gold tabular-nums">
        {value}
      </p>
      <InstrumentLabel as="p" className="mt-4">
        {label}
      </InstrumentLabel>
      <p className="u-body mt-4">{detail}</p>
      <EvidenceInspector ids={evidenceIds} className="mt-4" />
    </div>
  );
}
