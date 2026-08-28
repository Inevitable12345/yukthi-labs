import { cn } from "@/lib/utils/cn";

/**
 * A mechanism ladder: an ordered sequence rendered as a list, not as decoration.
 * It is a real `<ol>` so the order survives without CSS, and the connective
 * arrows are `aria-hidden` so a screen reader hears the steps, not the glyphs.
 */
export function Ladder({
  steps,
  title,
  className,
  dense = false,
}: {
  steps: readonly string[];
  title?: string;
  className?: string;
  dense?: boolean;
}) {
  return (
    <figure className={cn("not-prose", className)}>
      {title ? <figcaption className="label-dim mb-3">{title}</figcaption> : null}
      <ol className={cn("border-l border-graphite pl-4", dense ? "space-y-1" : "space-y-2")}>
        {steps.map((step, index) => (
          <li key={`${step}-${index}`} className="flex items-baseline gap-3">
            <span aria-hidden="true" className="font-mono text-[0.625rem] text-brass-dim">
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <span className="font-mono text-[0.78rem] leading-relaxed tracking-[0.11em] text-bone/85">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
