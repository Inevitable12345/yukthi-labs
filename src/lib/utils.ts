/** Minimal class-name joiner — avoids pulling in clsx for a one-line need. */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

/** Breaks the gap between now and `target` into calendar-friendly parts. */
export function getTimeLeft(target: string | Date, now: Date = new Date()): TimeLeft {
  const diff = new Date(target).getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

/** `2026-09-18T09:00:00+05:30` → `20260918T033000Z` for calendar links. */
function toCalendarStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildGoogleCalendarUrl(input: {
  title: string;
  details: string;
  location: string;
  startISO: string;
  endISO: string;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    details: input.details,
    location: input.location,
    dates: `${toCalendarStamp(input.startISO)}/${toCalendarStamp(input.endISO)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Builds an .ics payload as a data URL so no server round-trip is needed. */
export function buildIcsDataUrl(input: {
  title: string;
  details: string;
  location: string;
  startISO: string;
  endISO: string;
  uid: string;
}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ICRTET-2026//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
    `DTSTART:${toCalendarStamp(input.startISO)}`,
    `DTEND:${toCalendarStamp(input.endISO)}`,
    `SUMMARY:${input.title}`,
    `DESCRIPTION:${input.details}`,
    `LOCATION:${input.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
