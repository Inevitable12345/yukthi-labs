import Link from "next/link";
import { BookMarked, Download, FileCheck2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { QrPanel } from "@/components/ui/QrPanel";
import { Reveal } from "@/components/ui/Reveal";
import { conference } from "@/content/conference";
import { qrCodes } from "@/content/payment";
import { slideInLeft, slideInRight } from "@/lib/motion";

const registrationQr = qrCodes.find((qr) => qr.id === "registration")!;

export function CallForPapers() {
  return (
    <section
      id="call-for-papers"
      className="relative overflow-hidden bg-gradient-to-br from-crimson via-magenta to-violet py-20 text-white lg:py-28"
      aria-labelledby="cfp-heading"
    >
      {/* Texture only — no illustrated objects. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.15] mix-blend-overlay" />
        <div className="absolute -right-24 -top-24 size-[30rem] rounded-full bg-white/10 blur-[120px]" />
      </div>

      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* Copy */}
          <Reveal variants={slideInLeft}>
            <p className="eyebrow mb-3 text-white/80">
              <span aria-hidden="true" className="inline-block h-px w-7 bg-white/60" />
              Call for Research Papers
            </p>

            <h2 id="cfp-heading" className="text-3xl text-white sm:text-4xl lg:text-[2.75rem]">
              Research papers are invited for oral presentation
            </h2>

            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-white/85">
              Registration and paper submission are completed online. Submit
              your paper under any of the twenty key areas — or under “Other
              Related Themes” — before the deadline.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              <li className="glass-panel flex items-start gap-3 rounded-xl p-4">
                <Send className="mt-0.5 size-5 shrink-0 text-white" aria-hidden="true" />
                <span>
                  <span className="block font-display text-sm font-bold">
                    September 5, 2026
                  </span>
                  <span className="text-sm text-white/75">
                    Registration &amp; submission close
                  </span>
                </span>
              </li>
              <li className="glass-panel flex items-start gap-3 rounded-xl p-4">
                <FileCheck2 className="mt-0.5 size-5 shrink-0 text-white" aria-hidden="true" />
                <span>
                  <span className="block font-display text-sm font-bold">
                    September 10, 2026
                  </span>
                  <span className="text-sm text-white/75">
                    Paper acceptance &amp; payment
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-7">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
                Submission closes in
              </p>
              <Countdown
                target={conference.announcement.deadlineISO}
                variant="blocks"
                onDark
                className="mt-3 max-w-md"
                expiredLabel="Submissions are now closed"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={conference.links.submission}
                variant="onDark"
                size="lg"
                className="border-white/60 bg-white text-crimson hover:bg-white/90 hover:text-crimson"
                withArrow
              >
                Submit Paper
              </Button>
              <Button href="/registration#key-areas" variant="onDark" size="lg">
                View Key Areas
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={conference.links.callForPapers}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                <Download className="size-4" aria-hidden="true" />
                Download Call for Papers
              </a>
              <Link
                href="/registration#guidelines"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                <BookMarked className="size-4" aria-hidden="true" />
                Read Submission Guidelines
              </Link>
            </div>
          </Reveal>

          {/* QR */}
          <Reveal variants={slideInRight} delay={0.1}>
            <div className="mx-auto max-w-sm">
              <QrPanel qr={registrationQr} className="shadow-2xl" />
              <p className="mt-4 text-center text-sm text-white/75">
                Prefer a link? The registration and submission URL is published
                beneath the code so it works without a camera.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
