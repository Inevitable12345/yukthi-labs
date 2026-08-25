import type { EvidenceStatus } from "@/data/schema";
import { cn } from "@/lib/utils/cn";

const STATUS: Record<EvidenceStatus, { label: string; className: string }> = {
  verified: {
    label: "Verified",
    className: "border-[color:var(--color-steel-dim)] text-steel",
  },
  "needs-verification": {
    label: "Needs verification",
    className: "border-[color:var(--color-gold-dim)] text-gold",
  },
  illustrative: {
    label: "Illustrative",
    className: "border-[color:var(--color-rupture-deep)] text-rupture",
  },
};

/** Verification state of a source record. Never omitted, never implied. */
export function EvidenceStatusChip({
  status,
  className,
}: {
  status: EvidenceStatus;
  className?: string;
}) {
  const config = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.16em] uppercase",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
