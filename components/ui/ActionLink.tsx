import Link from "next/link";

import { cn } from "@/lib/utils/cn";

/**
 * The site's only call to action style.
 *
 * Deliberately a link rather than a button: every action on this site navigates
 * to something readable. There is no "Book a Demo" (§22).
 */
export function ActionLink({
  href,
  children,
  className,
  external = false,
  tone = "default",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  tone?: "default" | "gold";
}) {
  const classes = cn(
    "group inline-flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.18em] uppercase transition-colors",
    tone === "gold" ? "text-gold hover:text-bone" : "text-muted-bone hover:text-bone",
    className,
  );

  const content = (
    <>
      <span className="border-b border-current pb-1">{children}</span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
