import Link from "next/link";

import { SITE } from "@/lib/metadata/site";

/**
 * The wordmark.
 *
 * A mark and a name — the mark being a single node with three relations leaving
 * it, which is the smallest honest picture of what the company builds.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 ${className ?? ""}`}
      aria-label={`${SITE.name} — home`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        <line x1="12" y1="12" x2="4" y2="19" stroke="var(--color-steel-dim)" strokeWidth="1" />
        <line x1="12" y1="12" x2="20" y2="19" stroke="var(--color-steel-dim)" strokeWidth="1" />
        <line x1="12" y1="12" x2="12" y2="4" stroke="var(--color-steel-dim)" strokeWidth="1" />
        <circle cx="4" cy="19" r="1.6" fill="var(--color-bone)" opacity="0.7" />
        <circle cx="20" cy="19" r="1.6" fill="var(--color-bone)" opacity="0.7" />
        <circle cx="12" cy="4" r="1.6" fill="var(--color-bone)" opacity="0.7" />
        <circle cx="12" cy="12" r="2.6" fill="var(--color-gold)" />
      </svg>

      <span className="font-display text-[1.0625rem] leading-none font-normal tracking-wide text-bone">
        Yukthi Lab
      </span>
    </Link>
  );
}
