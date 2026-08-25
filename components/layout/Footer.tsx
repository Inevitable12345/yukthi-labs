"use client";

import Link from "next/link";

import { useConsent } from "@/components/consent/ConsentProvider";
import { Mark } from "@/components/brand/Mark";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { LEGAL_ROUTES, PRIMARY_NAV, SITE } from "@/lib/metadata/site";

export function Footer() {
  const { openPreferences } = useConsent();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[color:var(--hairline)] bg-void">
      {/* horizon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-32 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(187,163,106,0.09),transparent_70%)]"
      />

      <div className="u-gutter relative py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3 text-gold">
              <Mark className="h-7 w-7" />
              <span className="font-mono text-[0.8125rem] tracking-[0.3em] text-bone uppercase">
                Yukthi <span className="text-dim-bone">Lab</span>
              </span>
            </div>
            <p className="u-body mt-6 max-w-sm">{SITE.mission}</p>
            <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.2em] text-gold/80 uppercase">
              {SITE.loop.join(" → ")}
            </p>
          </div>

          <nav aria-label="Footer">
            <InstrumentLabel as="h2">Routes</InstrumentLabel>
            <ul className="mt-5 space-y-3">
              {PRIMARY_NAV.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="inline-flex min-h-11 items-center font-mono text-[0.6875rem] tracking-[0.18em] text-muted-bone uppercase transition-colors hover:text-gold"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <InstrumentLabel as="h2">Legal</InstrumentLabel>
            <ul className="mt-5 space-y-3">
              {LEGAL_ROUTES.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="inline-flex min-h-11 items-center font-mono text-[0.6875rem] tracking-[0.18em] text-muted-bone uppercase transition-colors hover:text-gold"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openPreferences}
                  className="inline-flex min-h-11 items-center font-mono text-[0.6875rem] tracking-[0.18em] text-muted-bone uppercase transition-colors hover:text-gold"
                >
                  Cookie preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[color:var(--hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.625rem] tracking-[0.2em] text-dim-bone uppercase">
            © {year} Yukthi Lab
          </p>
          <p className="max-w-md font-mono text-[0.625rem] leading-relaxed tracking-[0.12em] text-dim-bone uppercase">
            Illustrative diagrams are labelled as such and are not model output.
          </p>
        </div>
      </div>
    </footer>
  );
}
