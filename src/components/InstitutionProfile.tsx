import { ExternalLink, FileClock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import type { Institution } from "@/content/institutions";

/**
 * Shared profile layout for SCSVMV and TNTEU.
 *
 * Only the facts printed on the conference poster are stated outright.
 * Everything else sits behind a visible "awaiting approved copy" notice rather
 * than being filled with plausible-sounding institutional history.
 */
export function InstitutionProfile({
  institution,
  breadcrumbs,
  sections,
}: {
  institution: Institution;
  breadcrumbs: { name: string; path: string }[];
  /** Headings the university is expected to supply copy for. */
  sections: string[];
}) {
  return (
    <>
      <PageHeader
        eyebrow={institution.role}
        title={institution.name}
        lead={institution.accreditation}
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <Reveal className="prose-page">
              <h2 className="!mt-0">Overview</h2>
              <p>{institution.description}</p>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <div className="rounded-2xl border border-dashed border-line bg-surface p-6">
                <p className="flex items-center gap-2.5 font-display font-semibold text-deep">
                  <FileClock className="size-5 shrink-0 text-royal" aria-hidden="true" />
                  Full institutional profile awaited
                </p>
                <p className="mt-2.5 leading-relaxed text-ink-soft">
                  The sections below will be published once{" "}
                  {institution.shortName} supplies its official profile text.
                  Institutional descriptions are not drafted on the
                  university&rsquo;s behalf.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {sections.map((section) => (
                    <li
                      key={section}
                      className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-ink-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 rounded-full bg-royal/40"
                      />
                      {section}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Facts panel */}
          <Reveal delay={0.1}>
            <div className="sticky top-28 rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-lg">At a glance</h2>

              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Role in ICRTET-2026
                  </dt>
                  <dd className="mt-1 font-medium text-deep">{institution.role}</dd>
                </div>

                {institution.accreditation && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink">
                      {institution.accreditation}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Address
                  </dt>
                  <dd className="mt-1 flex items-start gap-2 text-sm leading-relaxed text-ink">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-royal" aria-hidden="true" />
                    {institution.address}
                  </dd>
                </div>
              </dl>

              {institution.website && (
                <div className="mt-6">
                  <Button
                    href={institution.website}
                    external
                    variant="outline"
                    className="w-full"
                    icon={<ExternalLink className="size-4" aria-hidden="true" />}
                  >
                    Official website
                  </Button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
