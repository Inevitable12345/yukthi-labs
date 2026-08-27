import { cn } from "@/lib/utils/cn";

/** A one-pixel rule. Used instead of borders where the line is content, not a container. */
export function Hairline({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={cn("h-px w-full bg-[color:var(--hairline)]", className)}
    />
  );
}
