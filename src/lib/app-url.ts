/**
 * Canonical public origin, used for URLs that end up inside copied code.
 * Never falls back to a *.vercel.app host: that subdomain is not ours.
 */
export function appBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return `http://localhost:${process.env.PORT?.trim() || "3000"}`;
}
