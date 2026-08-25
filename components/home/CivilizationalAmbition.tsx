import Link from "next/link";

import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { Mark } from "@/components/brand/Mark";
import { SITE } from "@/lib/metadata/site";

const DESTINATIONS = [
  { href: "/thesis", label: "Explore the thesis" },
  { href: "/architecture", label: "Study the architecture" },
  { href: "/evidence", label: "Inspect the evidence" },
  { href: "/research", label: "Read research" },
];

/* ACT 12 — CIVILIZATIONAL AMBITION
   A horizon, not a footer. Three statements, a mark, and four ways onward. */
export function CivilizationalAmbition() {
  return (
    <section
      id="ambition"
      aria-labelledby="ambition-heading"
      className="relative overflow-hidden border-t border-[color:var(--hairline)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(80%_100%_at_50%_100%,rgba(187,163,106,0.09),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[38%] h-px bg-[linear-gradient(to_right,transparent,rgba(236,231,220,0.22),transparent)]"
      />

      <div className="u-gutter relative flex min-h-[90svh] flex-col justify-center py-32">
        <InstrumentLabel tone="gold">Act 12 · horizon</InstrumentLabel>

        <h2 id="ambition-heading" className="u-display-1 mt-12 max-w-[15ch] text-bone">
          Understand what is changing.
        </h2>
        <p className="u-display-2 mt-6 max-w-[16ch] text-muted-bone">
          Reason about what comes next.
        </p>
        <p className="u-display-2 mt-6 max-w-[20ch] text-dim-bone">
          Make robust decisions before uncertainty becomes catastrophe.
        </p>

        <p className="mt-20 max-w-xl border-l border-[color:var(--color-gold-dim)] pl-6 text-[0.9375rem] leading-relaxed text-muted-bone">
          {SITE.promise}
        </p>

        <div className="mt-20 flex items-center gap-4 text-gold">
          <Mark className="h-8 w-8" />
          <span className="font-mono text-[0.75rem] tracking-[0.34em] text-bone uppercase">
            Yukthi Lab
          </span>
        </div>

        <ul className="mt-14 grid gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((destination, index) => (
            <li key={destination.href} className="bg-void">
              <Link
                href={destination.href}
                className="group flex min-h-[7rem] flex-col justify-between p-6 transition-colors duration-500 hover:bg-deep-field"
              >
                <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-6 flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-bone uppercase transition-colors group-hover:text-gold">
                    {destination.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-gold transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
