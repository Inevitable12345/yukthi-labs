import { PageShell } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { ClaimClassLegend } from "@/components/evidence/ClaimClassChip";
import { buildMetadata } from "@/lib/metadata/build-metadata";

const DESCRIPTION =
  "The Yukthi mission argument in full: how the world's structure changed, why extrapolative models become fragile under regime change, and why explicit causal structure is the missing layer.";

export const metadata = buildMetadata({
  title: "Thesis",
  description: DESCRIPTION,
  path: "/thesis",
});

export default function ThesisPage() {
  return (
    <>
      <WebPageJsonLd name="Thesis" description={DESCRIPTION} path="/thesis" />

      <PageShell
        eyebrow="Thesis"
        title="Bring certainty to an increasingly unstable world."
        lede={
          <>
            The homepage makes this argument as a sequence. This page makes it as an essay, for
            readers who would rather have it all at once.
          </>
        }
      >
        <Prose>
          <h2>The premise, and why it stopped holding</h2>

          <p>
            For roughly three decades, the operating assumption of most economic reasoning was
            that the structure of the world was approximately fixed. Globalisation expanded.
            Trade was predictable. Supply chains were dependable enough to run without buffers.
            Multilateral institutions functioned well enough to be treated as background. Above
            all, historical relationships remained useful — a model fitted on the past
            transferred to the present, because the present was produced the same way the past
            had been.
          </p>

          <p>
            Under those conditions extrapolation is not laziness. It is the correct method, and
            treating it as naive misunderstands what changed. What changed is not that
            forecasters became worse. It is that the <em>data-generating structure</em> started
            moving.
          </p>

          <h3>What the evidence shows</h3>

          <p>
            WTO staff find measurable signs that trade is reorganising along geopolitical lines,
            with trade growth between blocs slowing relative to growth within them — while
            carefully declining to conclude that fragmentation is a completed state. That
            distinction matters and this site preserves it.
          </p>

          <p>
            The cost is not small. IMF staff estimate long-run output losses from fragmentation
            ranging from about 0.2% of global GDP under limited fragmentation to nearly 7% under
            a severe scenario, rising to 8–12% in some economies once technological decoupling
            is added. Independent WTO simulation work puts decoupling into two isolated blocs at
            roughly 5% of global real income. Two modelling traditions, one order of magnitude.
          </p>

          <EvidenceInspector ids={["E-001", "E-002", "E-003", "E-004"]} />

          <h2>Why small things now break large things</h2>

          <p>
            On 4 April 2025, China introduced export licensing requirements covering seven
            medium and heavy rare earth elements and certain permanent magnets. Not an embargo —
            a licensing regime, where the binding constraint is administrative rather than
            physical.
          </p>

          <p>
            The reason a paperwork step propagates globally is concentration. Roughly 90% of
            rare earth refining and separation capacity sits in one jurisdiction, and the IEA
            estimates that under full implementation of export controls up to USD 6.5 trillion
            of annual activity outside China could be exposed — over USD 3 trillion of it
            automotive.
          </p>

          <blockquote>
            <p>
              Tiny quantities of obscure materials can become causal chokepoints for trillions
              of dollars of economic activity.
            </p>
          </blockquote>

          <p>
            Note what that figure is and is not. It is <em>exposed</em> activity under a
            full-implementation scenario — how much output sits behind the chokepoint, not how
            much would stop. Quoting it as a loss estimate would misrepresent the source.
          </p>

          <p>
            The structural point: nothing physical changed on the day of the announcement. The
            concentration was already there, documented for years. What changed was the state of
            an edge — a relation that had been latent became active. A model that watches prices
            sees nothing until allocation arrives. A model that holds the structure can read the
            exposure beforehand.
          </p>

          <EvidenceInspector ids={["E-005", "E-006", "E-007", "E-008"]} />

          <h2>Reality is not a chain</h2>

          <p>
            The 2021 automotive semiconductor shortage is usually told as a chain: demand fell,
            orders were cancelled, capacity was reassigned, vehicles could not be built. That
            story is true and radically incomplete.
          </p>

          <p>
            At least nine causes were operating: the pandemic demand shift, consumer electronics
            demand, the cancellations themselves, geographic concentration of fabrication,
            lockdowns in assembly and test, drought affecting fab water supply, a fab fire,
            logistics disruption, and an inventory design that converted any delay directly into
            a stoppage.
          </p>

          <p>
            These did not act independently. The demand-side causes had to occur{" "}
            <em>together</em> to reassign the allocation queue; the supply-side shocks had to
            land on a base concentrated enough that they could not be routed around. Represent
            that as eleven arrows and the conjunction — the only thing that explains the outcome
            — is lost. A hyperedge connects a set of causes to a set of effects, and that is why
            the representation matters.
          </p>

          <p>
            The evidence is the revision. AlixPartners forecast USD 110 billion and 3.9 million
            units lost; four months later, USD 210 billion and 7.7 million units. A forecast
            that nearly doubles within a quarter is telling you its causal structure was
            incomplete.
          </p>

          <EvidenceInspector ids={["E-009"]} />

          <h2>Why good models fail on schedule</h2>

          <p>
            The ECB is among the best-resourced forecasting institutions in the world. Its own
            review finds that short-term inflation projection accuracy deteriorated markedly in
            2021–22, with staff substantially underestimating the surge, and attributes the
            errors principally to energy price dynamics and supply bottlenecks the framework did
            not capture.
          </p>

          <p>
            This is not an argument that forecasting does not work. It is the opposite: it is
            evidence that <em>capability was never the binding constraint</em>. A model fitted
            on history encodes an assumption it cannot state — that tomorrow&rsquo;s
            data-generating process is yesterday&rsquo;s. When that stops holding, the model
            fails predictably and silently, because the failure is in an assumption rather than
            a parameter.
          </p>

          <p>
            Systematic error clustering in one direction is the signature. Random error is
            noise. Clustered error is information about structure.
          </p>

          <EvidenceInspector ids={["E-010", "E-011"]} />

          <h2>Catastrophe comes from interaction</h2>

          <p>
            In February 2021, Winter Storm Uri produced what the joint FERC/NERC inquiry
            documents as approximately 61,800 MW of lost generation, 1,045 units affected across
            4,124 outages, derates or failures to start, and more than 4.5 million customers
            without power.
          </p>

          <p>
            The cold was the trigger. The mechanism was a loop: generation failure reduced
            electricity supply; load shedding removed power from gas production and processing;
            falling gas supply starved gas-fired generation of fuel; more generation failed.
            Each turn deepened the shortfall rather than damping it.
          </p>

          <p>
            A model can contain every variable in that description and still miss the outcome,
            if the arrow running from fuel starvation back to generation failure is not in it.
            One edge is the difference between a shortfall and a cascade — and it is also where
            intervention lives. You cannot intervene on the weather. You can intervene on
            whether gas infrastructure is designated critical load.
          </p>

          <EvidenceInspector ids={["E-012"]} />

          <h2>Why now</h2>

          <p>Two conditions became true at roughly the same time, and the bet requires both.</p>

          <p>
            The first is that the world&rsquo;s structure now moves fast enough, and interacts
            densely enough, that extrapolative methods degrade in exactly the situations that
            matter most. The second is that machine reasoning became capable enough to process
            evidence at the scale a causal model requires.
          </p>

          <p>
            The evidence for the second is real and narrower than the claims usually made about
            it. An ensemble of twelve language models was statistically indistinguishable from a
            crowd of 925 human forecasters over a three-month tournament. A retrieval-augmented
            system approaches aggregated crowd accuracy. Frontier models have surpassed a
            general crowd baseline — and none of these beat expert forecasters.
          </p>

          <blockquote>
            <p>
              AI has made a new analytical architecture plausible. It has not eliminated
              uncertainty.
            </p>
          </blockquote>

          <p>
            What none of those systems has is a model of how the world is wired that persists
            between questions, accumulates evidence and can be simulated against. That is the
            missing layer, and it is architectural rather than a matter of capability.
          </p>

          <EvidenceInspector ids={["E-015", "E-016", "E-017"]} />

          <h2>What Yukthi is building</h2>

          <p>
            A <strong>Scoped Causal Hypergraph-based World Model</strong>: an explicit
            representation of entities, the relations between sets of them, the mechanisms by
            which effects transmit, and the evidence supporting each — scoped to a specific
            consequential decision, and kept current by continuous monitoring.
          </p>

          <p>
            It operates as a loop. <strong>Map</strong> the structure a decision depends on.{" "}
            <strong>Monitor</strong> for evidence bearing on it. <strong>Forecast</strong> along
            causal paths. <strong>Simulate</strong> a changed condition and propagate it.{" "}
            <strong>Re-map</strong> when evidence contradicts the structure — revising the
            model&rsquo;s shape rather than re-tuning its parameters. That last step is what
            makes it responsive to regime change instead of degrading under it.
          </p>

          <h2>What would prove it wrong</h2>

          <p>
            Four questions, and they are falsifiable: did the system identify consequential
            risks earlier than what the organisation already had; were its probabilities better
            calibrated when scored against resolved outcomes; did it reveal causal pathways
            existing systems missed; and could the user intervene before the loss occurred?
          </p>

          <p>
            Yukthi does not claim to predict the future. The claim is narrower and more useful:
            that consequential change can be detected, reasoned about and acted on earlier than
            it currently is.
          </p>

          <h2>How to read this site</h2>

          <p>Every claim here carries an epistemic class, shown wherever it appears:</p>
        </Prose>

        <ClaimClassLegend className="mt-8 u-measure" />
      </PageShell>
    </>
  );
}
