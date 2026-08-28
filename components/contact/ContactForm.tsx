"use client";

import { useId, useState } from "react";
import { INTENTS, contactSchema } from "@/lib/contact/schema";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "submitting" | "sent" | "error";

/**
 * The contact form. Validated client-side for the reader's benefit and again on
 * the server because client validation is a courtesy, not a control (§43).
 *
 * Errors are announced through a live region and the message field is wired to
 * its hint with `aria-describedby`, so a keyboard or screen-reader visitor gets
 * the same correction a sighted one does (§42).
 */
export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setStatus("error");
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("The request could not be sent. Please try again, or write to us directly.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="panel p-7">
        <p className="label">Received</p>
        <p className="standfirst mt-3 max-w-[44ch]">
          Thank you. A person reads every message that arrives here.
        </p>
      </div>
    );
  }

  const fieldClass =
    "w-full border border-graphite bg-ink/60 px-3 py-2.5 text-[0.92rem] text-bone placeholder:text-ash focus:border-brass focus:outline-none";

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="label-dim">
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            className={cn(fieldClass, "mt-2")}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="label-dim">
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={cn(fieldClass, "mt-2")}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-organization`} className="label-dim">
            Organisation <span className="normal-case">(optional)</span>
          </label>
          <input
            id={`${id}-organization`}
            name="organization"
            autoComplete="organization"
            className={cn(fieldClass, "mt-2")}
          />
        </div>
        <div>
          <label htmlFor={`${id}-intent`} className="label-dim">
            Subject
          </label>
          <select
            id={`${id}-intent`}
            name="intent"
            defaultValue="research"
            className={cn(fieldClass, "mt-2")}
          >
            {INTENTS.map((intent) => (
              <option key={intent.value} value={intent.value}>
                {intent.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="label-dim">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={7}
          required
          aria-describedby={`${id}-message-hint`}
          className={cn(fieldClass, "mt-2 resize-y")}
        />
        <p
          id={`${id}-message-hint`}
          className="mt-2 font-mono text-[0.66rem] tracking-[0.08em] text-ash"
        >
          Twenty characters minimum. Please say what you are working on — it is the only way to give
          a useful reply.
        </p>
      </div>

      {/* Honeypot. Hidden from view and from assistive technology alike. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {error ? (
          <p className="font-mono text-[0.72rem] tracking-[0.08em] text-rupture">{error}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-brass px-6 py-3 font-mono text-[0.72rem] tracking-[0.2em] uppercase text-brass transition-colors hover:bg-brass hover:text-void disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
