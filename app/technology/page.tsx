import type { Metadata } from "next";
import { CausalDiagram } from "@/components/causal/CausalDiagram";
import { JsonLd, pageSchema } from "@/components/layout/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { Hairline } from "@/components/ui/Hairline";
import { Ladder } from "@/components/ui/Ladder";
import { CHOKEPOINT_GRAPH } from "@/content/scenarios";
import { ROOM_COPY } from "@/content/thesis";
import { CLAIM_CLASS_LABEL, NODE_CATEGORY_LABEL } from "@/lib/graph/types";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { SITE } from "@/lib/metadata/site";

export const metadata: Metadata = buildMetadata({
  title: "Technology",
  description:
    "What a Scoped Causal Hypergraph-based World Model is: nodes, hyperedges, mechanisms, evidence, scope, and the map–monitor–forecast–simulate–re-map loop.",
  path: "/technology",
});

const LOOP_DETAIL = [
  {
    step: "Map",
    detail:
      "Build the scoped structure. Actors, events, policies, resources, infrastructure, dependencies, mechanisms and evidence, bounded by the decision that called for them.",
  },
  {
    step: "Monitor",
    detail:
      "Process evidence continuously and let it act on the structure — confirming, contradicting, weakening, introducing, re-conditioning, widening uncertainty.",
  },
  {
    step: "Forecast",
    detail:
      "Produce branches rather than a point. Each branch carries its assumptions, its causal path, where its uncertainty is concentrated, and the evidence beneath it.",
  },
  {
    step: "Simulate",
    detail:
      "Change a condition and traverse. Hyperedges fire when every one of their sources has been reached, which is what makes ordering meaningful rather than decorative.",
  },
  {
    step: "Re-map",
    detail:
      "Feed what monitoring and simulation exposed back into the structure. Inert nodes leave, conditional mechanisms gain their condition, boundaries move.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <PageShell
        coordinate="Yukthi / Technology"
        title="A Scoped Causal Hypergraph-based World Model"
        standfirst="Four words, each doing work. This page says what each one commits Yukthi to, and what it does not."
      >
        <div className="max-w-[62rem] space-y-16">
          <section aria-labelledby="terms-heading">
            <h2 id="terms-heading" className="headline">
              The four words
            </h2>
            <dl className="mt-8 grid gap-px bg-graphite sm:grid-cols-2">
              {[
                [
                  "Scoped",
                  "A decision defines the boundary. Yukthi does not attempt to model the whole planet at once; a question pulls in the nodes that carry consequence for it and leaves the rest out. The boundary is a modelling choice, and it is shown rather than hidden.",
                ],
                [
                  "Causal",
                  "Relations state a mechanism — how the causation runs — not a correlation. An edge without a mechanism is a decoration and does not enter the model.",
                ],
                [
                  "Hypergraph",
                  "Relations connect sets to sets. This is structural necessity, not mathematical taste: a pairwise graph cannot express that two conditions are jointly required and separately harmless.",
                ],
                [
                  "World model",
                  "A representation that is expected to change as evidence arrives, rather than a diagram drawn once. The loop below is the product.",
                ],
              ].map(([term, definition]) => (
                <div key={term} className="bg-void p-6">
                  <dt className="font-mono text-[0.72rem] tracking-[0.2em] uppercase text-brass">
                    {term}
                  </dt>
                  <dd className="mt-3 text-[0.9rem] leading-relaxed text-bone/85">{definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Hairline />

          <section aria-labelledby="model-heading">
            <h2 id="model-heading" className="headline">
              The data model
            </h2>
            <p className="standfirst mt-4 max-w-[54ch]">
              Three types, and one discipline that governs all of them.
            </p>

            {/* A horizontally scrollable region has to be reachable by keyboard,
                so it takes focus and names itself (§42). */}
            <pre
              tabIndex={0}
              role="region"
              aria-label="The causal data model, as TypeScript"
              className="mt-8 overflow-x-auto border border-graphite bg-ink/60 p-5 font-mono text-[0.72rem] leading-relaxed text-bone/85"
            >
              {`type CausalNode = {
  id: string;
  label: string;
  category: ${Object.keys(NODE_CATEGORY_LABEL)
    .map((key) => `"${key}"`)
    .join(" | ")};
  evidenceIds?: string[];
};

type CausalRelation = {
  id: string;
  sourceIds: string[];   // many
  targetIds: string[];   // many — this is the hyperedge
  mechanism: string;     // never omitted
  lag?: "immediate" | "weeks" | "months" | "years";
  evidenceIds?: string[];
};`}
            </pre>

            <p className="prose-argument mt-6">
              <span>
                Both endpoints are arrays, and that is the whole point. A relation with two sources
                fires only once both have been reached, which is why the diagrams draw a junction
                rather than two parallel arrows — parallel arrows would quietly assert that either
                cause alone is sufficient.
              </span>
            </p>

            <div className="mt-6">
              <p className="label-dim mb-3">Claim classes carried by every assertion</p>
              <ul className="space-y-1.5">
                {Object.entries(CLAIM_CLASS_LABEL).map(([key, label]) => (
                  <li key={key} className="font-mono text-[0.7rem] tracking-[0.08em] text-ash">
                    <span className="text-brass">{key}</span> — {label}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Hairline />

          <section aria-labelledby="loop-heading">
            <h2 id="loop-heading" className="headline">
              {SITE.loop.join(" → ")}
            </h2>
            <ol className="mt-8 space-y-6">
              {LOOP_DETAIL.map((row, index) => (
                <li key={row.step} className="grid gap-3 sm:grid-cols-[8rem_1fr] sm:gap-8">
                  <p className="font-mono text-[0.72rem] tracking-[0.2em] uppercase text-brass">
                    {(index + 1).toString().padStart(2, "0")} {row.step}
                  </p>
                  <p className="max-w-[58ch] text-[0.92rem] leading-relaxed text-bone/85">
                    {row.detail}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <Hairline />

          <section aria-labelledby="worked-heading">
            <h2 id="worked-heading" className="headline">
              A worked structure
            </h2>
            <p className="standfirst mt-4 max-w-[54ch]">{CHOKEPOINT_GRAPH.scopedTo}</p>
            <p className="mt-4 max-w-[58ch] font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-ash">
              Hand-authored, from the documented sources. This is an illustration of the
              representation Yukthi intends to build and maintain automatically — not model output.
            </p>
            <div className="mt-8">
              <CausalDiagram graph={CHOKEPOINT_GRAPH} />
            </div>
          </section>

          <Hairline />

          <section aria-labelledby="limits-heading">
            <h2 id="limits-heading" className="headline">
              What this is not
            </h2>
            <Ladder
              className="mt-8"
              title="Claims Yukthi does not make"
              steps={[
                "PERFECT PREDICTION",
                "GUARANTEED DETECTION",
                "CALIBRATED PROBABILITIES, TODAY",
                "A COMPLETE MODEL OF THE PLANET",
                "A REPLACEMENT FOR DOMAIN EXPERTISE",
              ]}
            />
            <p className="prose-argument mt-8">
              <span>{ROOM_COPY.forecast.body[1]}</span>
            </p>
          </section>
        </div>
      </PageShell>

      <JsonLd
        schema={pageSchema(
          "Technology",
          "The Scoped Causal Hypergraph-based World Model explained.",
          "/technology",
        )}
      />
    </>
  );
}
