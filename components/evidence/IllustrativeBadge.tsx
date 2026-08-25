import { cn } from "@/lib/utils/cn";

/**
 * Marks a diagram whose structure is explanatory rather than observed.
 *
 * It is deliberately conspicuous. A reader must never have to work out whether
 * what they are looking at came from a model.
 */
export function IllustrativeBadge({
  label = "Illustrative — not model output",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-[color:var(--color-rupture-deep)] px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.16em] text-rupture uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="block h-1 w-1 rounded-full bg-rupture" />
      {label}
    </span>
  );
}
