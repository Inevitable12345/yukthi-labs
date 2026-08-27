"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { PRIMARY_NAV } from "@/lib/metadata/site";
import { cn } from "@/lib/utils/cn";

/**
 * The header.
 *
 * Static rather than sticky. A fixed header over a scroll-driven narrative
 * competes with the argument for attention and steals vertical space on exactly
 * the devices with least to spare — and the chapter rail already provides
 * continuous position feedback.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // The menu closes when a link inside it is chosen. Doing this on the click
  // rather than in an effect watching the pathname means the state changes for
  // the reason it actually changed, and there is no render-then-correct cycle.
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="u-gutter u-no-print relative z-40 border-b border-[color:var(--hairline)] py-5">
      <div className="flex items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {PRIMARY_NAV.map((route) => {
              const active = pathname === route.href || pathname.startsWith(`${route.href}/`);
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "font-mono text-[0.6875rem] tracking-[0.16em] uppercase transition-colors",
                      active ? "text-gold" : "text-muted-bone hover:text-bone",
                    )}
                  >
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="u-instrument border border-[color:var(--hairline)] px-3 py-2 text-bone md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen ? (
        <nav id="mobile-nav" aria-label="Primary" className="mt-6 md:hidden">
          <ul className="space-y-0">
            {PRIMARY_NAV.map((route) => {
              const active = pathname === route.href || pathname.startsWith(`${route.href}/`);
              return (
                <li key={route.href} className="border-t border-[color:var(--hairline)]">
                  <Link
                    href={route.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={cn("block py-4", active ? "text-gold" : "text-bone")}
                  >
                    <span className="font-mono text-[0.75rem] tracking-[0.16em] uppercase">
                      {route.label}
                    </span>
                    <span className="u-body mt-1 block text-[0.8125rem]">
                      {route.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
