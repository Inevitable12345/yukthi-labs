"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[yukthi] unhandled", error);
  }, [error]);

  return (
    <div className="px-5 pt-36 sm:px-8">
      <div className="mx-auto max-w-[86rem]">
        <p className="label">Yukthi / Observatory / fault</p>
        <h1 className="display mt-5 max-w-[20ch]">The instrument stopped responding.</h1>
        <p className="standfirst mt-6 max-w-[52ch]">
          Something failed while rendering this view. The argument itself is intact — the thesis
          page carries all of it as plain text.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <button
            type="button"
            onClick={reset}
            className="border border-brass px-5 py-2.5 font-mono text-[0.72rem] tracking-[0.18em] uppercase text-brass transition-colors hover:bg-brass hover:text-void"
          >
            Try again
          </button>
          <a
            href="/thesis"
            className="border border-graphite px-5 py-2.5 font-mono text-[0.72rem] tracking-[0.18em] uppercase text-ash transition-colors hover:text-bone"
          >
            Read the thesis
          </a>
        </div>
      </div>
    </div>
  );
}
