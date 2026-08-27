import { StoryChapterSection } from "@/components/story/StoryChapter";
import { CausalDiagram } from "@/components/hypergraph/CausalDiagram";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { uriFeedback } from "@/data/graphs";

/* ACT VI — FEEDBACK (§12)
   Winter Storm Uri as a reinforcing loop. The message is that catastrophe
   emerges from interaction rather than from one variable — and the FERC/NERC
   inquiry is unusually good evidence because it had mandatory access to operator
   data rather than having to infer the mechanism. */
export function UriFeedbackScene() {
  return (
    <StoryChapterSection
      chapter="feedback"
      eyebrow="Interaction"
      headline="Catastrophe often emerges from interaction, not from one variable."
      lede={
        <>
          In February 2021 the cold was the trigger. The loop was the mechanism. Electricity
          loss disabled the gas infrastructure that fuelled the generation whose failure had
          caused the electricity loss — and each turn deepened the shortfall instead of damping
          it.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-24">
        <CausalDiagram graph={uriFeedback} height={520} minWidth={600} />

        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <Metric value="≈61,800" unit="MW" label="Generation lost" />
            <Metric value="4,124" unit="events" label="Outages, derates or failures to start" />
            <Metric value="1,045" unit="units" label="Generating units affected" />
            <Metric value="4.5m+" unit="customers" label="Lost power" />
          </div>

          <EvidenceInspector ids={["E-012"]} />

          <div className="border-t border-[color:var(--hairline)] pt-8">
            <InstrumentLabel as="h3" tone="gold">
              Why a loop is a different object
            </InstrumentLabel>
            <p className="u-body mt-4">
              A chain has an end. A loop does not: it has a gain. If each turn removes more
              capacity than the last restored, the system does not settle at a lower level — it
              keeps falling until something breaks the circuit.
            </p>
            <p className="u-body mt-4">
              This is why the representation matters rather than merely the data. A model can
              hold every variable in this diagram and still miss the outcome, if the arrow from
              fuel starvation back to generation failure is not in it. That single edge is the
              difference between a shortfall and a cascade.
            </p>
            <p className="u-body mt-4">
              It is also where intervention lives. You cannot intervene on the weather. You can
              intervene on whether gas infrastructure is designated as critical load — which is
              an edge in the graph, and was one of the inquiry&rsquo;s findings.
            </p>
          </div>
        </div>
      </div>
    </StoryChapterSection>
  );
}

function Metric({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div>
      <p className="font-display text-[2.25rem] leading-none font-light text-bone tabular-nums">
        {value}
      </p>
      <p className="u-instrument mt-2 text-steel">{unit}</p>
      <p className="u-body mt-3 text-[0.8125rem]">{label}</p>
    </div>
  );
}
