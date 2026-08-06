"use client";

import { useEffect, useState } from "react";
import { getTimeLeft, cn, type TimeLeft } from "@/lib/utils";

type Props = {
  target: string;
  variant?: "inline" | "blocks";
  onDark?: boolean;
  expiredLabel?: string;
  className?: string;
};

/**
 * The first paint is deliberately empty: the server has no idea what "now" is
 * in the visitor's timezone, so rendering a value there would cause a
 * hydration mismatch and a visible flicker.
 */
export function Countdown({
  target,
  variant = "inline",
  onDark = false,
  expiredLabel = "Deadline passed",
  className,
}: Props) {
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setLeft(getTimeLeft(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!left) {
    return (
      <span
        className={cn("inline-block", className)}
        aria-hidden="true"
        // Reserves the row so nothing shifts when the value arrives.
        style={{ minHeight: variant === "blocks" ? "4.5rem" : "1.25rem" }}
      />
    );
  }

  if (left.expired) {
    return (
      <span
        className={cn(
          "font-display text-sm font-semibold",
          onDark ? "text-white/80" : "text-ink-soft",
          className,
        )}
      >
        {expiredLabel}
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={cn("font-display font-semibold tabular-nums", className)}
        aria-label={`${left.days} days, ${left.hours} hours and ${left.minutes} minutes remaining`}
      >
        {left.days}d : {String(left.hours).padStart(2, "0")}h :{" "}
        {String(left.minutes).padStart(2, "0")}m :{" "}
        {String(left.seconds).padStart(2, "0")}s
      </span>
    );
  }

  const blocks = [
    { value: left.days, label: "Days" },
    { value: left.hours, label: "Hours" },
    { value: left.minutes, label: "Minutes" },
    { value: left.seconds, label: "Seconds" },
  ];

  return (
    <div
      className={cn("flex gap-2.5 sm:gap-3", className)}
      role="timer"
      aria-live="off"
      aria-label={`${left.days} days remaining until the deadline`}
    >
      {blocks.map((block) => (
        <div
          key={block.label}
          className={cn(
            "min-w-[4.25rem] flex-1 rounded-xl px-2 py-3 text-center sm:min-w-[5rem]",
            onDark
              ? "glass-panel"
              : "border border-line bg-white shadow-[0_10px_24px_-20px_rgba(9,43,114,0.6)]",
          )}
        >
          <div
            className={cn(
              "font-display text-2xl font-bold tabular-nums sm:text-3xl",
              onDark ? "text-white" : "text-deep",
            )}
          >
            {String(block.value).padStart(2, "0")}
          </div>
          <div
            className={cn(
              "mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em]",
              onDark ? "text-white/65" : "text-ink-soft",
            )}
          >
            {block.label}
          </div>
        </div>
      ))}
    </div>
  );
}
