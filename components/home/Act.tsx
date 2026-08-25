import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/**
 * One act of the homepage sequence.
 *
 * The rhythm is fixed — coordinate, statement, space, structure — so the reader
 * learns the shape of the argument once and can then follow it without effort.
 */
export function Act({
  index,
  eyebrow,
  headline,
  lede,
  children,
  id,
  className,
  headlineClassName,
  tone = "default",
}: {
  index: string;
  eyebrow?: string;
  headline: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  id: string;
  className?: string;
  headlineClassName?: string;
  tone?: "default" | "quiet";
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        "u-gutter relative scroll-mt-20 border-t border-[color:var(--hairline)] py-24 sm:py-32",
        tone === "quiet" ? "bg-void" : "",
        className,
      )}
    >
      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
          <InstrumentLabel className="shrink-0 tabular-nums" tone="gold">
            {index}
          </InstrumentLabel>
          {eyebrow ? <InstrumentLabel className="shrink-0">{eyebrow}</InstrumentLabel> : null}
        </div>

        <h2
          id={`${id}-heading`}
          className={cn("u-display-2 mt-8 max-w-[18ch] text-bone", headlineClassName)}
        >
          {headline}
        </h2>

        {lede ? <div className="u-lede u-measure mt-8">{lede}</div> : null}

        {children ? <div className="mt-16 sm:mt-20">{children}</div> : null}
      </div>
    </section>
  );
}
