import type { Metadata } from "next";

import { ActionLink } from "@/components/ui/ActionLink";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { PRIMARY_NAV } from "@/lib/metadata/site";

export const metadata: Metadata = {
  title: "Route not found",
  description: "This route does not resolve.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="u-gutter relative flex min-h-screen flex-col justify-center py-40">
      <div
        aria-hidden="true"
        className="u-graticule pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="relative">
        <InstrumentLabel tone="rupture">404 · unresolved</InstrumentLabel>
        <h1 className="u-display-1 mt-8 max-w-4xl text-bone">This route does not resolve.</h1>
        <p className="u-lede u-measure mt-8">
          The address you followed is not part of this map. The routes below are.
        </p>
        <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
          {PRIMARY_NAV.map((route) => (
            <li key={route.href}>
              <ActionLink href={route.href}>{route.label}</ActionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
