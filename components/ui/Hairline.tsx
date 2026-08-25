import { cn } from "@/lib/utils/cn";

/** A one-pixel rule. Used instead of cards, borders and shadows. */
export function Hairline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full bg-[color:var(--hairline)]", className)}
    />
  );
}
