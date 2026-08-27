"use client";

import { useId, useRef, useState } from "react";

import { contactSchema, fieldErrors, type ContactFieldErrors } from "@/lib/contact/schema";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   CONTACT FORM (§33, §34)
   ----------------------------------------------------------------------------
   Accessibility is the substance of this component:
     · every input has a real <label>, not a placeholder standing in for one;
     · errors are tied to inputs with aria-describedby and aria-invalid;
     · the status region is a live region, so success and failure are announced;
     · on failure focus moves to the first field with an error;
     · the submit button reports its own busy state rather than only spinning.

   The honeypot is hidden from sight and from assistive technology, and is not
   reachable by keyboard — a screen reader user must never be asked to fill in a
   trap field.
   ========================================================================== */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; message: string }
  | { kind: "error"; message: string };

export function ContactForm() {
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<ContactFieldErrors>({});

  const focusFirstError = (found: ContactFieldErrors) => {
    const first = Object.keys(found)[0];
    if (!first) return;
    const element = formRef.current?.elements.namedItem(first);
    if (element instanceof HTMLElement) element.focus();
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      const found = fieldErrors(parsed.error);
      setErrors(found);
      setStatus({ kind: "error", message: "Some fields need attention." });
      focusFirstError(found);
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const body = (await response.json()) as {
        ok: boolean;
        message: string;
        errors?: ContactFieldErrors;
      };

      if (!response.ok || !body.ok) {
        if (body.errors) {
          setErrors(body.errors);
          focusFirstError(body.errors);
        }
        setStatus({ kind: "error", message: body.message ?? "Something went wrong." });
        return;
      }

      setStatus({ kind: "sent", message: body.message });
      formRef.current?.reset();
    } catch {
      setStatus({
        kind: "error",
        message: "Could not reach the server. Please try again, or email directly.",
      });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-gold-dim p-8">
        <InstrumentLabel tone="gold">Received</InstrumentLabel>
        <p className="u-body mt-4">{status.message}</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="u-instrument mt-6 border-b border-[color:var(--hairline-strong)] pb-1 transition-colors hover:border-bone hover:text-bone"
        >
          Send another
        </button>
      </div>
    );
  }

  const busy = status.kind === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      <Field
        id={`${baseId}-name`}
        name="name"
        label="Name"
        autoComplete="name"
        error={errors.name}
        required
      />

      <Field
        id={`${baseId}-email`}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        required
      />

      <Field
        id={`${baseId}-organization`}
        name="organization"
        label="Organisation"
        hint="Optional"
        autoComplete="organization"
        error={errors.organization}
      />

      <Field
        id={`${baseId}-context`}
        name="context"
        label="What is your 3 a.m. problem?"
        hint="The decision you are worried about, and what would have to break for it to matter."
        error={errors.context}
        multiline
        required
      />

      {/* Honeypot. Hidden visually, from assistive technology, and from tab order. */}
      <div aria-hidden="true" className="u-sr-only">
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input
          id={`${baseId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "border px-6 py-3.5 font-mono text-[0.6875rem] tracking-[0.18em] uppercase transition-colors",
            busy
              ? "cursor-wait border-[color:var(--hairline)] text-dim-bone"
              : "border-gold text-gold hover:bg-gold hover:text-void",
          )}
        >
          {busy ? "Sending…" : "Send"}
        </button>

        {/* Live region: announced on both success and failure. */}
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "u-instrument",
            status.kind === "error" ? "text-rupture" : "text-dim-bone",
          )}
        >
          {status.kind === "error" ? status.message : busy ? "Sending" : ""}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  hint,
  error,
  type = "text",
  autoComplete,
  multiline = false,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name,
    autoComplete,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: cn(
      "mt-3 w-full border bg-transparent px-4 py-3 text-[0.9375rem] text-bone transition-colors",
      "placeholder:text-dim-bone focus:outline-none",
      error
        ? "border-rupture focus:border-rupture"
        : "border-[color:var(--hairline)] focus:border-gold",
    ),
  } as const;

  return (
    <div>
      <label htmlFor={id} className="u-instrument text-bone">
        {label}
        {required ? (
          <span className="text-gold" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="u-body mt-2 text-[0.8125rem]">
          {hint}
        </p>
      ) : null}

      {multiline ? <textarea {...shared} rows={6} /> : <input {...shared} type={type} />}

      {error ? (
        <p id={errorId} className="u-instrument mt-2 text-rupture">
          {error}
        </p>
      ) : null}
    </div>
  );
}
