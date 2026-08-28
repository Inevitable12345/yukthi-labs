import { cn } from "@/lib/utils/cn";

export function Hairline({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rule w-full", className)} />;
}
