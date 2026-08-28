"use client";

import Link from "next/link";
import { FINALE_LINES, ROOM_COPY } from "@/content/thesis";
import { Room } from "@/components/story/Room";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { SITE } from "@/lib/metadata/site";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";

/* ============================================================================
   ROOM 20 — THE CIVILIZATIONAL BET  (§28)
   ----------------------------------------------------------------------------
   The world becomes a living causal architecture, futures extend into darkness,
   and a restrained astrolabe geometry appears behind the closing address.

   The three historical lines are paced by scroll so the pauses between them are
   real. Nothing moves quickly here; the finale earns its scale by slowing down.
   ========================================================================== */

const copy = ROOM_COPY.finale;

export function FinaleScene() {
  const progress = useChapterProgress("finale");

  const lineStrength = (index: number) => {
    const start = 0.12 + index * 0.14;
    return Math.min(1, Math.max(0, (progress - start) / 0.12));
  };

  const close = Math.min(1, Math.max(0, (progress - 0.58) / 0.24));

  return (
    <Room id="finale" pinned={false} className="overflow-hidden">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
        <div>
          <InstrumentLabel>{copy.eyebrow}</InstrumentLabel>

          <h2 id="finale-heading" className="display mt-6 max-w-[16ch]">
            {copy.headline}
          </h2>

          <div className="mt-14 space-y-8">
            {copy.body.map((line, index) => (
              <p
                key={line}
                className="standfirst max-w-[46ch] text-[1.15rem]"
                style={{
                  opacity: lineStrength(index),
                  transform: `translateY(${(1 - lineStrength(index)) * 10}px)`,
                  transition: "opacity 700ms var(--ease-instrument)",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* The astrolabe holds the right of the frame while the address below it
            scrolls past — a restrained instrument geometry, not a logo. */}
        <div className="relative lg:sticky lg:top-[16vh] lg:self-start">
          <svg
            viewBox="-120 -120 240 240"
            aria-hidden="true"
            className="mx-auto h-auto w-full max-w-[30rem] opacity-45"
          >
            <g fill="none" stroke="var(--color-brass-dim)">
              <circle cx="0" cy="0" r="104" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="76" strokeWidth="0.5" opacity="0.7" />
              <ellipse cx="0" cy="0" rx="104" ry="34" strokeWidth="0.5" opacity="0.6" />
              <ellipse
                cx="0"
                cy="0"
                rx="34"
                ry="104"
                strokeWidth="0.5"
                opacity="0.6"
                transform={`rotate(${progress * 22})`}
              />
              <line x1="-104" y1="0" x2="104" y2="0" strokeWidth="0.4" opacity="0.5" />
            </g>
            <circle cx="74" cy="-52" r="3.4" fill="var(--color-brass)" />
          </svg>
        </div>
      </div>

      <div className="mt-24 max-w-[64rem]" style={{ opacity: 0.35 + close * 0.65 }}>
        {FINALE_LINES.map((line) => (
          <p key={line} className="headline max-w-[24ch] text-white-hot">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-20 max-w-[64rem] border-t border-graphite pt-10">
        <p className="display">Yukthi Lab</p>
        <p className="standfirst mt-3 text-brass">{SITE.mission}</p>

        <nav aria-label="Continue" className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {[
            { href: "/thesis", label: "Read the thesis in full" },
            { href: "/technology", label: "The scoped causal hypergraph" },
            { href: "/evidence", label: "Every source, in full" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[0.72rem] tracking-[0.16em] uppercase text-ash underline decoration-graphite underline-offset-8 transition-colors hover:text-bone hover:decoration-brass"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </Room>
  );
}
