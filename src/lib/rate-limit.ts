/**
 * Simple in-memory sliding-window rate limiter.
 * Fine for demo / single-instance Next.js — not for multi-region production.
 */

type Bucket = {
  /** Timestamps (ms) of accepted requests in the window. */
  hits: number[];
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
};

export type RateLimitOptions = {
  /** Max requests in the window. Default 10. */
  limit?: number;
  /** Window length in ms. Default 60_000 (1 minute). */
  windowMs?: number;
};

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60_000;

function prune(hits: number[], now: number, windowMs: number): number[] {
  const cutoff = now - windowMs;
  return hits.filter((t) => t > cutoff);
}

/**
 * Check + record a hit for `key` (typically `route:ip`).
 * Returns whether the request is allowed.
 */
export function rateLimit(
  key: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = prune(bucket.hits, now, windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000),
    );
    buckets.set(key, bucket);
    return {
      ok: false,
      limit,
      remaining: 0,
      retryAfterSec,
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  return {
    ok: true,
    limit,
    remaining: Math.max(0, limit - bucket.hits.length),
    retryAfterSec: 0,
  };
}

/** Best-effort client IP from a Request (proxy headers, then fallback). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/** Standard 429 JSON body + Retry-After header. */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      error: "Too many requests",
      retryAfterSec: result.retryAfterSec,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfterSec),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
      },
    },
  );
}
