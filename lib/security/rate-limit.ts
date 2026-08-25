/**
 * Fixed-window rate limiter, held in process memory.
 *
 * Deliberately simple, and deliberately documented as such: on a single Node
 * instance this is a real control; across several instances or a serverless fleet
 * each instance keeps its own counter, so the effective limit is the configured
 * limit multiplied by the number of live instances.
 *
 * For a contact form that is an acceptable first line — it stops naive floods
 * without adding a datastore. A deployment that needs a hard guarantee should back
 * `hit()` with Redis or the platform's own rate limiter; the call site does not
 * change.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 10_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

export function hit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    // Opportunistic sweep so an attacker cannot grow the map without bound.
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }
      if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    }
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: allowed ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Best-effort client identifier.
 *
 * Trusts `x-forwarded-for` only because this app is expected to sit behind a proxy
 * that sets it. It is used solely as a rate-limit key, is never stored, and is
 * never joined to a submission.
 */
export function clientKey(headers: Headers, scope: string): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
  return `${scope}:${ip}`;
}
