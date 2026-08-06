"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Link = { id: string; label: string };

/**
 * Sticky in-page navigation for the combined registration page.
 *
 * Long single pages need a way back to the top-level sections. Highlights the
 * section currently in view via IntersectionObserver — cheaper and smoother
 * than measuring scroll offsets on every frame.
 */
export function SectionJumpNav({ links }: { links: Link[] }) {
  const [active, setActive] = useState<string>(links[0]?.id ?? "");

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer whichever visible section is nearest the top of the viewport.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      // Band just below the sticky header, so a section counts as "current"
      // once its top reaches the upper third of the screen.
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-40 border-b border-line bg-white/90 backdrop-blur-xl lg:top-20"
    >
      <div className="container-page">
        <ul className="flex snap-track gap-1 overflow-x-auto py-2.5 no-scrollbar">
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id} className="snap-item shrink-0">
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-royal to-violet text-white shadow-sm"
                      : "text-ink-soft hover:bg-surface-blue hover:text-royal",
                  )}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
