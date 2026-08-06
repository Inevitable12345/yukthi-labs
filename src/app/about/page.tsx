import type { Metadata } from "next";
import Link from "next/link";
import { BookMarked, GraduationCap, Globe2, Layers, Mic, MonitorPlay, Target, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { AtAGlance } from "@/components/ui/AtAGlance";
import { conference } from "@/content/conference";
import { keyAreas } from "@/content/key-areas";
import { scsvmv, tnteu } from "@/content/institutions";
import { breadcrumbSchema } from "@/lib/structured-data";
import { slideInLeft, slideInRight } from "@/lib/motion";

export const metadata: Metadata = {
  title: "About ICRTET-2026",
  description:
    "About the 1st International Conference on Recent Trends in Educational Technology — theme, objectives, intended participants and hybrid conference format.",
  alternates: { canonical: "/about" },
};

const objectives = [
  {
    icon: Target,
    title: "Examine current practice",
    body: "Bring together evidence on how educational technologies are being used in classrooms, teacher education and higher education today.",
  },
  {
    icon: Users,
    title: "Create a research platform",
    body: "Give students, scholars and faculty a venue to present original work through oral presentation and receive academic feedback.",
  },
  {
    icon: Globe2,
    title: "Encourage collaboration",
    body: "Connect participants across institutions and countries so research partnerships continue after the conference.",
  },
  {
    icon: GraduationCap,
    title: "Support teacher development",
    body: "Share approaches to professional development, digital pedagogy and inclusive practice that educators can apply directly.",
  },
];

const audiences = [
  "University students",
  "PhD scholars",
  "Researchers",
  "Faculty members",
  "Teacher educators",
  "School and college administrators",
  "Educational technology specialists",
  "Government education representatives",
  "EdTech professionals",
  "Industry professionals",
  "International delegates",
  "Academic publishers",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />

      <PageHeader
        eyebrow="About the Conference"
        title="About ICRTET-2026"
        lead={`${conference.ordinal} on ${conference.title}, organised by the School of Education, SCSVMV, in association with TNTEU.`}
        breadcrumbs={[{ name: "About", path: "/about" }]}
      />

      {/* Overview */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal variants={slideInLeft}>
            <div className="prose-page">
              <p className="eyebrow mb-3">
                <span aria-hidden="true" className="inline-block h-px w-7 bg-royal/50" />
                Overview
              </p>
              <h2 className="text-3xl sm:text-4xl">
                Educational technology, examined by the people who use it
              </h2>
              <p className="mt-5">
                {conference.acronym} is a two-day international conference on
                recent trends in educational technology, held on{" "}
                {conference.dates.label} at Sri Chandrasekharendra Saraswathi
                Viswa Mahavidyalaya, Kanchipuram.
              </p>
              <p>
                The conference invites research papers for oral presentation
                across {keyAreas.length} key areas, spanning artificial
                intelligence in education, digital pedagogy, assessment,
                inclusive education, smart classrooms and 21st-century skills.
              </p>
              <p>
                It is organised by the School of Education, SCSVMV, in
                association with Tamil Nadu Teachers Education University,
                Chennai — bringing together a deemed university and a
                specialist teacher education university around a shared agenda.
              </p>
            </div>
          </Reveal>

          <Reveal variants={slideInRight} delay={0.08}>
            <AtAGlance />
          </Reveal>
        </div>
      </section>

      {/* Theme */}
      <section className="bg-deep py-16 text-white lg:py-20">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4 justify-center text-cyan">
              <span aria-hidden="true" className="inline-block h-px w-7 bg-cyan/70" />
              Conference Theme
            </p>
            <p className="font-serif text-2xl leading-relaxed text-white sm:text-3xl">
              Recent Trends in Educational Technology
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {conference.taglines.map((tagline) => (
                <span
                  key={tagline}
                  className="font-display text-sm font-semibold tracking-wide text-cyan sm:text-base"
                >
                  {tagline}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Objectives"
            title="What the conference sets out to do"
            align="center"
          />

          <RevealGroup step={0.08} className="mt-12 grid gap-4 sm:grid-cols-2">
            {objectives.map((objective) => (
              <RevealItem key={objective.title} className="h-full">
                <article className="card-surface h-full p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-surface-blue text-royal">
                    <objective.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[1.1rem]">{objective.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">
                    {objective.body}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Scope of the conference */}
      <section id="scope" className="scroll-mt-28 bg-surface py-16 lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Scope"
              title="Scope of the conference"
              className="max-w-none"
            />
            <div className="prose-page mt-5">
              <p>
                ICRTET-2026 covers research and practice across{" "}
                {keyAreas.length} key areas of educational technology — from
                artificial intelligence in education, digital pedagogy and
                assessment through to inclusive education, smart classrooms,
                guidance and counselling, and 21st-century skills.
              </p>
              <p>
                Papers are invited for oral presentation from students, PhD
                scholars, faculty, teacher educators, researchers and industry
                professionals. Work on related themes that fall outside the
                listed areas is welcome under &ldquo;Other Related
                Themes&rdquo;.
              </p>
              <p>
                The conference is international in scope and conducted in hybrid
                mode, so delegates may present on the SCSVMV campus at
                Kanchipuram or take part online. Both modes share the same
                registration categories, submission deadline and review process.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/registration#key-areas" withArrow>
                Browse the key areas
              </Button>
              <Button href="/registration" variant="outline">
                Call for papers
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2">
            <div className="card-surface p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-royal to-violet text-white">
                <Layers className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[1.05rem]">Research scope</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {keyAreas.length} key areas spanning pedagogy, technology,
                assessment, inclusion and educational leadership.
              </p>
            </div>
            <div className="card-surface p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-magenta to-crimson text-white">
                <Mic className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[1.05rem]">Presentation</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Papers are invited for oral presentation, reviewed by the
                conference committee.
              </p>
            </div>
            <div className="card-surface p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-emerald to-cyan text-white">
                <MonitorPlay className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[1.05rem]">Hybrid participation</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Attend in person at Enathur, Kanchipuram, or join the sessions
                online from anywhere.
              </p>
            </div>
            <div className="card-surface p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-orange to-magenta text-white">
                <BookMarked className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[1.05rem]">Publication</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Accepted papers are considered, after peer review, for the
                conference proceedings with ISBN.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Intended participants */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Intended Participants"
            title="Who the conference is for"
            lead="ICRTET-2026 is open to anyone working on, teaching with, or researching educational technology."
            align="center"
          />

          <RevealGroup
            step={0.03}
            className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5"
          >
            {audiences.map((audience) => (
              <RevealItem key={audience}>
                <span className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-royal/40 hover:bg-surface-blue hover:text-royal">
                  {audience}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Host institutions */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Host Institutions"
            title="Organised by SCSVMV, in association with TNTEU"
            align="center"
          />

          <RevealGroup step={0.1} className="mt-12 grid gap-5 lg:grid-cols-2">
            {[scsvmv, tnteu].map((institution) => (
              <RevealItem key={institution.id} className="h-full">
                <article className="card-surface flex h-full flex-col p-6 lg:p-7">
                  <span className="inline-flex w-fit rounded-full bg-surface-blue px-3 py-1 text-xs font-semibold text-royal">
                    {institution.role}
                  </span>
                  <h3 className="mt-4 text-xl">{institution.name}</h3>
                  {institution.accreditation && (
                    <p className="mt-1.5 text-sm text-ink-soft">
                      {institution.accreditation}
                    </p>
                  )}
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {institution.description}
                  </p>
                  <p className="mt-3 text-sm text-ink-soft">
                    {institution.address}
                  </p>
                  <div className="mt-auto pt-6">
                    <Link
                      href={`/about/${institution.id}`}
                      className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-royal underline-offset-4 hover:underline"
                    >
                      More about {institution.shortName} →
                    </Link>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
