import { AlertTriangle, CheckCircle2, GraduationCap, Globe2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  feeDisclaimer,
  registrationFees,
  registrationProcess,
} from "@/content/registration-fees";
import { cn } from "@/lib/utils";

const icons = {
  students: GraduationCap,
  "scholars-faculty-industry": Users,
  "foreign-delegates": Globe2,
} as const;

export function FeesSection({
  heading = true,
  /** Off on /registration, where SubmissionGuidelines already covers the steps. */
  showProcess = true,
  /** Where "Register Now" points — the official form when already on /registration. */
  ctaHref = "/registration",
}: {
  heading?: boolean;
  showProcess?: boolean;
  ctaHref?: string;
}) {
  return (
    <section
      id="fees"
      className="relative bg-surface py-20 lg:py-28"
      aria-labelledby="fees-heading"
    >
      <div className="container-page">
        {heading && (
          <SectionHeading
            eyebrow="Registration"
            title="Registration categories"
            lead="One fee per delegate category, payable on or before September 10, 2026."
            align="center"
          />
        )}

        <RevealGroup step={0.09} className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {registrationFees.map((fee) => {
            const Icon = icons[fee.id as keyof typeof icons] ?? Users;

            return (
              <RevealItem key={fee.id} className="h-full">
                <article
                  className={cn(
                    "card-surface relative flex h-full flex-col p-6 lg:p-7",
                    fee.featured && "border-royal/35 shadow-[0_20px_50px_-30px_rgba(18,71,181,0.8)]",
                  )}
                >
                  {fee.featured && (
                    <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-royal to-violet px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-white">
                      Most delegates
                    </span>
                  )}

                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl",
                      fee.featured
                        ? "bg-gradient-to-br from-royal to-violet text-white"
                        : "bg-surface-blue text-royal",
                    )}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-[1.1rem] leading-snug">{fee.audience}</h3>
                  {fee.note && (
                    <p className="mt-1 text-sm text-ink-soft">{fee.note}</p>
                  )}

                  <p className="mt-5 font-display text-4xl font-extrabold text-deep">
                    {fee.amount}
                    <span className="ml-1.5 align-middle text-sm font-semibold text-ink-soft">
                      {fee.currency}
                    </span>
                  </p>

                  {/* Inclusions render only once the committee confirms them. */}
                  {fee.includes.length > 0 ? (
                    <ul className="mt-5 space-y-2">
                      {fee.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-5 rounded-xl bg-surface px-3.5 py-3 text-[0.82rem] leading-relaxed text-ink-soft">
                      What the fee includes will be listed here once confirmed
                      by the organising committee.
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <Button
                      href={ctaHref}
                      variant={fee.featured ? "primary" : "outline"}
                      className="w-full"
                      withArrow
                    >
                      Register Now
                    </Button>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Process — suppressed on /registration, where the guidelines
            section already walks through the same four steps. */}
        {showProcess && (
          <Reveal delay={0.08} className="mt-14" id="process">
            <h3 className="text-center text-xl sm:text-2xl">
              How registration works
            </h3>

            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {registrationProcess.map((item) => (
                <li key={item.step} className="relative rounded-2xl border border-line bg-white p-5">
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
        )}

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 flex max-w-2xl items-start gap-2.5 rounded-xl border border-orange/30 bg-orange/8 px-4 py-3.5 text-sm text-ink">
            <AlertTriangle className="mt-0.5 size-4.5 shrink-0 text-orange" aria-hidden="true" />
            {feeDisclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
