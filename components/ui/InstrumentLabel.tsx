import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** The small monospace annotation used throughout the exhibition. */
export function InstrumentLabel({
  children,
  dim = false,
  className,
}: {
  children: ReactNode;
  dim?: boolean;
  className?: string;
}) {
  return <p className={cn(dim ? "label-dim" : "label", className)}>{children}</p>;
}
