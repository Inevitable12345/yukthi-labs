"use client";

import { useEffect, useRef, useState } from "react";

import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";

type FieldErrors = Record<string, string[] | undefined>;

/**
 * Collaboration enquiry form.
 *
 * Five fields and a consent checkbox. Native validation attributes are present so
 * the form is usable before hydration; server-side Zod validation is authoritative
 * and its field errors are rendered against the inputs they belong to.
 */
export function CollaborationForm() {
  // Set on mount, not during render: reading the clock while rendering is impure.
  const mountedAt = useRef<number>(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("sending");
    setFieldErrors({});
    setMessage("");
    track("contact_intent", { form: "collaboration" });

    try {
      const elapsedMs = mountedAt.current > 0 ? Date.now() - mountedAt.current : undefined;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          organization: String(data.get("organization") ?? ""),
          role: String(data.get("role") ?? ""),
          message: String(data.get("message") ?? ""),
          consent: data.get("consent") === "on",
          website: String(data.get("website") ?? ""),
          elapsedMs,
        }),
      });

      const body: { ok: boolean; error?: string; fieldErrors?: FieldErrors } =
        await response.json();

      if (body.ok) {
        setState("sent");
        form.reset();
        return;
      }

      setState("error");
      setFieldErrors(body.fieldErrors ?? {});
      setMessage(body.error ?? "Something went wrong. Nothing was sent.");
    } catch {
      setState("error");
      setMessage("The request could not be completed. Nothing was sent.");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="border border-[color:var(--color-gold-dim)] p-8">
        <InstrumentLabel tone="gold">Received</InstrumentLabel>
        <p className="u-display-3 mt-4 text-bone">Thank you.</p>
        <p className="u-body mt-4 max-w-md">
          Your note has been received. If a decision or risk is described in it, that is what
          will be read first.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          name="name"
          label="Name"
          autoComplete="name"
          errors={fieldErrors.name}
          required
        />
        <Field
          name="email"
          label="Work email"
          type="email"
          autoComplete="email"
          errors={fieldErrors.email}
          required
        />
        <Field
          name="organization"
          label="Organisation"
          autoComplete="organization"
          errors={fieldErrors.organization}
          required
        />
        <Field
          name="role"
          label="Role"
          autoComplete="organization-title"
          errors={fieldErrors.role}
          required
        />
      </div>

      <div className="mt-8">
        <Field
          name="message"
          label="What consequential decision or risk are you trying to understand?"
          textarea
          errors={fieldErrors.message}
          required
        />
      </div>

      {/* Honeypot. Hidden from people and from assistive technology alike. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--color-gold)]"
        />
        <span className="text-[0.8125rem] leading-relaxed text-muted-bone">
          I am happy for Yukthi Lab to hold these details in order to reply. They will not be
          used for anything else, and will not be shared.
        </span>
      </label>
      {fieldErrors.consent ? <FieldError messages={fieldErrors.consent} /> : null}

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="group inline-flex min-h-11 items-baseline gap-3 border-b border-[color:var(--hairline-strong)] pb-1 font-mono text-[0.6875rem] tracking-[0.2em] text-bone uppercase transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {state === "sending" ? "Sending" : "Send enquiry"}
          <span
            aria-hidden="true"
            className="text-gold transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
        <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-dim-bone uppercase">
          Five fields · no tracking attached
        </p>
      </div>

      {state === "error" && message ? (
        <p role="alert" className="mt-6 text-[0.8125rem] leading-relaxed text-rupture">
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  textarea = false,
  errors,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  errors?: string[];
  required?: boolean;
}) {
  const id = `contact-${name}`;
  const describedBy = errors?.length ? `${id}-error` : undefined;

  const shared = cn(
    "mt-2 w-full border-b bg-transparent py-3 text-[0.9375rem] text-bone outline-none transition-colors",
    "placeholder:text-dim-bone focus:border-gold",
    errors?.length
      ? "border-[color:var(--color-rupture)]"
      : "border-[color:var(--hairline-strong)]",
  );

  return (
    <div className={textarea ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="u-instrument block text-muted-bone">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={errors?.length ? true : undefined}
          className={cn(shared, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={errors?.length ? true : undefined}
          className={shared}
        />
      )}
      {errors?.length ? <FieldError id={`${id}-error`} messages={errors} /> : null}
    </div>
  );
}

function FieldError({ id, messages }: { id?: string; messages: string[] }) {
  return (
    <p id={id} className="mt-2 text-[0.75rem] leading-relaxed text-rupture">
      {messages.join(" ")}
    </p>
  );
}
