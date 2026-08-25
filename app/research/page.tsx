import { ArchitectureFlow } from "@/components/architecture/ArchitectureFlow";
import { PageShell, Section } from "@/components/layout/PageShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ActionLink } from "@/components/ui/ActionLink";
import { Hairline } from "@/components/ui/Hairline";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { researchEntries } from "@/content/research/registry";

export const metadata = buildMetadata({
  title: "Research",
  description:
    "Technical notes, experiments, evaluations and benchmarks from Yukthi Lab. Nothing is published here that has not been produced.",
  path: "/research",
});

const PLANNED = [
  {
    index: "01",
    title: "Causal structure induction from source documents",
    detail:
      "Whether a mechanism can be distinguished from a correlation that has held so far, using published material as the only input. The central open problem in layer 04.",
  },
  {
    index: "02",
    title: "Calibration under structural change",
    detail:
      "Base rates drawn from a previous regime are the wrong prior for the transition out of it. What replaces them, and how the replacement is scored.",
  },
  {
    index: "03",
    title: "Trace explosion beyond three causal steps",
    detail:
      "The number of admissible paths grows faster than any of them can be justified. Which pruning rules preserve the consequential paths.",
  },
  {
    index: "04",
    title: "Detecting a broken edge before an outcome moves",
    detail:
      "A relation can break while every node it connects still looks unchanged. What observable fires, and at what false-positive rate.",
  },
];

export default function ResearchPage() {
  const hasEntries = researchEntries.length > 0;

  return (
    <>
      <WebPageJsonLd
        name="Research"
        description="Research output from Yukthi Lab."
        path="/research"
      />
      <PageShell
        eyebrow="00 / research"
        title="Research in progress."
        lede="This page lists technical notes, experiments, evaluations and benchmark results. It is empty because none have been produced yet — not because none are planned."
      >
        {hasEntries ? (
          <Section index="01 / output" title="Published">
            <ol>
              {researchEntries.map((entry) => (
                <li key={entry.slug}>
                  <Hairline />
                  <div className="py-8">
                    <InstrumentLabel tone="gold">{entry.kind}</InstrumentLabel>
                    <h3 className="u-display-3 mt-3 text-bone">{entry.title}</h3>
                    <p className="u-body mt-3 max-w-2xl">{entry.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        ) : (
          <Section index="01 / status" title="Nothing published yet">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-24">
              <div>
                <p className="u-lede u-measure">
                  A research page with nothing on it is more informative than a research page
                  with placeholder papers on it. When there is a result, it will appear here
                  with the method that produced it, the data it was run on, and the conditions
                  under which it would not replicate.
                </p>

                <div className="mt-16">
                  <InstrumentLabel as="h3" tone="gold">
                    The questions being worked on
                  </InstrumentLabel>
                  <ol className="mt-8">
                    {PLANNED.map((item) => (
                      <li key={item.index}>
                        <Hairline />
                        <div className="flex gap-6 py-6">
                          <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">
                            {item.index}
                          </span>
                          <span>
                            <span className="block text-[0.9375rem] leading-snug text-bone">
                              {item.title}
                            </span>
                            <span className="mt-2 block max-w-xl text-[0.875rem] leading-relaxed text-muted-bone">
                              {item.detail}
                            </span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <Hairline />
                </div>

                <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
                  <ActionLink href="/architecture">The open problems, by layer</ActionLink>
                  <ActionLink href="/field-notes">Field notes</ActionLink>
                </div>
              </div>

              <div className="border-l border-[color:var(--hairline)] pl-8 lg:pl-12">
                <ArchitectureFlow />
              </div>
            </div>
          </Section>
        )}
      </PageShell>
    </>
  );
}
