import { cn } from "@/lib/utils/cn";

/**
 * The Yukthi mark: an observation ring, a horizon, and a three-node hyperedge
 * resolving to a single downstream consequence. Geometry, not illustration.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-7 w-7", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle
        cx="16"
        cy="16"
        r="14.25"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="1"
      />
      <circle
        cx="16"
        cy="16"
        r="9.5"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1"
      />
      <path d="M1.75 16H30.25" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
      <path
        d="M8.4 10.6 16 16m7.6-5.4L16 16m0 0v6.9"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <circle cx="8.4" cy="10.6" r="1.7" fill="currentColor" fillOpacity="0.85" />
      <circle cx="23.6" cy="10.6" r="1.7" fill="currentColor" fillOpacity="0.85" />
      <circle cx="16" cy="23.4" r="2.15" fill="currentColor" />
    </svg>
  );
}
