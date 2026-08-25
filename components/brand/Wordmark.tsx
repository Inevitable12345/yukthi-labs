import Link from "next/link";

import { Mark } from "./Mark";
import { cn } from "@/lib/utils/cn";

export function Wordmark({
  className,
  href = "/",
  showLab = true,
}: {
  className?: string;
  href?: string | null;
  showLab?: boolean;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark className="h-6 w-6 text-gold" />
      <span className="flex items-baseline gap-[0.4em] font-mono text-[0.8125rem] tracking-[0.3em] text-bone uppercase">
        Yukthi
        {showLab ? <span className="text-dim-bone">Lab</span> : null}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="group inline-flex" aria-label="Yukthi Lab — home">
      {content}
    </Link>
  );
}
