"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot intersection flag used for editorial reveals.
 *
 * Reveal is a presentation detail: the element is in the document, readable by
 * assistive technology and by a crawler, before it is ever seen (§42, §45).
 */
export function useInView<T extends HTMLElement>(rootMargin = "-12% 0px -12% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver !== "function") {
      // No observer: reveal on the next frame rather than synchronously, so
      // this stays a scheduled update rather than a cascading render.
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
