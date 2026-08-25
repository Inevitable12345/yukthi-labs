import { cn } from "@/lib/utils/cn";

/**
 * Long-form reading surface. Deliberately narrow, deliberately unstyled beyond
 * rhythm — the type does the work.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "u-measure text-[0.9375rem] leading-[1.75] text-muted-bone",
        "[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:font-mono [&_h2]:text-[0.6875rem] [&_h2]:tracking-[0.18em] [&_h2]:text-gold [&_h2]:uppercase",
        "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[0.9375rem] [&_h3]:text-bone",
        "[&_p]:mb-5",
        "[&_ul]:mb-6 [&_ul]:space-y-2.5 [&_ul]:pl-0",
        "[&_li]:relative [&_li]:pl-5",
        "[&_li]:before:absolute [&_li]:before:top-[0.7em] [&_li]:before:left-0 [&_li]:before:h-px [&_li]:before:w-2.5 [&_li]:before:bg-[color:var(--hairline-strong)] [&_li]:before:content-['']",
        "[&_strong]:font-medium [&_strong]:text-bone",
        "[&_a]:text-bone [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[color:var(--hairline-strong)] hover:[&_a]:decoration-gold",
        "[&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:text-steel",
        "[&_dl]:mb-6 [&_dt]:mt-5 [&_dt]:font-mono [&_dt]:text-[0.6875rem] [&_dt]:tracking-[0.16em] [&_dt]:text-dim-bone [&_dt]:uppercase [&_dd]:mt-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
