import { BookOpen, Download, Globe2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AtAGlance } from "@/components/ui/AtAGlance";
import { conference } from "@/content/conference";
import { keyAreas } from "@/content/key-areas";
import { speakers } from "@/content/speakers";
import { totalCommitteeMembers } from "@/content/committees";
import { slideInLeft, slideInRight } from "@/lib/motion";

const stats = [
  { value: keyAreas.length, suffix: "", label: "Key research areas", icon: BookOpen },
  { value: 2, suffix: "", label: "Days of sessions", icon: Globe2 },
  { value: speakers.length, suffix: "", label: "Tentative speakers", icon: Users },
  { value: totalCommitteeMembers, suffix: "+", label: "Committee members", icon: Users },
];

export function AboutPreview() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
      aria-labelledby="about-heading"
    >
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Facts, not decoration */}
          <Reveal variants={slideInLeft} className="order-2 lg:order-1">
            <AtAGlance />
          </Reveal>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About the Conference"
              title={
                <>
                  A shared platform for{" "}
                  <span className="text-gradient">educational technology</span>{" "}
                  research and practice
                </>
              }
              className="max-w-none"
            />

            <Reveal variants={slideInRight} delay={0.08} className="mt-6 space-y-4">
              <p className="text-[1.02rem] leading-relaxed text-ink-soft">
                {conference.acronym} brings together researchers, teacher
                educators, scholars and technology professionals to examine how
                current educational technologies are reshaping teaching,
                learning and assessment.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-ink-soft">
                The conference is organised by the School of Education, Sri
                Chandrasekharendra Saraswathi Viswa Mahavidyalaya, in
                association with Tamil Nadu Teachers Education University,
                Chennai. It is conducted in {conference.mode.toLowerCase()}, so
                delegates may present in person at Kanchipuram or join online
                from anywhere.
              </p>
              <p className="text-[1.02rem] leading-relaxed text-ink-soft">
                Papers are invited across twenty key areas, from artificial
                intelligence in education and digital pedagogy to inclusive
                education, assessment and 21st-century skills.
              </p>
            </Reveal>

            <Reveal delay={0.14} className="mt-7 flex flex-wrap gap-3">
              <Button href="/about" withArrow>
                Read More
              </Button>
              <Button
                href={conference.links.brochure}
                variant="outline"
                icon={<Download className="size-4" aria-hidden="true" />}
              >
                Download Brochure
              </Button>
            </Reveal>
          </div>
        </div>

        {/* Stat band */}
        <Reveal delay={0.1} className="mt-16 lg:mt-20">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white px-5 py-7 text-center transition-colors hover:bg-surface-blue"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="block font-display text-3xl font-extrabold text-gradient sm:text-4xl"
                  />
                  <span className="mt-1.5 block text-[0.82rem] font-medium text-ink-soft">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
