import { cn } from "@/lib/utils/cn";

/**
 * The mark is an astrolabe reduced to its argument: a ring, a meridian, and one
 * node that sits off the axis. Drawn rather than lettered so it holds at 16px
 * in a browser tab and at display size in the finale.
 */
export function Wordmark({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 overflow-visible"
        fill="none"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <ellipse
          cx="12"
          cy="12"
          rx="3.6"
          ry="9"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="17.4" cy="7.2" r="1.9" fill="var(--color-brass)" />
      </svg>
      {withText ? (
        <span className="font-mono text-[0.78rem] tracking-[0.26em] uppercase">Yukthi Lab</span>
      ) : null}
    </span>
  );
}
