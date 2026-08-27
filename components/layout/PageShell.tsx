import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/**
 * The standard page frame for everything that is not the homepage narrative.
 *
 * Editorial rather than cinematic: these pages exist to be read carefully, and a
 * reader who has arrived at /evidence wants the sources, not a camera move.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="u-gutter py-20 sm:py-28">
      <header className="border-b border-[color:var(--hairline)] pb-16">
        <InstrumentLabel tone="gold">{eyebrow}</InstrumentLabel>
        <h1 className="u-display-2 mt-6 max-w-[20ch] text-bone">{title}</h1>
        {lede ? <div className="u-lede u-measure mt-8">{lede}</div> : null}
      </header>

      <div className="mt-20">{children}</div>
    </div>
  );
}
