import { PageShell } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ActionLink } from "@/components/ui/ActionLink";
import { buildMetadata } from "@/lib/metadata/build-metadata";

const DESCRIPTION =
  "The open problems Yukthi has to solve, the four proof questions it expects to be held to, and the failure modes it is most worried about.";

export const metadata = buildMetadata({
  title: "Research",
  description: DESCRIPTION,
  path: "/research",
});

const OPEN_PROBLEMS = [
  {
    title: "Causal discovery from unstructured evidence",
    problem:
      "Extracting entities and relations from documents is tractable. Determining that a relation is causal rather than merely reported is not.",
    approach:
      "Treat extraction and causal commitment as separate steps with separate evidence requirements, and keep alternative readings attached to the relation rather than discarding them at extraction time.",
    risk: "The failure mode is a confident graph full of associations wearing the label 'mechanism'.",
  },
  {
    title: "Scope selection",
    problem:
      "A scope that is too narrow misses the pathway that matters. A scope that is too wide is intractable and produces answers nobody can audit.",
    approach:
      "Expand scope until the answer stops changing, then stop — and record where the boundary was drawn so the omission is visible rather than silent.",
    risk: "Boundaries are where surprises live. A scope justified after the fact is not a method.",
  },
  {
    title: "Calibration under structural change",
    problem:
      "Calibration is measured against resolved outcomes, which means it is measured against the past — the exact regime whose persistence is in question.",
    approach:
      "Score calibration separately within stable periods and across known breaks, and treat degradation across breaks as the metric that matters.",
    risk: "A system that is well-calibrated in stable periods and no better than incumbents at breaks has not solved the problem it exists for.",
  },
  {
    title: "Structural revision without thrash",
    problem:
      "Re-map is the distinguishing step, and it is also the dangerous one: a model that revises its structure on every contradicting observation is noise-fitting at a higher level of abstraction.",
    approach:
      "Require evidence to be persistent and mechanism-bearing before structure changes, and version the graph so revisions can be reviewed and reversed.",
    risk: "Both directions fail. Too rigid and it is an extrapolative model with extra steps; too fluid and it has no memory.",
  },
  {
    title: "Evaluation against incumbents",
    problem:
      "The honest comparison is not against a naive baseline but against what a well-resourced team already does — which is usually good.",
    approach:
      "Evaluate on decisions where the incumbent process is documented and its output is recorded at the time, so hindsight cannot leak into the comparison.",
    risk: "Retrospective evaluation is where causal systems most easily fool themselves and their builders.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <WebPageJsonLd name="Research" description={DESCRIPTION} path="/research" />

      <PageShell
        eyebrow="Research"
        title="What Yukthi has to prove."
        lede={
          <>
            These are the open problems, stated as problems. A page of solved challenges would
            be less useful and less true.
          </>
        }
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-24">
          <div>
            <InstrumentLabel as="h2" tone="gold">
              Open problems
            </InstrumentLabel>

            <ol className="mt-10 space-y-16">
              {OPEN_PROBLEMS.map((item, index) => (
                <li key={item.title}>
                  <article>
                    <InstrumentLabel className="tabular-nums" tone="steel">
                      {String(index + 1).padStart(2, "0")}
                    </InstrumentLabel>
                    <h3 className="u-display-3 mt-4 text-bone">{item.title}</h3>

                    <dl className="mt-6 space-y-5">
                      <div>
                        <dt className="u-instrument">The problem</dt>
                        <dd className="u-body mt-2">{item.problem}</dd>
                      </div>
                      <div>
                        <dt className="u-instrument">Current approach</dt>
                        <dd className="u-body mt-2">{item.approach}</dd>
                      </div>
                      <div>
                        <dt className="u-instrument text-rupture">The failure mode</dt>
                        <dd className="u-body mt-2">{item.risk}</dd>
                      </div>
                    </dl>
                  </article>
                </li>
              ))}
            </ol>
          </div>

          <aside className="space-y-12">
            <div className="border border-gold-dim p-8">
              <InstrumentLabel as="h2" tone="gold">
                The four proof questions
              </InstrumentLabel>
              <ol className="mt-8 space-y-6">
                {[
                  "Did the system identify consequential risks earlier?",
                  "Were its probabilities better calibrated?",
                  "Did it reveal causal pathways existing systems missed?",
                  "Could the user intervene before the loss occurred?",
                ].map((question, index) => (
                  <li key={question} className="flex gap-4">
                    <InstrumentLabel tone="gold" className="tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </InstrumentLabel>
                    <span className="font-display text-[1.125rem] leading-snug font-light text-bone">
                      {question}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-[color:var(--hairline)] pt-8">
              <Prose>
                <h3>Collaboration</h3>
                <p>
                  Yukthi is interested in conversations with people who have the 3 a.m. problem
                  and the data to test against it — particularly where an incumbent process is
                  documented well enough to make an honest comparison possible.
                </p>
              </Prose>
              <ActionLink href="/contact" tone="gold" className="mt-8">
                Talk to Yukthi
              </ActionLink>
            </div>
          </aside>
        </div>
      </PageShell>
    </>
  );
}
