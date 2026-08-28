"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/accessibility/use-in-view";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds. Neutralised under reduced motion by the stylesheet. */
  delay?: number;
};

/**
 * Editorial reveal. The content is in the document from the first byte — this
 * only decides when it becomes visible, so crawlers and screen readers are
 * never waiting on an intersection (§42, §45).
 */
export function Reveal({ children, className, delay = 0 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-in-view={inView ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
