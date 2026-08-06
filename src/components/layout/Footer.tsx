import Link from "next/link";
import { CalendarDays, Mail, MapPin, MonitorPlay } from "lucide-react";
import { conference } from "@/content/conference";
import { footerNavigation } from "@/content/navigation";
import { scsvmv, tnteu } from "@/content/institutions";
import { conferenceEmail, contacts } from "@/content/contacts";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-deep text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 size-[30rem] rounded-full bg-royal/35 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-[26rem] rounded-full bg-violet/25 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-[0.14] mix-blend-overlay" />
      </div>

      {/* Tagline band */}
      <div className="relative border-b border-white/10">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-6 text-center">
          {conference.taglines.map((tagline, index) => (
            <span key={tagline} className="flex items-center gap-8">
              <span className="font-display text-sm font-semibold tracking-wide text-white/85 sm:text-base">
                {tagline}
              </span>
              {index < conference.taglines.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden size-1.5 rounded-full bg-cyan/70 sm:block"
                />
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="container-page relative grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
        {/* Identity */}
        <div>
          <p className="font-display text-2xl font-bold">
            {conference.acronym}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
            {conference.ordinal} on {conference.title}, organised by the{" "}
            School of Education, {scsvmv.shortName}, in association with{" "}
            {tnteu.shortName}.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-white/75">
            <li className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
              <span>{conference.dates.label}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MonitorPlay className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
              <span>{conference.mode}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
              <span>{scsvmv.address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
              <a
                href={`mailto:${conferenceEmail}`}
                className="break-all underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {conferenceEmail}
              </a>
            </li>
          </ul>
        </div>

        {/* Link columns */}
        {footerNavigation.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Contact strip */}
      <div className="relative border-t border-white/10">
        <div className="container-page grid gap-4 py-7 sm:grid-cols-3">
          {contacts.map((contact) => (
            <div key={contact.phoneHref}>
              <p className="text-sm font-semibold text-white">{contact.name}</p>
              <p className="text-xs text-white/60">
                {contact.role} · {contact.institution}
              </p>
              <a
                href={`tel:${contact.phoneHref}`}
                className="mt-1 inline-block text-sm text-cyan underline-offset-4 hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-white/55 sm:flex-row sm:text-left">
          <p>
            © {year} {scsvmv.name}. All rights reserved.
          </p>
          <p>
            {scsvmv.accreditation}
          </p>
        </div>
      </div>
    </footer>
  );
}
