import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpeakersShowcase } from "@/components/home/SpeakersShowcase";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Tentative List of Speakers",
  description:
    "Tentative list of speakers for ICRTET-2026, the 1st International Conference on Recent Trends in Educational Technology.",
  alternates: { canonical: "/speakers" },
};

export default function SpeakersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Speakers", path: "/speakers" }])} />

      <PageHeader
        eyebrow="Programme"
        title="Tentative list of speakers"
        lead="The speakers below are yet to be confirmed. Photographs, session titles and biographies are published as the programme is finalised."
        breadcrumbs={[{ name: "Speakers", path: "/speakers" }]}
      />

      <SpeakersShowcase heading={false} />

      <section className="bg-white py-12">
        <div className="container-page">
          <Reveal>
            <p className="mx-auto flex max-w-3xl items-start gap-2.5 rounded-xl border border-line bg-surface px-5 py-4 text-sm leading-relaxed text-ink-soft">
              <Info className="mt-0.5 size-4.5 shrink-0 text-royal" aria-hidden="true" />
              Photographs and biographies are published only once supplied and
              approved by the speakers and the organising committee.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
