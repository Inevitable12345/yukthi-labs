import type { Metadata } from "next";
import { EvidenceLibrary } from "@/components/evidence/EvidenceLibrary";
import { JsonLd, pageSchema } from "@/components/layout/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { Hairline } from "@/components/ui/Hairline";
import { EVIDENCE } from "@/content/evidence";
import { CLAIM_CLASS_LABEL } from "@/lib/graph/types";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata: Metadata = buildMetadata({
  title: "Evidence",
  description:
    "Every source cited across the Yukthi Lab exhibition, with what each document reports, what it supports, and — separately — Yukthi's interpretation of it.",
  path: "/evidence",
});

export default function EvidencePage() {
  return (
    <>
      <PageShell
        coordinate="Yukthi / Evidence"
        title="Every source, in full"
        standfirst="What the document says and what Yukthi concludes from it are never allowed to share a paragraph. Each record keeps them apart."
      >
        <div className="max-w-[62rem]">
          <section aria-labelledby="standard-heading" className="mb-14">
            <h2 id="standard-heading" className="headline">
              The evidence standard
            </h2>
            <div className="prose-argument mt-6">
              <p>
                Four kinds of statement appear on this site, and they are never blurred: what a
                named source reports, what Yukthi infers from it, what an illustrative scenario
                shows, and what Yukthi intends to build. Every claim carries its class, and the
                class is printed next to the claim.
              </p>
              <p>
                Links are given only where a stable published address is known. Where one is not,
                the record names the publisher and document precisely enough to be located at
                source. A link that might rot into a 404 is worse than no link, and an invented link
                is not permitted at all.
              </p>
              <p>
                No figure appears anywhere on this site that its named source does not report. No
                probability is published, because Yukthi has not earned one. Where a number is an
                estimate by a third party rather than a measurement, the record says so.
              </p>
            </div>

            <ul className="mt-8 grid gap-px bg-graphite sm:grid-cols-2">
              {Object.entries(CLAIM_CLASS_LABEL).map(([key, label]) => (
                <li key={key} className="bg-void p-5">
                  <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-brass">
                    {label}
                  </p>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ash">
                    {
                      {
                        source: "Reported by the named organisation in the named document.",
                        interpretation:
                          "Yukthi's reading of one or more sources. Not the source's own conclusion.",
                        illustration:
                          "A worked example with chosen inputs. Never model output, never a forecast.",
                        ambition:
                          "What Yukthi intends to build. Not a description of what exists today.",
                      }[key as keyof typeof CLAIM_CLASS_LABEL]
                    }
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <Hairline className="mb-14" />

          <section aria-labelledby="library-heading">
            <h2 id="library-heading" className="headline">
              The library
            </h2>
            <p className="standfirst mt-4">
              {EVIDENCE.length} records, cited across twenty rooms and five pages.
            </p>
            <EvidenceLibrary className="mt-10" />
          </section>
        </div>
      </PageShell>

      <JsonLd
        schema={pageSchema(
          "Evidence",
          "The full evidence library behind the Yukthi Lab thesis.",
          "/evidence",
        )}
      />
    </>
  );
}
