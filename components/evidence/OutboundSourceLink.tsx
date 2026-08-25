"use client";

import { track } from "@/lib/analytics/analytics";

/**
 * Outbound link to a primary source.
 *
 * `rel="noopener noreferrer"` on every external link, and the host is printed so a
 * reader can see where the link goes before following it.
 */
export function OutboundSourceLink({
  href,
  evidenceId,
  children,
}: {
  href: string;
  evidenceId: string;
  children: React.ReactNode;
}) {
  let host = "";
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    host = "";
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("outbound_source_click", { evidence: evidenceId, host })}
      className="group inline-flex min-h-11 items-center gap-3 font-mono text-[0.625rem] tracking-[0.16em] text-bone uppercase transition-colors hover:text-gold"
    >
      <span className="border-b border-[color:var(--hairline-strong)] pb-0.5 transition-colors group-hover:border-gold">
        {children}
      </span>
      {host ? <span className="text-dim-bone normal-case">{host}</span> : null}
      <span
        aria-hidden="true"
        className="text-gold transition-transform group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </a>
  );
}
