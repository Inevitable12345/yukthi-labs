"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { CalendarPlus, CalendarRange, Check, Flag, Timer } from "lucide-react";
import { useRef, useState } from "react";
import { Countdown } from "@/components/ui/Countdown";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { conference } from "@/content/conference";
import { getNextMilestone, importantDates } from "@/content/important-dates";
import { buildGoogleCalendarUrl, buildIcsDataUrl, cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

export function DatesTimeline({ heading = true }: { heading?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Computed on the client so a stale build never highlights a passed deadline.
  const next = getNextMilestone();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 85%", "end 55%"],
  });
  const rawProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const progress = useTransform(rawProgress, (value) => (reduceMotion ? 1 : value));

  const calendarPayload = {
    title: `${conference.acronym} — ${conference.fullTitle}`,
    details: `${conference.mode}. Organised by the School of Education, SCSVMV, in association with TNTEU.`,
    location: conference.location.label,
    startISO: conference.dates.startISO,
    endISO: conference.dates.endISO,
  };

  return (
    <section
      id="important-dates"
      className="relative overflow-hidden bg-deep py-20 text-white lg:py-28"
      aria-labelledby="dates-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 size-[32rem] rounded-full bg-royal/40 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 size-[28rem] rounded-full bg-violet/30 blur-[110px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.14] mix-blend-overlay" />
      </div>

      <div className="container-page relative">
        {heading && (
          <div className="max-w-2xl">
            <p className="eyebrow mb-3 text-cyan">
              <span aria-hidden="true" className="inline-block h-px w-7 bg-cyan/70" />
              Important Dates
            </p>
            <h2 id="dates-heading" className="text-3xl text-white sm:text-4xl lg:text-[2.75rem]">
              Three dates that decide everything
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-white/75">
              Registration, submission and payment all close before the
              conference opens. Only the dates confirmed by the organising
              committee are listed here.
            </p>
          </div>
        )}

        {/* Countdown to the nearest deadline */}
        <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-cyan">
              <Timer className="size-4" aria-hidden="true" />
              Time left — {next.label}
            </p>
            <Countdown
              target={next.dateISO}
              variant="blocks"
              onDark
              className="mt-3"
              expiredLabel="This deadline has passed"
            />
          </div>

          <Button
            variant="onDark"
            onClick={() => setCalendarOpen(true)}
            icon={<CalendarPlus className="size-4" aria-hidden="true" />}
          >
            Add conference to calendar
          </Button>
        </div>

        {/* ---------------- Timeline ---------------- */}
        <div ref={trackRef} className="relative mt-14 lg:mt-20">
          {/* Rail — horizontal on desktop, vertical on mobile */}
          <div
            aria-hidden="true"
            className="absolute left-[1.4rem] top-2 h-[calc(100%-1rem)] w-px bg-white/15 lg:left-0 lg:top-[1.45rem] lg:h-px lg:w-full"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: progress, scaleX: progress }}
            className="absolute left-[1.4rem] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-cyan via-lilac to-magenta lg:left-0 lg:top-[1.45rem] lg:h-px lg:w-full lg:origin-left lg:bg-gradient-to-r"
          />

          <ol className="relative grid gap-9 lg:grid-cols-3 lg:gap-8">
            {importantDates.map((milestone, index) => {
              const isNext = milestone.id === next.id;
              const isPast = new Date(milestone.dateISO).getTime() < Date.now();

              return (
                <motion.li
                  key={milestone.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.14, ease: easeOut }}
                  className="relative pl-14 lg:pl-0"
                >
                  {/* Marker */}
                  <span
                    className={cn(
                      "absolute left-0 top-1 grid size-11 place-items-center rounded-full border-2 lg:relative lg:top-0 lg:mb-6",
                      isNext
                        ? "border-magenta bg-magenta text-white"
                        : isPast
                          ? "border-emerald/60 bg-emerald/20 text-emerald"
                          : "border-white/30 bg-deep text-white",
                    )}
                  >
                    {milestone.kind === "event" ? (
                      <Flag className="size-4.5" aria-hidden="true" />
                    ) : isPast ? (
                      <Check className="size-4.5" aria-hidden="true" />
                    ) : (
                      <CalendarRange className="size-4.5" aria-hidden="true" />
                    )}

                    {/* Halo on the nearest upcoming deadline only */}
                    {isNext && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-magenta/60 blur-md animate-glow-breathe"
                      />
                    )}
                  </span>

                  <div
                    className={cn(
                      "rounded-2xl border p-5 backdrop-blur-md transition-colors lg:p-6",
                      isNext
                        ? "border-magenta/45 bg-magenta/10"
                        : "border-white/12 bg-white/[0.06] hover:border-white/25",
                    )}
                  >
                    {isNext && (
                      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-magenta px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white">
                        Next deadline
                      </span>
                    )}

                    <p className="font-display text-xl font-bold text-white sm:text-2xl">
                      {milestone.dateLabel}
                    </p>
                    <p className="mt-1.5 font-display text-sm font-semibold uppercase tracking-[0.1em] text-cyan">
                      {milestone.label}
                    </p>
                    <p className="mt-3 text-[0.94rem] leading-relaxed text-white/75">
                      {milestone.description}
                    </p>

                    {milestone.kind === "event" && (
                      <button
                        type="button"
                        onClick={() => setCalendarOpen(true)}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan underline underline-offset-4 hover:text-white"
                      >
                        <CalendarPlus className="size-4" aria-hidden="true" />
                        Add to calendar
                      </button>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <p className="mt-10 text-sm text-white/55">
          Dates are as announced by the organising committee. Any revision will
          be published on this page.
        </p>
      </div>

      <Modal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        title="Add ICRTET-2026 to your calendar"
        subtitle={`${conference.dates.label} · ${conference.location.label}`}
      >
        <div className="flex flex-col gap-3">
          <Button
            href={buildGoogleCalendarUrl(calendarPayload)}
            external
            variant="outline"
            className="w-full justify-between"
            withArrow
          >
            Google Calendar
          </Button>
          <Button
            href={buildIcsDataUrl({ ...calendarPayload, uid: "icrtet-2026@kanchiuniv.ac.in" })}
            external
            variant="outline"
            className="w-full justify-between"
            withArrow
            download="icrtet-2026.ics"
          >
            Apple Calendar / Outlook (.ics)
          </Button>
          <p className="mt-1 text-sm text-ink-soft">
            The calendar entry covers the conference days only. Submission and
            payment deadlines fall earlier — see the timeline above.
          </p>
        </div>
      </Modal>
    </section>
  );
}
