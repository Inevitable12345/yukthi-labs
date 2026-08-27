import { PageShell } from "@/components/layout/PageShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { EvidenceLibrary } from "@/components/evidence/EvidenceLibrary";
import { ClaimClassLegend } from "@/components/evidence/ClaimClassChip";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { evidenceCounts } from "@/data/evidence";
import { buildMetadata } from "@/lib/metadata/build-metadata";

const DESCRIPTION =
  "Every source behind every claim on this site, grouped by subject, with the claim it supports, what it does not say, its methodology and its verification status.";

export const metadata = buildMetadata({
  title: "Evidence",
  description: DESCRIPTION,
  path: "/evidence",
});

export default function EvidencePage() {
  return (
    <>
      <WebPageJsonLd name="Evidence" description={DESCRIPTION} path="/evidence" />

      <PageShell
        eyebrow="Evidence"
        title="Every claim on this site resolves to a source."
        lede={
          <>
            {evidenceCounts.total} records. {evidenceCounts.verified} checked against the cited
            publication; {evidenceCounts.needsVerification} not yet, and marked as such
            everywhere they appear — including here.
          </>
        }
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-24">
          <aside className="space-y-12">
            <div>
              <InstrumentLabel as="h2">The rules this library follows</InstrumentLabel>
              <ul className="mt-6 space-y-4">
                {[
                  "No claim is written that the named source does not support.",
                  "Figures keep the units, scenario conditions and hedges of the original. A range is never quoted as a point estimate.",
                  "Every record records what the figure does not say. A number without its limits is a misquotation.",
                  "Verification status is explicit. Unverified records are labelled rather than quietly omitted.",
                ].map((rule) => (
                  <li key={rule} className="u-body flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-steel-dim" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[color:var(--hairline)] pt-8">
              <InstrumentLabel as="h2">Epistemic classes</InstrumentLabel>
              <p className="u-body mt-4">
                Every claim on this site carries one of these, shown wherever it appears.
              </p>
              <ClaimClassLegend className="mt-6" />
            </div>
          </aside>

          <EvidenceLibrary />
        </div>
      </PageShell>
    </>
  );
}
