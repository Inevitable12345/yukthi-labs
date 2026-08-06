"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { easeOut } from "@/lib/motion";

/**
 * Soft entrance for each route.
 *
 * Deliberately entrance-only: an exit animation would hold the outgoing page in
 * the tree and fight Next.js's scroll restoration, which is exactly the kind of
 * "long loading animation" the brief rules out.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
