import { SITE } from "@/lib/metadata/site";

/* ACT 01 — INVOCATION
   Nearly empty. One statement, a horizon behind it, one way down. No call to
   action, because there is nothing to ask for yet.

   The field behind this act belongs to the world layer, which runs the length of
   the page: here it is barely resolved — a horizon line and a few distant points
   that have not yet been connected to anything. */
export function Invocation() {
  return (
    <section
      id="invocation"
      aria-labelledby="invocation-heading"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden"
    >
      <div aria-hidden="true" className="u-vignette pointer-events-none absolute inset-0" />

      <div className="u-gutter relative flex flex-1 flex-col justify-center pt-28 pb-16 sm:pt-32">
        <p
          className="u-instrument u-rise flex flex-wrap items-center gap-x-4 gap-y-1"
          style={{ ["--delay" as string]: "120ms" }}
        >
          <span className="text-gold">Act 01</span>
          <span aria-hidden="true">·</span>
          <span>Invocation</span>
        </p>

        <h1
          id="invocation-heading"
          className="u-display-1 u-rise mt-10 max-w-[14ch] text-bone"
          style={{ ["--delay" as string]: "260ms" }}
        >
          {SITE.mission}
        </h1>

        <p
          className="u-rise mt-10 max-w-md font-mono text-[0.6875rem] leading-relaxed tracking-[0.2em] text-muted-bone uppercase"
          style={{ ["--delay" as string]: "520ms" }}
        >
          A world model for consequential decisions.
        </p>
      </div>

      <div className="u-gutter relative border-t border-[color:var(--hairline)] py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href="#stable-world"
            className="group inline-flex min-h-11 items-center gap-4 font-mono text-[0.625rem] tracking-[0.24em] text-muted-bone uppercase transition-colors hover:text-gold"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1"
            >
              ↓
            </span>
            Begin the argument
          </a>
          <p className="font-mono text-[0.5625rem] tracking-[0.24em] text-dim-bone uppercase tabular-nums">
            12 acts · evidence attached throughout
          </p>
        </div>
      </div>
    </section>
  );
}
