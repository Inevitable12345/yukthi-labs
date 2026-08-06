import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "accent" | "outline" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-250 ease-out " +
  "active:scale-[0.975] disabled:pointer-events-none disabled:opacity-55 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-royal to-violet text-white shadow-[0_12px_28px_-14px_rgba(18,71,181,0.9)] " +
    "hover:shadow-[0_18px_36px_-14px_rgba(101,40,184,0.85)] hover:brightness-110",
  accent:
    "bg-gradient-to-r from-magenta to-crimson text-white shadow-[0_12px_28px_-14px_rgba(217,0,88,0.9)] " +
    "hover:shadow-[0_18px_36px_-14px_rgba(169,0,53,0.85)] hover:brightness-110",
  outline:
    "border border-line bg-white text-deep hover:border-royal/50 hover:bg-surface-blue",
  ghost: "text-royal hover:bg-surface-blue",
  onDark:
    "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:border-white/50",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-7 py-3.5 text-base",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Shows an arrow that nudges right on hover. */
  withArrow?: boolean;
  icon?: ReactNode;
};

type ButtonAsLink = BaseProps & {
  href: string;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "children" | "className">;

type ButtonAsButton = BaseProps &
  Omit<ComponentProps<"button">, "children" | "className"> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    withArrow,
    icon,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          className="size-4 transition-transform duration-250 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, external, ...anchorProps } = rest as ButtonAsLink;
    const isExternal =
      external ?? (/^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:"));

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...anchorProps}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {inner}
      </Link>
    );
  }

  const { ...buttonProps } = rest as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {inner}
    </button>
  );
}
