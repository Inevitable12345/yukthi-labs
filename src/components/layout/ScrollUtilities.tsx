"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, FileText, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Thin gradient bar showing how far down a long page the visitor is. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-royal via-violet to-magenta"
      aria-hidden="true"
    />
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance-only; unmounts when scrolled back to the top so a hidden button
  // never lingers in the tab order. See the note in `ui/Modal`.
  if (!visible) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      /* Sits above the mobile CTA bar so the two never overlap. */
      className="fixed bottom-[5.5rem] right-4 z-[70] grid size-11 place-items-center rounded-full border border-line bg-white text-deep shadow-lg transition-colors hover:border-royal/40 hover:text-royal sm:bottom-6 sm:right-6"
      aria-label="Back to top"
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </motion.button>
  );
}

/**
 * Persistent mobile action bar. Appears after the hero so it never competes
 * with the hero's own calls to action.
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance-only; unmounts while still in the hero so its two links are not
  // focusable behind an off-screen bar. See the note in `ui/Modal`.
  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-[65] border-t border-line bg-white/95 px-3 pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur-xl sm:hidden"
    >
      <div className="flex gap-2.5 pb-3">
        <Link
          href="/registration"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-magenta to-crimson px-4 py-3 font-display text-sm font-semibold text-white shadow-lg"
        >
          <UserPlus className="size-4" aria-hidden="true" />
          Register
        </Link>
        <Link
          href="/registration#call-for-papers"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-3 font-display text-sm font-semibold text-deep"
        >
          <FileText className="size-4" aria-hidden="true" />
          Submit Paper
        </Link>
      </div>
    </motion.div>
  );
}
