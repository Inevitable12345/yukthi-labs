"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, Phone, Send, TriangleAlert } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  conferenceEmail,
  contacts,
  departments,
  enquiryTypes,
} from "@/content/contacts";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "enquiry" | "message", string>>;

export function ContactSection({ heading = true }: { heading?: boolean }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Honeypot: real people never fill a field they cannot see.
    if ((data.get("website") as string)?.trim()) return;

    const name = (data.get("name") as string)?.trim() ?? "";
    const email = (data.get("email") as string)?.trim() ?? "";
    const enquiry = (data.get("enquiry") as string) ?? "";
    const department = (data.get("department") as string) ?? "";
    const message = (data.get("message") as string)?.trim() ?? "";

    const nextErrors: Errors = {};
    if (name.length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      nextErrors.email = "Please enter a valid email address.";
    if (!enquiry) nextErrors.enquiry = "Please choose an enquiry type.";
    if (message.length < 15)
      nextErrors.message = "Please give us at least a sentence or two.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first problem so keyboard users are not left guessing.
      const firstField = Object.keys(nextErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }

    /**
     * No submission endpoint has been provided by the university yet, so the
     * enquiry is handed to the visitor's mail client rather than posted into a
     * void. To switch to a real backend, replace this block with a POST to the
     * official endpoint and keep the validation above.
     */
    const subject = `[ICRTET-2026] ${enquiry} enquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Enquiry type: ${enquiry}`,
      department ? `Department: ${department}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${conferenceEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setStatus("sent");
    event.currentTarget.reset();
    window.setTimeout(() => setStatus("idle"), 8000);
  }

  return (
    <section
      id="contact"
      className="relative bg-white py-20 lg:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="container-page">
        {heading && (
          <SectionHeading
            eyebrow="Contact & Support"
            title="Talk to the organising secretaries"
            lead="For registration, submission, payment or publication questions, reach the team directly by phone or email."
            align="center"
          />
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
          {/* Contact cards */}
          <div>
            <RevealGroup step={0.08} className="space-y-3.5">
              {contacts.map((contact) => (
                <RevealItem key={contact.phoneHref}>
                  <article className="card-surface p-5">
                    <h3 className="text-[1.02rem]">{contact.name}</h3>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {contact.role} · {contact.institution}
                    </p>
                    <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                      <a
                        href={`tel:${contact.phoneHref}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-surface-blue px-3 py-2 text-sm font-semibold text-royal transition-colors hover:bg-royal hover:text-white"
                      >
                        <Phone className="size-4" aria-hidden="true" />
                        {contact.phone}
                      </a>
                      <CopyButton value={contact.phone} label={`${contact.name}'s phone number`} />
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1} className="mt-4">
              <div className="rounded-2xl border border-line bg-gradient-to-br from-deep to-royal p-5 text-white">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-cyan">
                  <Mail className="size-4" aria-hidden="true" />
                  Conference email
                </p>
                <a
                  href={`mailto:${conferenceEmail}`}
                  className="mt-2 block break-all font-display text-lg font-bold underline-offset-4 hover:underline"
                >
                  {conferenceEmail}
                </a>
                <div className="mt-3">
                  <CopyButton
                    value={conferenceEmail}
                    label="conference email address"
                    className="border-white/25 bg-white/10 text-white hover:border-white/50 hover:text-white"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Enquiry form */}
          <Reveal delay={0.05}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
              aria-describedby="form-intro"
            >
              <h3 className="text-xl">Send an enquiry</h3>
              <p id="form-intro" className="mt-1.5 text-sm text-ink-soft">
                Fields marked with an asterisk are required.
              </p>

              {/* Honeypot — hidden from people, tempting to bots. */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  name="name"
                  required
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  label="Email address"
                  name="email"
                  type="email"
                  required
                  error={errors.email}
                  autoComplete="email"
                />

                <SelectField
                  label="Enquiry type"
                  name="enquiry"
                  required
                  error={errors.enquiry}
                  options={[...enquiryTypes]}
                  placeholder="Select an enquiry type"
                />
                <SelectField
                  label="Department"
                  name="department"
                  options={[...departments]}
                  placeholder="No preference"
                />
              </div>

              <div className="mt-4">
                <Field
                  label="Message"
                  name="message"
                  as="textarea"
                  required
                  error={errors.message}
                />
              </div>

              <button
                type="submit"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-royal to-violet px-6 py-3.5 font-display font-semibold text-white shadow-[0_12px_28px_-14px_rgba(18,71,181,0.9)] transition-[transform,filter] hover:brightness-110 active:scale-[0.985] sm:w-auto"
              >
                <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                Send enquiry
              </button>

              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                Submitting opens your email application with the enquiry
                prepared, addressed to {conferenceEmail}. Your details are not
                stored by this website.
              </p>

              {/* Toast confirmation — entrance-only, unmounts when it expires
                  so a stale success message is never left in the a11y tree. */}
              {status === "sent" && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  role="status"
                  className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald/35 bg-emerald/10 px-4 py-3 text-sm text-ink"
                >
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-emerald" aria-hidden="true" />
                  Your enquiry is ready in your email application. Please press
                  send there to deliver it to the organising committee.
                </motion.p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  as = "input",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  as?: "input" | "textarea";
  autoComplete?: string;
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const shared = cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-ink transition-colors",
    "placeholder:text-ink-soft/60 focus:border-royal",
    error ? "border-crimson" : "border-line hover:border-royal/40",
  );

  return (
    <div className={as === "textarea" ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-deep">
        {label}
        {required && (
          <span className="ml-0.5 text-crimson" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(shared, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={shared}
        />
      )}

      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-sm text-crimson">
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-deep">
        {label}
        {required && (
          <span className="ml-0.5 text-crimson" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-ink transition-colors focus:border-royal",
          error ? "border-crimson" : "border-line hover:border-royal/40",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-sm text-crimson">
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
