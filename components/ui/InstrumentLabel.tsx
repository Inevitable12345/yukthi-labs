import { cn } from "@/lib/utils/cn";

/** The small capitalised mono type used for chapter numbers, evidence IDs and state. */
export function InstrumentLabel({
  children,
  className,
  tone = "dim",
  as: Component = "span",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dim" | "gold" | "steel" | "rupture" | "bone";
  as?: "span" | "p" | "div" | "h2" | "h3";
}) {
  const toneClass = {
    dim: "text-dim-bone",
    gold: "text-gold",
    steel: "text-steel",
    rupture: "text-rupture",
    bone: "text-bone",
  }[tone];

  return <Component className={cn("u-instrument", toneClass, className)}>{children}</Component>;
}
