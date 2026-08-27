import { CLAIM_CLASS_DEFINITION, CLAIM_CLASS_LABEL, type ClaimClass } from "@/data/schema";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   EPISTEMIC CLASS (§2)
   ----------------------------------------------------------------------------
   The five classes are visually distinct everywhere they appear. A reader must
   never have to guess whether they are looking at a measurement, a source's
   claim, Yukthi's reading, an explanatory mechanism, or an intention.

   Distinguished by shape and text as well as colour — colour alone is never the
   carrier of meaning (§33).
   ========================================================================== */

const STYLES: Record<ClaimClass, { className: string; glyph: string }> = {
  "observed-fact": { className: "border-steel text-steel", glyph: "◆" },
  "source-claim": { className: "border-steel-dim text-steel", glyph: "◇" },
  "yukthi-interpretation": { className: "border-gold-dim text-gold", glyph: "◈" },
  "illustrative-scenario": {
    className: "border-[color:var(--hairline-strong)] text-dim-bone",
    glyph: "○",
  },
  "product-ambition": { className: "border-rupture-deep text-rupture", glyph: "△" },
};

export function ClaimClassChip({
  claimClass,
  className,
  showDefinition = false,
}: {
  claimClass: ClaimClass;
  className?: string;
  showDefinition?: boolean;
}) {
  const style = STYLES[claimClass];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2 py-1 font-mono text-[0.5625rem] tracking-[0.16em] uppercase",
        style.className,
        className,
      )}
      title={showDefinition ? undefined : CLAIM_CLASS_DEFINITION[claimClass]}
    >
      <span aria-hidden="true">{style.glyph}</span>
      {CLAIM_CLASS_LABEL[claimClass]}
      {showDefinition ? (
        <span className="font-sans text-[0.6875rem] tracking-normal text-muted-bone normal-case">
          — {CLAIM_CLASS_DEFINITION[claimClass]}
        </span>
      ) : null}
    </span>
  );
}

/** The legend, shown once on the homepage and once on /evidence. */
export function ClaimClassLegend({ className }: { className?: string }) {
  const classes: ClaimClass[] = [
    "observed-fact",
    "source-claim",
    "yukthi-interpretation",
    "illustrative-scenario",
    "product-ambition",
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {classes.map((claimClass) => (
        <div key={claimClass}>
          <ClaimClassChip claimClass={claimClass} showDefinition />
        </div>
      ))}
    </div>
  );
}
