import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Crumb = { name: string; path: string };

/**
 * Shared banner for every interior page: breadcrumb, title and optional lead.
 * Keeps the deep-blue identity without repeating the full hero treatment.
 */
export function PageHeader({
  title,
  lead,
  eyebrow,
  breadcrumbs = [],
  children,
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-deep pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
      {/* Decorative wash — purely presentational. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 size-[26rem] rounded-full bg-royal/45 blur-3xl" />
        <div className="absolute -right-16 top-10 size-[22rem] rounded-full bg-violet/35 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 size-[20rem] rounded-full bg-magenta/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-[0.18] mix-blend-overlay" />
      </div>

      <div className="container-page relative">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="text-white">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="transition-colors hover:text-white"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <Reveal>
          {eyebrow && (
            <p className="eyebrow mb-3 text-cyan">
              <span aria-hidden="true" className="inline-block h-px w-7 bg-cyan/70" />
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-4xl text-balance text-3xl text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-white/75">
              {lead}
            </p>
          )}
          {children && <div className="mt-7">{children}</div>}
        </Reveal>
      </div>
    </header>
  );
}
