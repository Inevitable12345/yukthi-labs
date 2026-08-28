import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function PullQuote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("headline max-w-[22ch] text-white-hot", className)}>
      <span aria-hidden="true" className="mr-3 inline-block h-px w-10 align-middle bg-brass" />
      {children}
    </p>
  );
}
