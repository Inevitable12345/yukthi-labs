import type { Variants, Transition } from "framer-motion";

/**
 * Shared motion vocabulary.
 *
 * Only `opacity`, `transform` and `filter` are animated so every transition
 * stays on the compositor. Nothing here animates layout properties.
 */

export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -34 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: easeOut } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 34 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: easeOut } },
};

/** Parent wrapper that staggers its children into view. */
export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** Standard once-only scroll trigger: fires slightly before full visibility. */
export const inViewOnce = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -80px 0px",
} as const;

/** Word-by-word reveal used for large display headings. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOut },
  },
};
