import Link from "next/link";

import { evidenceCounts } from "@/data/evidence";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { LEGAL_ROUTES, PRIMARY_NAV, SITE } from "@/lib/metadata/site";

export function Footer() {
  return (
    <footer className="u-gutter u-no-print border-t border-[color:var(--hairline)] py-16">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <InstrumentLabel as="p" tone="gold">
            Yukthi Lab
          </InstrumentLabel>
          <p className="u-body mt-4 max-w-[28ch]">{SITE.mission}</p>
        </div>

        <nav aria-label="Footer">
          <InstrumentLabel as="p">Pages</InstrumentLabel>
          <ul className="mt-4 space-y-2">
            {PRIMARY_NAV.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="text-[0.875rem] text-muted-bone transition-colors hover:text-bone"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <InstrumentLabel as="p">Evidence</InstrumentLabel>
          <p className="u-body mt-4">
            {evidenceCounts.total} sources. {evidenceCounts.verified} verified against the cited
            publication, {evidenceCounts.needsVerification} awaiting verification and labelled
            as such wherever they appear.
          </p>
        </div>

        <nav aria-label="Legal">
          <InstrumentLabel as="p">Legal</InstrumentLabel>
          <ul className="mt-4 space-y-2">
            {LEGAL_ROUTES.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="text-[0.875rem] text-muted-bone transition-colors hover:text-bone"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="u-instrument mt-16 border-t border-[color:var(--hairline)] pt-8">
        © {new Date().getFullYear()} Yukthi Lab — Bring certainty to an increasingly unstable
        world
      </p>
    </footer>
  );
}
