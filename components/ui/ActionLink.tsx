import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
};

/**
 * The site's only link affordance: a label, a rule, and a mark that advances on
 * hover. No pills, no filled buttons.
 */
export function ActionLink({ href, children, className, external = false, onClick }: Props) {
  const content = (
    <>
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-[color:var(--hairline-strong)] transition-[background-color] duration-500 group-hover:bg-gold"
        />
      </span>
      <span
        aria-hidden="true"
        className="inline-block translate-x-0 text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  const classes = cn(
    "group inline-flex items-baseline gap-3 text-sm tracking-[0.04em] text-bone transition-colors duration-300 hover:text-bone",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {content}
    </Link>
  );
}
