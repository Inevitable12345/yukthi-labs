import { ArchitectureFlow } from "@/components/architecture/ArchitectureFlow";
import { ArchitectureLayers } from "@/components/architecture/ArchitectureLayers";
import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { MapMonitorForecastLoop } from "@/components/visualization/MapMonitorForecastLoop";
import { PageShell, Section } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { IllustrativeBadge } from "@/components/evidence/IllustrativeBadge";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { semiconductorHypergraph } from "@/data/semiconductor";
import { SITE } from "@/lib/metadata/site";

export const metadata = buildMetadata({
  title: "Architecture",
  description:
    "How the Scoped Causal Hypergraph-based World Model is intended to work: ten layers from scope to decision support, each with its maturity and its open problem stated.",
  path: "/architecture",
});

const BENCHMARKS = [
  {
    index: "01",
    question: "Did the system identify consequential risks earlier?",
    detail:
      "Measured against the date a risk became visible to the organisation by its existing means. Earlier is only meaningful if it is also actionable.",
  },
  {
    index: "02",
    question: "Were its probabilities better calibrated?",
    detail:
      "Scored, not asserted. Calibration is the one property of a forecast that can be checked after the fact, which is why it is the benchmark that matters most.",
  },
  {
    index: "03",
    question: "Did it reveal causal pathways existing systems missed?",
    detail:
      "A pathway counts only if it was absent from the incumbent representation and turned out to carry an effect.",
  },
  {
    index: "04",
    question: "Could the user intervene before the loss occurred?",
    detail:
      "The final test. Earlier knowledge that arrives after the decision window has closed is of no value to anyone.",
  },
];

export default function ArchitecturePage() {
  return (
    <>
      <WebPageJsonLd
        name="Architecture"
        description="The conceptual architecture of Yukthi Lab's world model."
        path="/architecture"
      />
      <PageShell
        eyebrow="00 / architecture"
        title="How it is meant to work."
        lede="Ten layers, from bounding a decision to handing a human something they can argue with. Each carries an explicit maturity status and the problem that is not yet solved inside it."
        aside={
          <div>
            <InstrumentLabel as="p" tone="gold">
              Status
            </InstrumentLabel>
            <p className="mt-2 max-w-xs text-[0.8125rem] leading-relaxed text-muted-bone">
              This describes a system under development. Nothing on this page is a description
              of deployed software, and no layer is marked beyond concept or open research.
            </p>
          </div>
        }
      >
        <Section index="01 / loop" title="The operating loop">
          <p className="u-lede u-measure mb-14">
            {SITE.loop.join(" → ")}. Closed, because re-mapping changes the structure that
            mapping produced. A world model with a final state is a diagram.
          </p>
          <MapMonitorForecastLoop />
        </Section>

        <Section index="02 / layers" title="Ten layers">
          <ArchitectureLayers />
        </Section>

        <Section index="03 / flow" title="Signals to decision, and back">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
            <ArchitectureFlow />
            <div>
              <Prose>
                <h2>Why the representation is a hypergraph</h2>
                <p>
                  An ordinary graph connects pairs. That is enough to say{" "}
                  <strong>A affects C</strong>, and not enough to say{" "}
                  <strong>A, B and D together produce C, and none of them does alone</strong>.
                  Joint conditions are the interesting ones — they are where the surprises live,
                  because each individual cause looks survivable in isolation.
                </p>
                <p>
                  A hyperedge connects sets. The junction drawn at the centre of a hyperedge in
                  every diagram on this site is that claim, made visible.
                </p>

                <h2>Why it is scoped</h2>
                <p>
                  A world model of everything is not a model; it is a restatement of the world
                  at the same complexity, with the same problems. Scoping fixes the decision,
                  the horizon and the boundary at which structure stops being represented and
                  becomes an exogenous input.
                </p>
                <p>
                  Scoping is also where the deepest errors live: a variable left outside the
                  boundary cannot be discovered by any amount of computation inside it. That is
                  why <strong>re-map</strong> is a layer rather than a maintenance task.
                </p>

                <h2>What is not claimed</h2>
                <p>
                  That any of this is running. That causal structure can be induced reliably
                  from text. That a forecast produced this way would be better calibrated than a
                  good human forecaster. These are the open problems listed against the layers
                  above, and they are open.
                </p>
              </Prose>
            </div>
          </div>

          <div className="mt-20">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <InstrumentLabel tone="steel">
                A worked example of the representation
              </InstrumentLabel>
              <IllustrativeBadge label="Observed structure · 2020–21 episode" />
            </div>
            <CausalHypergraph graph={semiconductorHypergraph} height={620} minWidth={1000} />
          </div>
        </Section>

        <Section index="04 / benchmarks" title="How this should be judged">
          <p className="u-lede u-measure">
            These are the tests Yukthi Lab intends to be measured against. None of them has been
            passed yet — they are stated here so that the standard is fixed before the results
            are in, rather than after.
          </p>

          <ol className="mt-14 grid gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-2">
            {BENCHMARKS.map((benchmark) => (
              <li key={benchmark.index} className="bg-void p-8">
                <InstrumentLabel tone="gold" className="tabular-nums">
                  {benchmark.index}
                </InstrumentLabel>
                <h3 className="mt-4 text-[1.0625rem] leading-snug text-bone">
                  {benchmark.question}
                </h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-muted-bone">
                  {benchmark.detail}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-2xl border-l border-[color:var(--color-rupture-deep)] pl-6 text-[0.875rem] leading-relaxed text-muted-bone">
            A research challenge, not a results table. If this page ever shows a score, it will
            show the method that produced it alongside.
          </p>
        </Section>
      </PageShell>
    </>
  );
}
