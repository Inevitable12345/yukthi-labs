"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Dialog } from "@/components/ui/Dialog";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { Wordmark } from "@/components/brand/Wordmark";
import { LEGAL_ROUTES, PRIMARY_NAV, SITE } from "@/lib/metadata/site";

/**
 * Index control. On small screens it is the only navigation; on large screens it
 * remains available as a full route index beside the inline nav.
 */
export function MobileNav() {
  const pathname = usePathname();
  /**
   * The drawer is open only while the route it was opened on is still the current
   * one, so following a link inside it closes it as a consequence of navigating
   * rather than as a side effect watching for navigation.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn !== null && openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex min-h-11 items-center gap-3 font-mono text-[0.6875rem] tracking-[0.2em] text-muted-bone uppercase transition-colors duration-300 hover:text-bone"
      >
        <span className="hidden sm:inline">Index</span>
        <span aria-hidden="true" className="flex flex-col gap-[5px]">
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-5 bg-current" />
        </span>
        <span className="sm:hidden">Menu</span>
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Site index"
        labelledBy="nav-title"
        variant="drawer"
      >
        <div className="flex h-full flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <Wordmark href={null} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-11 font-mono text-[0.6875rem] tracking-[0.2em] text-muted-bone uppercase transition-colors hover:text-gold"
            >
              Close
            </button>
          </div>

          <h2 id="nav-title" className="u-sr-only">
            Site index
          </h2>

          <nav aria-label="Site index" className="mt-10 flex-1">
            <InstrumentLabel>Routes</InstrumentLabel>
            <ul className="mt-4">
              {PRIMARY_NAV.map((route, index) => {
                const active = pathname === route.href;
                return (
                  <li key={route.href}>
                    <Hairline />
                    <Link
                      href={route.href}
                      aria-current={active ? "page" : undefined}
                      className="group flex min-h-11 items-baseline gap-5 py-4"
                    >
                      <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`u-display-3 block transition-colors duration-300 ${
                            active ? "text-gold" : "text-bone group-hover:text-gold"
                          }`}
                        >
                          {route.label}
                        </span>
                        <span className="mt-1 block text-[0.8125rem] text-muted-bone">
                          {route.summary}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Hairline />
              </li>
            </ul>
          </nav>

          <div className="mt-10">
            <InstrumentLabel>Legal</InstrumentLabel>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_ROUTES.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="inline-flex min-h-11 items-center font-mono text-[0.6875rem] tracking-[0.16em] text-muted-bone uppercase hover:text-bone"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[0.625rem] tracking-[0.16em] text-dim-bone uppercase">
              {SITE.loop.join(" → ")}
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
}
