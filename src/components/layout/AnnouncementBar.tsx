"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { conference } from "@/content/conference";
import { Countdown } from "@/components/ui/Countdown";
import { easeOut } from "@/lib/motion";

const STORAGE_KEY = "icrtet2026:announcement-dismissed";

export function AnnouncementBar() {
  const { announcement } = conference;
  // Starts hidden so a previously dismissed bar never flashes on load.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!announcement.enabled) return;
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setVisible(true);
  }, [announcement.enabled]);

  function dismiss() {
    setVisible(false);
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  }

  if (!announcement.enabled) return null;

  /**
   * Unmounts outright on dismissal rather than animating out. An exit
   * animation left the bar collapsed to height:0 while its link stayed
   * focusable and announced by screen readers.
   */
  if (!visible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="relative overflow-hidden bg-gradient-to-r from-crimson via-magenta to-violet text-white"
    >
      {/* Slow sheen — decorative, disabled under reduced motion. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ animation: "sheen 7s ease-in-out infinite" }}
      />

      <div className="container-page relative flex items-center gap-3 py-2">
        <CalendarClock className="hidden size-4 shrink-0 sm:block" aria-hidden="true" />

        <p className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] font-medium sm:text-sm">
          <span className="truncate sm:whitespace-normal">{announcement.text}</span>
          <Countdown
            target={announcement.deadlineISO}
            onDark
            className="hidden text-[0.78rem] text-white/95 md:inline"
            expiredLabel="Submissions closed"
          />
          <Link
            href={announcement.href}
            className="shrink-0 font-semibold underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            {announcement.linkLabel}
          </Link>
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="-mr-1 shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/15"
          aria-label="Dismiss announcement"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}
