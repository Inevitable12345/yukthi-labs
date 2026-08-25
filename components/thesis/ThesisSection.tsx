"use client";

import { useEffect, useState } from "react";

import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { track } from "@/lib/analytics/analytics";
import { useInView } from "@/lib/utils/use-in-view";
import { cn } from "@/lib/utils/cn";

/**
 * A numbered thesis section.
 *
 * The reading column is held to a comfortable measure; figures inside it are
 * allowed to break out into the margin on wide screens, which is what gives the
 * page its editorial rhythm rather than a uniform column of blocks.
 */
export function ThesisSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });

  useEffect(() => {
    if (inView) track("thesis_section_view", { section: id });
  }, [inView, id]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 border-t border-[color:var(--hairline)] py-14 first:border-t-0 first:pt-0 sm:py-20"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
        <InstrumentLabel tone="gold" className="shrink-0 tabular-nums">
          {index} /
        </InstrumentLabel>
        <h2 id={`${id}-heading`} className="u-display-3 text-bone">
          {title}
        </h2>
      </div>

      <div
        className={cn(
          "mt-10 space-y-6",
          "[&>p]:u-measure [&>p]:text-[0.9375rem] [&>p]:leading-[1.78] [&>p]:text-muted-bone",
          "[&_strong]:font-medium [&_strong]:text-bone",
          "[&_em]:text-bone [&_em]:italic",
          "[&_a]:text-bone [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[color:var(--hairline-strong)] hover:[&_a]:decoration-gold",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * Sticky section index. Tracks which section is being read using the same
 * intersection signal the sections themselves use, so the two can never disagree.
 */
export function ThesisIndex({
  sections,
}: {
  sections: Array<{ id: string; index: string; title: string }>;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Thesis sections" className="hidden lg:block">
      <div className="sticky top-28">
        <InstrumentLabel as="p">Sections</InstrumentLabel>
        <ol className="mt-5 space-y-2.5">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex items-baseline gap-3 py-1 transition-colors duration-300",
                    isActive ? "text-gold" : "text-dim-bone hover:text-muted-bone",
                  )}
                >
                  <span className="font-mono text-[0.625rem] tabular-nums">
                    {section.index}
                  </span>
                  <span className="font-mono text-[0.625rem] leading-snug tracking-[0.12em] uppercase">
                    {section.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
