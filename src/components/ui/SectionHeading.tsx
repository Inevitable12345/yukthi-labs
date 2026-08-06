import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  /** Heading level — keeps the document outline correct on every page. */
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  onDark = false,
  className,
  as: Tag = "h2",
}: Props) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow mb-3", onDark && "text-cyan")}>
          <span
            aria-hidden="true"
            className={cn(
              "inline-block h-px w-7",
              onDark ? "bg-cyan/70" : "bg-royal/50",
            )}
          />
          {eyebrow}
        </p>
      )}

      <Tag
        className={cn(
          "text-balance text-3xl sm:text-4xl lg:text-[2.75rem]",
          onDark && "text-white",
        )}
      >
        {title}
      </Tag>

      {lead && (
        <p
          className={cn(
            "mt-4 text-[1.05rem] leading-relaxed",
            onDark ? "text-white/75" : "text-ink-soft",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
