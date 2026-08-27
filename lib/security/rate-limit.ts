/* ============================================================================
   RATE LIMITING (§34)
   ----------------------------------------------------------------------------
   A fixed-window limiter held in process memory.

   This is honest about what it is: adequate for a single instance, and *not* a
   distributed limiter. On multi-instance hosting it becomes per-instance, which
   is stated in the deployment guide rather than papered over. The interface is
   deliberately the shape a Redis-backed implementation would have, so swapping
   it does not touch the route.
   ========================================================================== */

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Bounded so a flood of unique keys cannot grow the map without limit. */
const MAX_TRACKED_KEYS = 10_000;

export function rateLimit(
  key: string,
  {
    limit = 5,
    windowMs = 60_000,
    now = Date.now(),
  }: { limit?: number; windowMs?: number; now?: number } = {},
): RateLimitResult {
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      for (const [candidate, window] of windows) {
        if (window.resetAt <= now) windows.delete(candidate);
      }
      // Still full of live windows: refuse rather than grow unbounded.
      if (windows.size >= MAX_TRACKED_KEYS) {
        return { ok: false, remaining: 0, retryAfter: Math.ceil(windowMs / 1000) };
      }
    }

    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfter };
  }

  return { ok: true, remaining: limit - existing.count, retryAfter: 0 };
}

/** Test hygiene. */
export function resetRateLimits(): void {
  windows.clear();
}
