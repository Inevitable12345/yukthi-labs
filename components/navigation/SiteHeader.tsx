"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNav } from "./MobileNav";
import { Wordmark } from "@/components/brand/Wordmark";
import { PRIMARY_NAV } from "@/lib/metadata/site";
import { cn } from "@/lib/utils/cn";

/**
 * Minimal header.
 *
 * On the homepage it begins as a wordmark and a menu control alone; the route list
 * resolves once the reader has left the invocation. On every other route the full
 * navigation is present immediately — a reader who arrived deep in the site should
 * never have to scroll to find their way out.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollState, setScrollState] = useState({ revealed: !isHome, scrolled: false });

  /**
   * A single scroll subscription drives both pieces of header state. The initial
   * read happens in an animation frame rather than synchronously in the effect,
   * so a reader who reloads halfway down the page still gets the right header
   * without a layout read during commit.
   */
  useEffect(() => {
    let frame = 0;

    const read = () => {
      const y = window.scrollY;
      setScrollState({
        revealed: isHome ? y > window.innerHeight * 0.6 : true,
        scrolled: y > 24,
      });
    };

    frame = window.requestAnimationFrame(read);
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", read);
    };
  }, [isHome]);

  const { revealed, scrolled } = scrollState;

  return (
    <header
      className={cn(
        "u-no-print fixed inset-x-0 top-0 z-[70] transition-colors duration-500",
        scrolled
          ? "border-b border-[color:var(--hairline)] bg-void/88 backdrop-blur-[6px]"
          : "border-b border-transparent",
      )}
    >
      <div className="u-gutter flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul
            className={cn(
              "flex items-center gap-8 transition-opacity duration-700",
              revealed ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {PRIMARY_NAV.map((route) => {
              const active = pathname === route.href || pathname.startsWith(`${route.href}/`);
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-colors duration-300",
                      active ? "text-gold" : "text-muted-bone hover:text-bone",
                    )}
                    tabIndex={revealed ? undefined : -1}
                  >
                    {route.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        active
                          ? "scale-x-100 bg-gold"
                          : "scale-x-0 bg-[color:var(--hairline-strong)]",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
