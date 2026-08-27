import { PageShell } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { CausalDiagram } from "@/components/hypergraph/CausalDiagram";
import { ClaimClassChip } from "@/components/evidence/ClaimClassChip";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { semiconductorHypergraph } from "@/data/graphs";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { SITE } from "@/lib/metadata/site";

const DESCRIPTION =
  "What a Scoped Causal Hypergraph-based World Model is: the representation, why hyperedges rather than edges, what 'scoped' means, and the Map → Monitor → Forecast → Simulate → Re-map loop.";

export const metadata = buildMetadata({
  title: "Technology",
  description: DESCRIPTION,
  path: "/technology",
});

/**
 * The technical page.
 *
 * Constrained by §35: explain the architecture without inventing proprietary
 * detail. Everything here is either a property of the representation — which is
 * a matter of definition and can be stated exactly — or an explicit statement of
 * intent, labelled as such. There are no benchmark numbers, no model
 * architecture claims, and no performance figures, because none exist to report.
 */
export default function TechnologyPage() {
  return (
    <>
      <WebPageJsonLd name="Technology" description={DESCRIPTION} path="/technology" />

      <PageShell
        eyebrow="The technical bet"
        title="A Scoped Causal Hypergraph-based World Model"
        lede={
          <>
            Four words, each doing specific work. This page takes them in turn and says what
            each commits Yukthi to — and what it does not.
          </>
        }
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-24">
          <div>
            <Prose>
              <h2>World Model</h2>

              <p>
                An explicit, persistent representation of entities and the relations between
                them — as opposed to a function fitted from inputs to outputs.
              </p>

              <p>
                The difference is what happens when you ask a question the system has not seen.
                A fitted model interpolates within the distribution it was trained on. A world
                model can be <em>queried structurally</em>: what depends on this node, what
                happens if this condition changes, which path connects these two things. Those
                questions have answers even when nothing resembling them appears in the training
                data — because the answer is derived from the structure rather than recalled
                from examples.
              </p>

              <p>
                Persistence matters as much as explicitness. The model exists between questions,
                accumulates evidence, and carries its history. This is what separates it from a
                reasoning system that assembles a fresh view each time it is asked.
              </p>

              <h2>Causal</h2>

              <p>
                Relations carry mechanisms, not just associations. Every relation in the schema
                requires a <code>mechanism</code> field — a statement of <em>how</em> the effect
                is transmitted. That is a deliberate constraint: a relation that cannot be given
                a mechanism does not go in the model.
              </p>

              <p>
                This is the property that makes simulation meaningful. Setting a condition and
                propagating it only produces a valid answer if the edges represent transmission
                rather than correlation. It is also what makes the model interrogable: a
                mechanism can be disputed by a domain expert, which an estimated coefficient
                cannot.
              </p>

              <p>
                Relations also carry <strong>alternatives</strong> — other readings consistent
                with the same observation. Recording them is a discipline against the most
                common failure in causal modelling, which is a plausible mechanism accepted
                because no one wrote down the competing one.
              </p>

              <h2>Hypergraph</h2>

              <p>
                A relation connects a <em>set</em> of sources to a <em>set</em> of targets.
                Pairwise edges are the degenerate case, not the primitive.
              </p>

              <p>
                This is not a technical flourish. The situations that matter are conjunctive:
                extreme cold <em>and</em> unwinterised equipment <em>and</em> a high gas-fired
                share produce an outage. Demand shifting to consumer electronics <em>and</em>{" "}
                automotive order cancellations <em>and</em> concentrated fabrication reassign an
                allocation queue. Decompose either into separate arrows and you have recorded
                that several things happened, having lost the fact that they had to happen
                together.
              </p>

              <p>
                The diagram alongside shows the shape: nine causes, two junctions, one outcome.
                Not eleven arrows.
              </p>

              <h2>Scoped</h2>

              <p>
                Yukthi does not model the planet, and says so plainly because the alternative
                claim would be false.
              </p>

              <p>
                A consequential decision defines a scope: which entities matter, which relations
                are worth representing, and how deep the causal trace must run before the answer
                stops changing. An industrial COO asking which Tier-3 component can stop a line
                and a central bank asking which assumption stops holding under the next regime
                need different scopes over a shared substrate.
              </p>

              <p>
                Scope is what makes the model tractable, the evidence auditable, and the claim
                honest. It is the difference between a research programme and a product.
              </p>
            </Prose>
          </div>

          <div className="space-y-16">
            <div>
              <InstrumentLabel as="h2" tone="gold">
                The representation, drawn
              </InstrumentLabel>
              <p className="u-body mt-4">
                A real hyperedge from the evidence base. Select any node to read its mechanism.
              </p>
              <div className="mt-8">
                <CausalDiagram graph={semiconductorHypergraph} height={520} minWidth={560} />
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] p-8">
              <InstrumentLabel as="h2">The schema, in brief</InstrumentLabel>
              <p className="u-body mt-4">
                The types the site itself is built on. These are the actual definitions in the
                codebase, not an illustration of them.
              </p>

              <dl className="mt-8 space-y-6">
                <SchemaEntry
                  term="CausalNode"
                  detail="id, label, kind, description, state, scope, evidenceIds, claimClass. A node knows which decision it was mapped for and what evidence supports it."
                />
                <SchemaEntry
                  term="CausalRelation"
                  detail="sourceIds[], targetIds[], mechanism (required), polarity, order, state, evidenceIds, alternatives. Both endpoints are arrays — that is the hypergraph."
                />
                <SchemaEntry
                  term="Relation state"
                  detail="active, latent, broken or contested. A latent relation is present in the structure and not currently transmitting; the rare-earth chokepoint was latent for years before it became active."
                />
                <SchemaEntry
                  term="EvidenceRecord"
                  detail="claim, context, methodology, causalRelevance, status. Context records what the figure does not say — a number without its limits is a misquotation."
                />
              </dl>
            </div>

            <div className="border border-gold-dim p-8">
              <ClaimClassChip claimClass="product-ambition" />
              <h2 className="u-display-3 mt-6 text-bone">The operating loop</h2>
              <ol className="mt-8 space-y-5">
                {SITE.loop.map((stage, index) => (
                  <li key={stage} className="flex gap-4">
                    <InstrumentLabel tone="gold" className="tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </InstrumentLabel>
                    <span className="text-[0.9375rem] text-bone">{stage}</span>
                  </li>
                ))}
              </ol>
              <p className="u-body mt-8">
                Re-map is the step that distinguishes this from a model that degrades under
                regime change. When evidence contradicts the structure, the structure is revised
                — not the parameters re-fitted.
              </p>
            </div>

            <div className="border-t border-[color:var(--hairline)] pt-8">
              <InstrumentLabel as="h2" tone="rupture">
                What this page deliberately does not contain
              </InstrumentLabel>
              <ul className="mt-6 space-y-3">
                {[
                  "Benchmark results, accuracy figures or calibration scores",
                  "Model architecture details or parameter counts",
                  "Proprietary dataset or partnership claims",
                  "Named pilots, customers or deployments",
                ].map((item) => (
                  <li key={item} className="u-body flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-px w-4 shrink-0 bg-rupture-deep"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="u-body mt-6">
                None of these exist yet. Publishing them would contradict the argument the rest
                of this site makes about evidence.
              </p>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}

function SchemaEntry({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.75rem] tracking-[0.14em] text-steel uppercase">
        {term}
      </dt>
      <dd className="u-body mt-2">{detail}</dd>
    </div>
  );
}
