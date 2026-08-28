import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Every outbound link is `noopener noreferrer` (§43) and says so to assistive
 * technology, because a link that changes context without warning is a
 * navigation failure regardless of how it is styled.
 */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "underline decoration-brass-dim underline-offset-4 transition-colors hover:decoration-brass",
        className,
      )}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
