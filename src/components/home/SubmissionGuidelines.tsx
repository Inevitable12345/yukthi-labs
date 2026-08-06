import { CircleDashed, FileClock, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { registrationProcess } from "@/content/registration-fees";

/** Confirmed by the official conference poster — safe to state outright. */
const confirmed = [
  {
    title: "Presentation format",
    body: "Research papers are invited for oral presentation.",
  },
  {
    title: "Submission channel",
    body: "Registration and paper submission are completed online through the official conference link.",
  },
  {
    title: "Submission deadline",
    body: "September 5, 2026 is the last date for registration and submission of papers.",
  },
  {
    title: "Acceptance and payment",
    body: "September 10, 2026 is the last date for paper acceptance and payment.",
  },
  {
    title: "Scope",
    body: "Papers are invited across the twenty listed key areas, and on related themes.",
  },
  {
    title: "Review and publication",
    body: "Accepted papers, following peer review, will be considered for publication in the conference proceedings with ISBN.",
  },
];

/**
 * Deliberately unanswered. Inventing a word count, template or citation style
 * would send authors down the wrong path — these ship once the committee
 * confirms them.
 */
const awaiting = [
  "Eligibility criteria",
  "Paper length and word limit",
  "File format and template",
  "Citation and referencing style",
  "Originality requirements",
  "Plagiarism policy and threshold",
  "Abstract requirements",
  "Presentation rules and time limits",
  "Review criteria and timeline",
  "Camera-ready submission process",
];

export function SubmissionGuidelines() {
  return (
    <section
      id="guidelines"
      className="scroll-mt-28 bg-white py-20 lg:py-24"
      aria-labelledby="guidelines-heading"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Authors"
          title="Submission guidelines"
          lead="What is confirmed today, and what the organising committee is still finalising."
          align="center"
        />

        <Reveal delay={0.06} className="mx-auto mt-9 max-w-3xl">
          <div className="flex items-start gap-3 rounded-2xl border border-orange/30 bg-orange/8 px-5 py-4">
            <Info className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden="true" />
            <p className="text-[0.95rem] leading-relaxed text-ink">
              <strong className="font-semibold">In progress.</strong> Detailed
              formatting and policy rules are published only after the
              organising committee approves them. Nothing here is estimated — if
              a rule is not listed as confirmed, it has not yet been decided.
            </p>
          </div>
        </Reveal>

        <RevealGroup step={0.06} className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {confirmed.map((item) => (
            <RevealItem key={item.title} className="h-full">
              <article className="card-surface h-full border-l-4 border-l-emerald p-5">
                <h3 className="text-[1rem]">{item.title}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Process */}
        <Reveal delay={0.08} className="mt-14">
          <h3 className="text-center text-xl sm:text-2xl">
            Submitting your paper
          </h3>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {registrationProcess.map((item) => (
              <li key={item.step} className="rounded-2xl border border-line bg-surface p-5">
                <span className="font-display text-3xl font-extrabold text-line">
                  {String(item.step).padStart(2, "0")}
                </span>
                <h4 className="mt-1 text-[1rem]">{item.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Awaiting approval */}
        <Reveal delay={0.1} className="mt-14">
          <h3 className="text-center text-xl sm:text-2xl">
            Details still to be published
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-soft">
            These appear here as soon as the organising committee confirms them.
          </p>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {awaiting.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-[0.92rem] text-ink-soft"
              >
                <CircleDashed className="size-4 shrink-0 text-ink-soft/60" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="mt-10">
          <div className="rounded-2xl border border-line bg-surface-blue p-6 text-center">
            <p className="flex items-center justify-center gap-2 font-display text-base font-semibold text-deep">
              <FileClock className="size-5 text-royal" aria-hidden="true" />
              Need one of these details before you can submit?
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              Contact the organising secretaries directly — they can confirm
              requirements ahead of publication.
            </p>
            <div className="mt-5">
              <Button href="/contact" withArrow>
                Contact the organisers
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
