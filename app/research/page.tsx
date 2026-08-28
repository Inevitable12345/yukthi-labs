import type { Metadata } from "next";
import { CausalDiagram } from "@/components/causal/CausalDiagram";
import { EvidenceRack } from "@/components/evidence/EvidenceRack";
import { JsonLd, pageSchema } from "@/components/layout/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { ClaimBadge } from "@/components/ui/ClaimBadge";
import { Hairline } from "@/components/ui/Hairline";
import { CONVERGENCE_GRAPH, FEEDBACK_GRAPH } from "@/content/scenarios";
import { PROOF_QUESTIONS } from "@/content/thesis";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Case studies behind the Yukthi Lab thesis, the open research questions the approach has to answer, and the empirical standard it will be judged against.",
  path: "/research",
});

const OPEN_QUESTIONS = [
  {
    title: "Structure induction from evidence",
    question:
      "How reliably can a causal relation — with a stated mechanism — be induced from unstructured public evidence, and how is a spurious relation detected before it propagates?",
    why: "This is the hardest technical problem in the approach. A world model that accretes plausible-looking edges is worse than no model, because it lends false structure to a decision.",
  },
  {
    title: "Scope selection",
    question:
      "Given a decision, which nodes belong inside the boundary? What is the cost of a boundary drawn too tightly, versus one drawn so widely that the model is unusable?",
    why: "Scoping is what makes the problem tractable. It is also where the model can be most wrong while looking most confident.",
  },
  {
    title: "Calibration without abundant outcomes",
    question:
      "Consequential structural breaks are rare by construction. How is a forecasting system calibrated against a small number of realised events without overfitting to them?",
    why: "The second proof question below cannot be answered honestly until this one is.",
  },
  {
    title: "Evidence conflict",
    question:
      "When two credible sources support incompatible relations, what does the model do — and how is that resolution shown to the person relying on it?",
    why: "Hiding the conflict would forfeit the reason to trust the structure at all.",
  },
  {
    title: "Measuring earliness",
    question:
      "What is the counterfactual against which 'identified earlier' is measured, and who decides it?",
    why: "Without a defensible baseline, the first proof question is unfalsifiable — and an unfalsifiable claim is not a claim.",
  },
];

const CASES = [
  {
    id: "uri",
    title: "February 2021 — coupled failure in electricity and gas",
    graph: FEEDBACK_GRAPH,
    finding:
      "The joint FERC/NERC inquiry documented generation outages and gas production declines occurring together, with loss of power to gas infrastructure contributing to further reductions in gas available to generators.",
    reading:
      "The severity was produced by the coupling rather than by either sector's own fragility. Two sector-specific monitoring systems would each have seen a difficult but survivable problem.",
    evidenceIds: ["ferc-nerc-uri"],
  },
  {
    id: "convergence",
    title: "Compute, electricity and materials — a live convergence",
    graph: CONVERGENCE_GRAPH,
    finding:
      "The IEA reports data centre, AI and crypto electricity use at an estimated 460 TWh in 2022 with a projection above 1,000 TWh by 2026, alongside grid investment that is not keeping pace and lengthening equipment lead times.",
    reading:
      "No individual domain model here is wrong. The system-level question — whether compute capacity, grid capacity and material supply can be reconciled on the same timeline — is simply not any of theirs.",
    evidenceIds: ["iea-electricity-2024", "iea-grids", "iea-critical-minerals-outlook"],
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageShell
        coordinate="Yukthi / Research"
        title="Case studies and open questions"
        standfirst="Two structures worked through in full, and the five questions the approach has to answer before it deserves to be believed."
      >
        <div className="max-w-[64rem] space-y-16">
          <section aria-labelledby="cases-heading">
            <h2 id="cases-heading" className="headline">
              Case studies
            </h2>

            <div className="mt-10 space-y-16">
              {CASES.map((study) => (
                <article key={study.id} aria-labelledby={`case-${study.id}`}>
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="label">Case study</p>
                    <ClaimBadge claim="source" />
                  </div>
                  <h3 id={`case-${study.id}`} className="headline mt-4 text-[1.6rem]">
                    {study.title}
                  </h3>

                  <dl className="mt-6 space-y-4">
                    <div>
                      <dt className="label-dim">What the source reports</dt>
                      <dd className="mt-2 max-w-[62ch] text-[0.92rem] leading-relaxed text-bone/88">
                        {study.finding}
                      </dd>
                    </div>
                    <div>
                      <dt className="label-dim">Yukthi&rsquo;s reading</dt>
                      <dd className="mt-2 max-w-[62ch] text-[0.92rem] leading-relaxed text-ash">
                        {study.reading}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8">
                    <CausalDiagram graph={study.graph} />
                  </div>

                  <EvidenceRack className="mt-8" evidenceIds={study.evidenceIds} />
                </article>
              ))}
            </div>
          </section>

          <Hairline />

          <section aria-labelledby="questions-heading">
            <h2 id="questions-heading" className="headline">
              Open research questions
            </h2>
            <p className="standfirst mt-4 max-w-[54ch]">
              These are unresolved. Publishing them is not modesty — it is the only way the proof
              questions below stay meaningful.
            </p>

            <ol className="mt-10 grid gap-px bg-graphite">
              {OPEN_QUESTIONS.map((item, index) => (
                <li key={item.title} className="bg-void p-6 sm:p-7">
                  <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-brass">
                    {(index + 1).toString().padStart(2, "0")} · {item.title}
                  </p>
                  <p className="mt-3 max-w-[62ch] font-display text-[1.05rem] leading-relaxed">
                    {item.question}
                  </p>
                  <p className="mt-3 max-w-[62ch] text-[0.86rem] leading-relaxed text-ash">
                    {item.why}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <Hairline />

          <section aria-labelledby="standard-heading">
            <h2 id="standard-heading" className="headline">
              The empirical standard
            </h2>
            <ol className="mt-8 space-y-4">
              {PROOF_QUESTIONS.map((question, index) => (
                <li key={question} className="flex gap-4">
                  <span className="font-mono text-[0.72rem] text-brass-dim">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="font-display text-[1.15rem] leading-snug">{question}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </PageShell>

      <JsonLd
        schema={pageSchema(
          "Research",
          "Case studies, open research questions and the empirical standard.",
          "/research",
        )}
      />
    </>
  );
}
