import { StoryChapterSection } from "@/components/story/StoryChapter";
import { CausalDiagram } from "@/components/hypergraph/CausalDiagram";
import { ClaimClassChip } from "@/components/evidence/ClaimClassChip";
import { stableLattice } from "@/data/graphs";

/* ACT I — STABILITY (§7)
   The reader has to feel why extrapolation once made sense before being shown
   why it stopped. Nothing here is framed as naive: under a stable structure,
   extrapolation is the correct method, and saying so is what makes the next act
   land. */
export function StabilityScene() {
  return (
    <StoryChapterSection
      chapter="stability"
      eyebrow="The prior regime"
      headline="The last era was built on an assumption of stability."
      lede={
        <>
          Expanding globalisation. Predictable trade. Dependable supply chains. Functioning
          multilateral institutions. Above all, the belief that the past was a usable guide to
          the future — because the relationships that produced the past were still the
          relationships producing the present.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
        <CausalDiagram graph={stableLattice} height={420} minWidth={620} />

        <div className="space-y-10">
          <Property
            term="Predictable cycles"
            detail="Relationships recur. The same shock produces the same response, at roughly the same lag."
          />
          <Property
            term="Narrow uncertainty"
            detail="Confidence bands are tight because the structure generating the data is not itself in question."
          />
          <Property
            term="Short paths"
            detail="Any two parts of the system are one or two steps apart. Effects can be traced by hand, on paper, in a meeting."
          />
          <Property
            term="Transferable models"
            detail="A model fitted on history transfers to the present, because the present is made the same way the past was."
          />

          <div className="border-t border-[color:var(--hairline)] pt-8">
            <ClaimClassChip claimClass="yukthi-interpretation" />
            <p className="mt-5 text-[0.875rem] leading-relaxed text-muted-bone">
              Under these conditions extrapolation is not laziness. It is the correct method.
              Every argument that follows depends on that having been true — and on it no longer
              being true.
            </p>
          </div>
        </div>
      </div>
    </StoryChapterSection>
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
