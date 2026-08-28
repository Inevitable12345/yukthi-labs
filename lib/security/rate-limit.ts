/* ============================================================================
   RATE LIMIT  (§43)
   ----------------------------------------------------------------------------
   A fixed-window counter held in process memory. It is intentionally modest:
   enough to stop a form being hammered from one address, honest about the fact
   that a serverless deployment runs many instances. Swap `consume` for a shared
   store (Upstash, Redis) if the contact route ever needs a hard guarantee.
   ========================================================================== */

export type RateLimitVerdict = {
  ok: boolean;
  remaining: number;
  /** Seconds until the current window resets. */
  resetInSeconds: number;
};

type Window = { count: number; expiresAt: number };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

const windows = new Map<string, Window>();

export function consume(
  key: string,
  now = Date.now(),
  limit = MAX_PER_WINDOW,
  windowMs = WINDOW_MS,
): RateLimitVerdict {
  const existing = windows.get(key);

  if (!existing || existing.expiresAt <= now) {
    windows.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  existing.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((existing.expiresAt - now) / 1000));
  return {
    ok: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetInSeconds,
  };
}

/** Drops expired windows. Called opportunistically by the contact route. */
export function sweep(now = Date.now()): void {
  for (const [key, window] of windows) {
    if (window.expiresAt <= now) windows.delete(key);
  }
}

/** Test seam. */
export function reset(): void {
  windows.clear();
}

/** Best-effort client identity from proxy headers. Never trusted for auth. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "anonymous";
}
