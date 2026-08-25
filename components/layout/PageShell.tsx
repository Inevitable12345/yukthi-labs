import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

type Props = {
  /** Mono eyebrow: route coordinate or section index. */
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  /** Optional right-hand instrument column shown beside the title on wide screens. */
  aside?: React.ReactNode;
  className?: string;
};

/**
 * Interior route header. Establishes the same reading rhythm on every page:
 * coordinate, statement, lede, rule, content.
 */
export function PageShell({ eyebrow, title, lede, children, aside, className }: Props) {
  return (
    <div className={cn("relative", className)}>
      <header className="u-gutter relative border-b border-[color:var(--hairline)] pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div
          aria-hidden="true"
          className="u-graticule pointer-events-none absolute inset-0 opacity-30"
        />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-16">
          <div>
            <InstrumentLabel tone="gold">{eyebrow}</InstrumentLabel>
            <h1 className="u-display-1 mt-6 max-w-[16ch] text-bone">{title}</h1>
            {lede ? <p className="u-lede u-measure mt-8">{lede}</p> : null}
          </div>
          {aside ? <div className="lg:pb-2">{aside}</div> : null}
        </div>
      </header>
      {children}
    </div>
  );
}

/** A numbered section band, used throughout the interior routes. */
export function Section({
  index,
  title,
  children,
  id,
  className,
}: {
  index?: string;
  title?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "u-gutter scroll-mt-24 border-b border-[color:var(--hairline)] py-16 sm:py-24",
        className,
      )}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      {(index || title) && (
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
          {index ? <InstrumentLabel className="shrink-0 pt-1">{index}</InstrumentLabel> : null}
          {title ? (
            <h2 id={id ? `${id}-heading` : undefined} className="u-display-3 text-bone">
              {title}
            </h2>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}
