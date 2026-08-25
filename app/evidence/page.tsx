import { EvidenceLibrary } from "@/components/evidence/EvidenceLibrary";
import { PageShell, Section } from "@/components/layout/PageShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { Prose } from "@/components/layout/Prose";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { evidenceCounts } from "@/data/evidence";

export const metadata = buildMetadata({
  title: "Evidence",
  description:
    "The complete source record behind every claim on this site, with each record's verification status stated explicitly.",
  path: "/evidence",
});

export default function EvidencePage() {
  return (
    <>
      <WebPageJsonLd
        name="Evidence"
        description="The source record behind every claim on the Yukthi Lab site."
        path="/evidence"
      />
      <PageShell
        eyebrow="00 / evidence"
        title="Every claim, and where it came from."
        lede="This is the whole record. Nothing on this site cites a source that is not here, and nothing here hides how well it has been checked."
        aside={
          <dl className="grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-4">
            <div>
              <InstrumentLabel as="dt">Records</InstrumentLabel>
              <dd className="mt-1 font-mono text-[1.25rem] text-bone tabular-nums">
                {evidenceCounts.total}
              </dd>
            </div>
            <div>
              <InstrumentLabel as="dt">Verified</InstrumentLabel>
              <dd className="mt-1 font-mono text-[1.25rem] text-steel tabular-nums">
                {evidenceCounts.verified}
              </dd>
            </div>
            <div>
              <InstrumentLabel as="dt">Unverified</InstrumentLabel>
              <dd className="mt-1 font-mono text-[1.25rem] text-gold tabular-nums">
                {evidenceCounts.needsVerification}
              </dd>
            </div>
          </dl>
        }
      >
        <Section index="01 / method" title="What the statuses mean">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <Prose>
              <h2>Verified</h2>
              <p>
                The claim has been checked against the cited publication, and the wording here
                preserves the original&rsquo;s units, scenario conditions and hedges. A range is
                never reported as a point estimate.
              </p>

              <h2>Needs verification</h2>
              <p>
                The claim is recorded from a secondary summary and the primary document has not
                yet been read end to end. It is shown, with this label, wherever it is cited. It
                is not quietly promoted and it is not quietly dropped.
              </p>

              <h2>Illustrative</h2>
              <p>
                Not a factual claim at all — a mechanism drawn to explain how something could
                propagate. Any diagram built from illustrative material carries a badge saying
                so where it appears.
              </p>
            </Prose>

            <Prose>
              <h2>Rules this file is written under</h2>
              <p>
                No claim is written that a named source does not support. No URL is written that
                was not visited. Where no stable link exists, the record says{" "}
                <em>no stable link recorded</em> rather than inventing one.
              </p>
              <p>
                Every record carries an <code>accessedAt</code> date. That records when the
                source was last checked, not when it was published — a source can move, and a
                citation that was true last year is not automatically true now.
              </p>
              <p>
                Where a record supports a claim about the future, its context field states the
                scenario conditions attached to it in the original. The IEA&rsquo;s USD 6.5
                trillion figure, for instance, measures activity <em>exposed</em> under full
                implementation of export controls. It is not a loss, and this site never renders
                it as one.
              </p>
            </Prose>
          </div>
        </Section>

        <Section index="02 / library" title="The library">
          <EvidenceLibrary />
        </Section>
      </PageShell>
    </>
  );
}
