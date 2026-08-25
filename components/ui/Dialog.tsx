"use client";

import { useEffect, useRef } from "react";

import { useFocusTrap } from "@/lib/utils/use-focus-trap";
import { cn } from "@/lib/utils/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Rendered as the dialog's description for screen readers. */
  description?: string;
  labelledBy?: string;
  children: React.ReactNode;
  /** "drawer" docks right on desktop and bottom on mobile. "panel" is centred. */
  variant?: "drawer" | "panel";
  className?: string;
};

/**
 * Accessible modal surface: role=dialog, aria-modal, focus trap, Escape to close,
 * focus restored on unmount, background scroll locked, backdrop click closes.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  labelledBy,
  children,
  variant = "panel",
  className,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const titleId = labelledBy ?? "dialog-title";

  return (
    <div className="fixed inset-0 z-[90] flex" role="presentation">
      <button
        type="button"
        aria-label={`Close ${title}`}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-void/85 backdrop-blur-[2px]"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? `${titleId}-description` : undefined}
        tabIndex={-1}
        className={cn(
          "relative z-10 border border-[color:var(--hairline-strong)] bg-deep-field shadow-[0_0_0_1px_rgba(7,8,8,0.9)] outline-none",
          variant === "drawer"
            ? "ml-auto flex h-full w-full max-w-[min(30rem,100vw)] flex-col overflow-y-auto sm:border-l"
            : "m-auto flex max-h-[min(46rem,90vh)] w-[min(46rem,calc(100vw-2rem))] flex-col overflow-y-auto",
          className,
        )}
      >
        {description ? (
          <p id={`${titleId}-description`} className="u-sr-only">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
