"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { NAVIGATION } from "@/lib/metadata/site";
import { cn } from "@/lib/utils/cn";

function subscribeScroll(onChange: () => void): () => void {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function isScrolled(): boolean {
  return window.scrollY > 64;
}

/**
 * Institutional navigation (§29): seven words, no call to action, no emphasis
 * on any one of them. It gains a backdrop once the visitor has left the top of
 * the document so that it never sits in front of the opening darkness.
 */
export function SiteHeader() {
  const pathname = usePathname();
  // The menu remembers which route it was opened on, so navigating closes it
  // by derivation instead of by an effect chasing the pathname.
  const [menu, setMenu] = useState({ open: false, at: pathname });
  const menuOpen = menu.open && menu.at === pathname;

  // Read as external state rather than mirrored into an effect, so a page
  // restored mid-scroll is settled on its very first render.
  const settled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);

  return (
    <header
      data-print-hidden="true"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        settled
          ? "border-b border-graphite bg-void/88 backdrop-blur-sm"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[86rem] items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="text-bone transition-colors hover:text-white-hot">
          <Wordmark />
          <span className="sr-only">Yukthi Lab — home</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAVIGATION.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "font-mono text-[0.7rem] tracking-[0.2em] uppercase transition-colors",
                      active ? "text-brass" : "text-ash hover:text-bone",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenu({ open: !menuOpen, at: pathname })}
          aria-expanded={menuOpen}
          aria-controls="primary-mobile-navigation"
          className="border border-graphite px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-ash transition-colors hover:text-bone md:hidden"
        >
          {menuOpen ? "Close" : "Index"}
        </button>
      </div>

      <nav
        id="primary-mobile-navigation"
        aria-label="Primary"
        hidden={!menuOpen}
        className="border-t border-graphite bg-void/96 md:hidden"
      >
        <ul className="mx-auto max-w-[86rem] px-5 py-3 sm:px-8">
          {NAVIGATION.map((item) => (
            <li key={item.href} className="border-b border-graphite/60 last:border-b-0">
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="block py-3 font-mono text-[0.78rem] tracking-[0.2em] uppercase text-bone"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
