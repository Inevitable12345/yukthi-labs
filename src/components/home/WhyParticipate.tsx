import {
  Handshake,
  MessagesSquare,
  Mic,
  Network,
  Sparkles,
  Telescope,
} from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const benefits = [
  {
    icon: Mic,
    title: "Present original research",
    body: "Share your work through an oral presentation in front of an international academic audience.",
    accent: "from-royal to-cyan",
  },
  {
    icon: Telescope,
    title: "Learn from experts",
    body: "Hear keynote sessions from senior academics working across educational technology and teacher education.",
    accent: "from-violet to-lilac",
  },
  {
    icon: Network,
    title: "Connect with researchers",
    body: "Meet scholars, faculty and educators from institutions across India and abroad.",
    accent: "from-magenta to-crimson",
  },
  {
    icon: Sparkles,
    title: "Explore emerging practice",
    body: "Examine new teaching, assessment and digital learning practices being adopted in classrooms today.",
    accent: "from-orange to-magenta",
  },
  {
    icon: MessagesSquare,
    title: "Receive peer feedback",
    body: "Submissions are reviewed by the conference committee, and presentations invite constructive academic discussion.",
    accent: "from-emerald to-cyan",
  },
  {
    icon: Handshake,
    title: "Build collaborations",
    body: "Begin academic and institutional partnerships that continue well beyond the two days of the conference.",
    accent: "from-cyan to-royal",
  },
];

export function WhyParticipate() {
  return (
    <section
      id="why-participate"
      className="relative overflow-hidden bg-surface py-20 lg:py-28"
      aria-labelledby="why-heading"
    >
      {/* Quiet decorative wash — no motion behind the text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-60 mask-fade"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Why Participate"
          title="What delegates take away from ICRTET-2026"
          lead="The conference is built around presentation, discussion and collaboration — for students taking a first step into research as much as for established faculty."
          align="center"
        />

        <RevealGroup
          step={0.07}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5"
        >
          {benefits.map((benefit) => (
            <RevealItem key={benefit.title} className="h-full">
              <article className="card-surface group relative h-full overflow-hidden p-6">
                {/* Gradient edge that lights up on hover */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${benefit.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <span
                  className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${benefit.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <benefit.icon className="size-6" aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-[1.15rem]">{benefit.title}</h3>
                <p className="mt-2 text-[0.94rem] leading-relaxed text-ink-soft">
                  {benefit.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
