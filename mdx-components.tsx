import type { MDXComponents } from "mdx/types";

import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/**
 * How MDX prose renders across research notes and field notes.
 *
 * `EvidenceMarker` is exposed to MDX so a note can attach provenance inline,
 * exactly as the hand-written pages do — a source marker in a field note behaves
 * identically to one in the thesis.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="u-display-3 mt-16 mb-5 text-bone first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 mb-4 font-mono text-[0.6875rem] tracking-[0.18em] text-gold uppercase">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="u-measure mb-6 text-[0.9375rem] leading-[1.78] text-muted-bone">
        {children}
      </p>
    ),
    ul: ({ children }) => <ul className="u-measure mb-7 space-y-2.5">{children}</ul>,
    ol: ({ children }) => (
      <ol className="u-measure mb-7 list-decimal space-y-2.5 pl-5 marker:text-dim-bone">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-[0.9375rem] leading-[1.72] text-muted-bone">{children}</li>
    ),
    strong: ({ children }) => <strong className="font-medium text-bone">{children}</strong>,
    em: ({ children }) => <em className="text-bone italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="u-measure my-10 border-l border-[color:var(--color-gold-dim)] pl-6 text-[1.0625rem] leading-relaxed text-bone">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.8125rem] text-steel">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="u-figure-scroll my-8 border border-[color:var(--hairline)] bg-deep-field p-5 font-mono text-[0.75rem] leading-relaxed text-steel">
        {children}
      </pre>
    ),
    a: ({ href, children }) => {
      const isExternal = typeof href === "string" && /^https?:/.test(href);
      return (
        <a
          href={href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-bone underline decoration-[color:var(--hairline-strong)] underline-offset-4 hover:decoration-gold"
        >
          {children}
        </a>
      );
    },
    hr: () => <hr className="my-14 border-0 border-t border-[color:var(--hairline)]" />,
    EvidenceMarker,
    InstrumentLabel,
    ...components,
  };
}
