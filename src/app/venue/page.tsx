import type { Metadata } from "next";
import { Accessibility, Bus, MapPin, Plane, TrainFront } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { conference } from "@/content/conference";
import { scsvmv } from "@/content/institutions";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Venue",
  description:
    "ICRTET-2026 is held at Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya, Enathur, Kanchipuram, Tamil Nadu — 631561, with online participation also available.",
  alternates: { canonical: "/venue" },
};

/**
 * Travel guidance is written at a level the poster supports — the venue address
 * and the well-known transport hubs serving Kanchipuram. Distances, timings and
 * shuttle arrangements are left to the organising committee.
 */
const travel = [
  {
    icon: TrainFront,
    title: "By rail",
    body: "Kanchipuram railway station is the nearest station to the campus. Chengalpattu and Arakkonam junctions serve wider rail connections.",
  },
  {
    icon: Bus,
    title: "By road",
    body: "Kanchipuram is connected by state and private bus services from Chennai, Vellore and Bengaluru. Taxis and auto-rickshaws serve the Enathur campus.",
  },
  {
    icon: Plane,
    title: "By air",
    body: "Chennai International Airport is the nearest airport, with onward road connections to Kanchipuram.",
  },
];

export default function VenuePage() {
  const mapSrc = `https://www.google.com/maps?q=${conference.location.mapEmbedQuery}&output=embed`;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Venue", path: "/venue" }])} />

      <PageHeader
        eyebrow="Venue"
        title="Where ICRTET-2026 takes place"
        lead={`${scsvmv.name}, ${scsvmv.address}. Online participation is available for delegates joining remotely.`}
        breadcrumbs={[{ name: "Venue", path: "/venue" }]}
      />

      {/* Address + map */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="Address"
              title="SCSVMV campus, Enathur"
              className="max-w-none"
            />

            <address className="mt-6 not-italic">
              <p className="flex items-start gap-3 text-[1.02rem] leading-relaxed text-ink">
                <MapPin className="mt-1 size-5 shrink-0 text-royal" aria-hidden="true" />
                <span>
                  <strong className="block font-semibold text-deep">
                    {scsvmv.name}
                  </strong>
                  {conference.location.streetAddress}
                  <br />
                  {conference.location.state}, {conference.location.country} –{" "}
                  {conference.location.postalCode}
                </span>
              </p>
            </address>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href={`https://www.google.com/maps/search/?api=1&query=${conference.location.mapEmbedQuery}`}
                external
                variant="outline"
                withArrow
              >
                Open in Google Maps
              </Button>
              <Button href="/contact" variant="ghost" withArrow>
                Ask about travel
              </Button>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                <Accessibility className="mt-0.5 size-4.5 shrink-0 text-royal" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-deep">Accessibility.</strong>{" "}
                  If you need step-free access, assistance on campus, or any
                  other accommodation, please contact the organising secretaries
                  in advance so arrangements can be made.
                </span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-2xl border border-line shadow-[0_24px_60px_-40px_rgba(9,43,114,0.8)]">
              <iframe
                title="Map showing the SCSVMV campus at Enathur, Kanchipuram"
                src={mapSrc}
                className="h-[22rem] w-full border-0 lg:h-[30rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              Map data © Google. Please confirm the exact venue building with the
              organising committee closer to the conference.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Travel */}
      <section className="bg-surface py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Getting There"
            title="Travel guidance"
            lead="Detailed directions, distances and any campus shuttle arrangements are published by the organising committee closer to the conference."
            align="center"
          />

          <RevealGroup step={0.08} className="mt-10 grid gap-4 sm:grid-cols-3">
            {travel.map((option) => (
              <RevealItem key={option.title} className="h-full">
                <article className="card-surface h-full p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-surface-blue text-royal">
                    <option.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[1.05rem]">{option.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
                    {option.body}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-dashed border-line bg-white px-5 py-4 text-center text-sm leading-relaxed text-ink-soft">
              Accommodation guidance for outstation delegates will be published
              here once the organising committee confirms the arrangements.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
