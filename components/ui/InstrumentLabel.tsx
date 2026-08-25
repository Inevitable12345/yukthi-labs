import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "div" | "h2" | "h3" | "h4" | "dt" | "figcaption";
  tone?: "dim" | "bone" | "gold" | "steel" | "rupture";
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  dim: "text-dim-bone",
  bone: "text-muted-bone",
  gold: "text-gold",
  steel: "text-steel",
  rupture: "text-rupture",
};

/** The small mono capital used for section numbers, coordinates and system state. */
export function InstrumentLabel({
  children,
  className,
  as: Tag = "span",
  tone = "dim",
}: Props) {
  return <Tag className={cn("u-instrument", TONE[tone], className)}>{children}</Tag>;
}
