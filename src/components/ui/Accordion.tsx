"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  content: ReactNode;
};

export function Accordion({
  items,
  defaultOpenId,
  className,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} id={item.id} className="scroll-mt-28">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-blue sm:px-6 sm:py-5"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-display text-[1.02rem] font-semibold text-deep">
                    {item.title}
                  </span>
                  {item.meta && (
                    <span className="text-sm text-ink-soft">{item.meta}</span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-royal transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>

            {/* Entrance-only, and the panel unmounts the moment it closes.
                Animating it out left the panel at height:0 but still present
                in the accessibility tree — a screen reader would read answers
                the user had collapsed. Opening animates; closing is instant. */}
            {isOpen && (
              <motion.div
                id={`${item.id}-panel`}
                role="region"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.32, ease: easeOut }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 sm:px-6 sm:pb-6">{item.content}</div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
