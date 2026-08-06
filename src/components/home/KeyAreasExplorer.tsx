"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { AreaIcon, accentFor } from "@/components/ui/AreaIcon";
import { Button } from "@/components/ui/Button";
import { initialVisibleAreas, keyAreas } from "@/content/key-areas";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  /** Homepage shows a preview; /key-areas shows the full list from the start. */
  variant?: "preview" | "full";
};

export function KeyAreasExplorer({ variant = "preview" }: Props) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(variant === "full");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return keyAreas;

    return keyAreas.filter((area) => {
      const haystack = [area.title, ...area.keywords].join(" ").toLowerCase();
      return haystack.includes(term);
    });
  }, [query]);

  // A search should always reveal every match, not just the first eight.
  const searching = query.trim().length > 0;
  const visible = expanded || searching ? results : results.slice(0, initialVisibleAreas);
  const hidden = results.length - visible.length;

  return (
    <div>
      {/* Search */}
      <div className="mx-auto mt-10 max-w-xl">
        <label htmlFor="key-area-search" className="sr-only">
          Search the key research areas
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <input
            id="key-area-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search areas — try “assessment”, “AI” or “inclusive”"
            className="w-full rounded-full border border-line bg-white py-3.5 pl-11 pr-4 text-[0.95rem] text-ink shadow-[0_10px_30px_-24px_rgba(9,43,114,0.7)] transition-colors placeholder:text-ink-soft/70 hover:border-royal/40 focus:border-royal"
          />
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {searching
            ? `${results.length} area${results.length === 1 ? "" : "s"} match your search.`
            : ""}
        </p>
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <ul className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/*
            Entrance-only, no AnimatePresence. Filtering removes cards straight
            away rather than animating them out — an exit animation here left
            non-matching cards parked in the DOM at zero opacity, and a search
            result should never wait on a transition.
            The stable `key` means surviving cards don't re-animate on keystroke.
          */}
          {visible.map((area, index) => {
            const accent = accentFor(index);
            return (
              <motion.li
                key={area.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: easeOut,
                  delay: Math.min(index, 8) * 0.035,
                }}
              >
                <article
                  className={cn(
                    "card-surface group h-full p-5 ring-1 ring-transparent transition-shadow",
                    accent.ring,
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                        accent.bg,
                        accent.text,
                      )}
                    >
                      <AreaIcon name={area.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-[0.68rem] font-bold tabular-nums text-ink-soft/70">
                        {String(area.id).padStart(2, "0")}
                      </span>
                      <h3 className="mt-0.5 text-[0.98rem] leading-snug">
                        {area.title}
                      </h3>
                      {/* Descriptions render only when approved copy exists. */}
                      {area.description && (
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {area.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
          <SearchX className="size-7 text-ink-soft/60" aria-hidden="true" />
          <p className="font-display text-base font-semibold text-deep">
            No key area matches “{query.trim()}”
          </p>
          <p className="max-w-sm text-sm text-ink-soft">
            Papers on related themes are also welcome — see “Other Related
            Themes”, or contact the organising secretaries to check whether your
            topic fits.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-1 text-sm font-semibold text-royal underline underline-offset-4"
          >
            Clear the search
          </button>
        </div>
      )}

      {/* Expand / view all */}
      {!searching && hidden > 0 && (
        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 font-display text-sm font-semibold text-deep transition-colors hover:border-royal/50 hover:bg-surface-blue"
          >
            View All {keyAreas.length} Key Areas
            <ChevronDown
              className="size-4 text-royal transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {variant === "preview" && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/registration#key-areas" variant="outline" withArrow>
            Open the full key areas list
          </Button>
          <Button href="/registration#call-for-papers" variant="ghost" withArrow>
            Read the call for papers
          </Button>
        </div>
      )}

      {variant === "full" && (
        <p className="mt-10 text-center text-sm text-ink-soft">
          Working on something adjacent?{" "}
          <Link
            href="/contact"
            className="font-semibold text-royal underline underline-offset-4"
          >
            Contact the organising secretaries
          </Link>{" "}
          to check whether your topic fits under “Other Related Themes”.
        </p>
      )}
    </div>
  );
}
