"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================================
   GSAP REGISTRATION (§6)
   ----------------------------------------------------------------------------
   Registered exactly once, at module scope, and guarded for the server render.
   Importing this module is the only supported way to get at gsap in this
   codebase — a second `registerPlugin` call elsewhere would silently reset
   ScrollTrigger's internal state.
   ========================================================================== */

let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);

  // ScrollTrigger recalculates on resize by default, but mobile browsers fire
  // resize on every URL-bar show/hide. Ignoring height-only changes stops the
  // whole narrative from re-measuring while the reader is simply scrolling.
  ScrollTrigger.config({ ignoreMobileResize: true });

  registered = true;
}

export { gsap, ScrollTrigger };
