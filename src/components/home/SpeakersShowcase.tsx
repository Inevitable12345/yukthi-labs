"use client";

import Image from "next/image";
import { useState } from "react";
import { Info, Quote, UserRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { speakers, type Speaker } from "@/content/speakers";
import { cn } from "@/lib/utils";

export function SpeakersShowcase({ heading = true }: { heading?: boolean }) {
  const [active, setActive] = useState<Speaker | null>(null);

  return (
    <section
      id="speakers"
      className="relative overflow-hidden bg-surface py-20 lg:py-28"
      aria-labelledby="speakers-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-50 mask-fade"
      />

      <div className="container-page relative">
        {heading && (
          <SectionHeading
            eyebrow="Speakers"
            title="Tentative list of speakers"
            lead="The speakers below are yet to be confirmed, and are announced as the programme is finalised."
            align="center"
          />
        )}

        {/* Swipe track on mobile, grid from `sm` upward. */}
        <RevealGroup
          step={0.1}
          className={cn(
            "mt-12 flex snap-track gap-4 overflow-x-auto pb-4 no-scrollbar",
            "sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 lg:gap-6",
          )}
        >
          {speakers.map((speaker) => (
            <RevealItem
              key={speaker.id}
              className="w-[85vw] shrink-0 snap-item sm:w-auto"
            >
              <article className="card-surface group flex h-full flex-col overflow-hidden">
                {/* Portrait */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-deep via-royal to-violet">
                  {speaker.photo ? (
                    <Image
                      src={speaker.photo}
                      alt={`Portrait of ${speaker.name}`}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    /* No approved photograph yet — a neutral monogram, never a
                       stock image of an unrelated person. */
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
                      <span className="grid size-16 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md">
                        <UserRound className="size-8" aria-hidden="true" />
                      </span>
                      <span className="px-4 text-center text-xs text-white/60">
                        Official photograph awaited
                      </span>
                    </div>
                  )}

                  {speaker.tentative && (
                    <span className="absolute left-4 top-4 rounded-full bg-orange px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-white shadow">
                      Tentative
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[1.12rem]">{speaker.name}</h3>
                  <p className="mt-1.5 text-sm font-medium text-royal">
                    {speaker.position}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {speaker.institution}
                  </p>

                  <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
                    <Quote className="mt-0.5 size-3.5 shrink-0 text-ink-soft/50" aria-hidden="true" />
                    <span>
                      {speaker.sessionTitle ?? "Session title to be announced."}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setActive(speaker)}
                    className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-royal underline-offset-4 transition-colors hover:text-violet hover:underline"
                  >
                    <Info className="size-4" aria-hidden="true" />
                    View details
                  </button>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-center text-sm text-ink-soft sm:hidden">
          Swipe to see more speakers
        </p>
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.name ?? ""}
        subtitle={active ? `${active.position} · ${active.institution}` : undefined}
      >
        {active && (
          <div className="space-y-4">
            {active.tentative && (
              <p className="rounded-xl border border-orange/30 bg-orange/8 px-4 py-3 text-sm text-ink">
                <strong className="font-semibold">Tentative:</strong> this
                speaker&rsquo;s participation is being confirmed and the
                programme may change.
              </p>
            )}

            {active.bio ? (
              <p className="text-[0.96rem] leading-relaxed text-ink-soft">
                {active.bio}
              </p>
            ) : (
              <p className="text-[0.96rem] leading-relaxed text-ink-soft">
                A biography will be published here once it has been approved by
                the speaker and the organising committee.
              </p>
            )}

            {active.sessionTitle && (
              <div>
                <h3 className="text-base">Session</h3>
                <p className="mt-1 text-[0.96rem] text-ink-soft">
                  {active.sessionTitle}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
