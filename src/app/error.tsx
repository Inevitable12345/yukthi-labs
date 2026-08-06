"use client";

import { useEffect } from "react";
import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { conferenceEmail } from "@/content/contacts";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the browser console and any attached monitoring.
    console.error("ICRTET-2026 route error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center bg-surface py-24">
      <div className="container-page text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-crimson/10 text-crimson">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </span>

        <h1 className="mt-6 text-2xl sm:text-3xl">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          This page could not be displayed. Please try again — if the problem
          continues, let the organising committee know at{" "}
          <a
            href={`mailto:${conferenceEmail}`}
            className="font-semibold text-royal underline underline-offset-4"
          >
            {conferenceEmail}
          </a>
          .
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-ink-soft">
            Reference: <code className="font-mono">{error.digest}</code>
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            onClick={reset}
            icon={<RotateCw className="size-4" aria-hidden="true" />}
          >
            Try again
          </Button>
          <Button href="/" variant="outline">
            Back to homepage
          </Button>
        </div>
      </div>
    </section>
  );
}
