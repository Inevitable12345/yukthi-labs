"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Download, FileText, MapPin, MonitorPlay, Sparkles } from "lucide-react";
import { HeroBackdrop } from "@/components/visuals/HeroBackdrop";
import { Button } from "@/components/ui/Button";
import { conference } from "@/content/conference";
import { scsvmv, tnteu } from "@/content/institutions";
import { easeOut } from "@/lib/motion";

/**
 * Timed entrance for the hero. The whole sequence lands in ~2.1s, and every
 * step animates opacity/transform only so it stays on the compositor.
 */
const step = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: easeOut },
});

const titleLines = ["Recent Trends in", "Educational Technology"];

export function Hero() {
  return (
    <section
      className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden pb-24 pt-16 lg:-mt-20 lg:min-h-[92vh] lg:pb-28 lg:pt-20"
      aria-labelledby="hero-title"
    >
      <HeroBackdrop />

      <div className="container-page relative z-10 w-full">
        <div className="max-w-3xl pt-10 lg:pt-6">
          {/* 1 — Institutional logos */}
          <motion.div
            {...step(0.1)}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <LogoPlate initials="SC" label={scsvmv.shortName} />
            <span aria-hidden="true" className="h-8 w-px bg-white/25" />
            <LogoPlate initials="TN" label={tnteu.shortName} />
          </motion.div>

          {/* 2 — Organiser + association */}
          <motion.div {...step(0.3)} className="mt-7">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-cyan">
              School of Education
            </p>
            <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-white/80">
              {scsvmv.name}
            </p>
            <p className="mt-1 text-sm text-white/60">
              In association with {tnteu.name}
            </p>
          </motion.div>

          {/* 3 — Ordinal */}
          <motion.p
            {...step(0.5)}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
          >
            <Sparkles className="size-3.5 text-cyan" aria-hidden="true" />
            {conference.ordinal}
          </motion.p>

          {/* 4 — Title, revealed line by line */}
          <h1
            id="hero-title"
            className="mt-4 text-[2.1rem] leading-[1.08] text-white sm:text-5xl lg:text-[3.65rem]"
          >
            <span className="sr-only">{conference.fullTitle}</span>
            {titleLines.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  aria-hidden="true"
                  className="block"
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.62 + index * 0.14,
                    ease: easeOut,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* 5 — Acronym */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.24em" }}
            animate={{ opacity: 1, scale: 1, letterSpacing: "0.02em" }}
            transition={{ duration: 0.85, delay: 0.98, ease: easeOut }}
            className="relative mt-5 inline-block"
          >
            {/* Soft glow behind the acronym */}
            <span
              aria-hidden="true"
              className="absolute -inset-x-6 -inset-y-3 rounded-full bg-gradient-to-r from-cyan/25 via-lilac/25 to-magenta/25 blur-2xl animate-glow-breathe"
            />
            <span className="relative font-display text-4xl font-extrabold text-gradient-light sm:text-5xl lg:text-6xl">
              {conference.acronym}
            </span>
          </motion.div>

          {/* 6 & 7 — Mode badge and date card */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.span
              {...step(1.22)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald/40 bg-emerald/15 px-4 py-2 font-display text-sm font-semibold text-white backdrop-blur-md"
            >
              <MonitorPlay className="size-4 text-emerald" aria-hidden="true" />
              {conference.mode}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.38, ease: easeOut }}
              className="glass-panel inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-white"
            >
              <CalendarDays className="size-5 text-cyan" aria-hidden="true" />
              <span className="font-display text-base font-bold sm:text-lg">
                {conference.dates.label}
              </span>
            </motion.span>

            <motion.span
              {...step(1.5)}
              className="inline-flex items-center gap-2 text-sm text-white/70"
            >
              <MapPin className="size-4 text-cyan" aria-hidden="true" />
              {conference.location.label}
            </motion.span>
          </div>

          {/* 8 — Calls to action */}
          <motion.div {...step(1.62)} className="mt-9 flex flex-wrap gap-3">
            <Button href="/registration" variant="accent" size="lg" withArrow>
              Register &amp; Submit Paper
            </Button>
            <Button href="/registration#call-for-papers" variant="onDark" size="lg">
              View Call for Papers
            </Button>
          </motion.div>

          <motion.div {...step(1.78)} className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={conference.links.brochure}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <Download className="size-4" aria-hidden="true" />
              Download Brochure
            </a>
            <Link
              href="/registration#key-areas"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <FileText className="size-4" aria-hidden="true" />
              Explore Key Areas
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.1 }}
        className="absolute inset-x-0 bottom-6 z-10 hidden justify-center lg:flex"
        aria-hidden="true"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1">
          <motion.span
            className="size-1 rounded-full bg-cyan"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/**
 * Stand-in for an institutional logo.
 *
 * TODO(assets): replace with the high-resolution official SVG/PNG supplied by
 * each institution. Per the brief, low-resolution marks lifted from the poster
 * must not be scaled up for production.
 */
function LogoPlate({ initials, label }: { initials: string; label: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-full border border-white/30 bg-white/10 font-display text-sm font-bold text-white backdrop-blur-md sm:size-12"
      >
        {initials}
      </span>
      <span className="font-display text-sm font-semibold text-white/90">
        {label}
      </span>
    </span>
  );
}
