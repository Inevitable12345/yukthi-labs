import Link from "next/link";
import { CalendarDays, FileText, MapPin, MonitorPlay } from "lucide-react";
import { conference } from "@/content/conference";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { scaleIn } from "@/lib/motion";

const cards = [
  {
    icon: CalendarDays,
    label: "Conference Dates",
    value: conference.dates.label,
    href: "/registration#important-dates",
    accent: "from-royal to-cyan",
  },
  {
    icon: MonitorPlay,
    label: "Mode of Conduct",
    value: conference.mode,
    href: "/about#scope",
    accent: "from-emerald to-cyan",
  },
  {
    icon: MapPin,
    label: "Venue",
    value: "Kanchipuram, Tamil Nadu",
    href: "/venue",
    accent: "from-violet to-lilac",
  },
  {
    icon: FileText,
    label: "Paper Submission Closes",
    value: "September 5, 2026",
    href: "/registration#call-for-papers",
    accent: "from-magenta to-crimson",
  },
];

/** Four facts a first-time visitor needs within the first ten seconds. */
export function QuickInfo() {
  return (
    <section className="relative z-20 -mt-16 sm:-mt-20" aria-label="Conference at a glance">
      <div className="container-page">
        <RevealGroup
          step={0.09}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
        >
          {cards.map((card) => (
            <RevealItem key={card.label} variants={scaleIn}>
              <Link
                href={card.href}
                className="card-surface group flex h-full items-start gap-3.5 p-4 shadow-[0_18px_44px_-28px_rgba(9,43,114,0.6)] lg:p-5"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${card.accent} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  <card.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    {card.label}
                  </span>
                  <span className="mt-1 block font-display text-[1.02rem] font-bold leading-snug text-deep">
                    {card.value}
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
