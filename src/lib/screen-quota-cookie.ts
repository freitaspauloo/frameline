import { createHmac, timingSafeEqual } from "node:crypto";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Signed weekly free-copy ledger — works on Vercel (no disk writes). */
export const SCREEN_QUOTA_COOKIE = "fl_screen_quota";

type QuotaPayload = {
  v: 1;
  /** Stable device id */
  id: string;
  /** ISO week → slugs already free-copied that week */
  w: Record<string, string[]>;
};

function signingSecret(): string {
  return (
    process.env.SCREEN_QUOTA_SECRET?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    "frameline-dev-screen-quota"
  );
}

/** UTC ISO week key, e.g. 2026-W34 */
export function utcWeekKey(d = new Date()): string {
  const date = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  // Thursday in current week decides the year.
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function sign(body: string): string {
  return createHmac("sha256", signingSecret()).update(body).digest("base64url");
}

function encodePayload(payload: QuotaPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  return `${body}.${sign(body)}`;
}

function decodePayload(raw: string | undefined): QuotaPayload | null {
  if (!raw) return null;
  const [body, sig] = raw.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as QuotaPayload;
    if (parsed?.v !== 1 || typeof parsed.id !== "string") return null;
    if (!parsed.w || typeof parsed.w !== "object") parsed.w = {};
    return parsed;
  } catch {
    return null;
  }
}

export function readQuotaCookie(
  request: NextRequest | Request,
): QuotaPayload | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${SCREEN_QUOTA_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.slice(SCREEN_QUOTA_COOKIE.length + 1));
  return decodePayload(value);
}

export function freeCopiesLeftThisWeek(
  payload: QuotaPayload | null,
  slug: string,
): number {
  if (!payload) return 1;
  const week = utcWeekKey();
  const used = payload.w[week] ?? [];
  return used.includes(slug) ? 0 : 1;
}

export function markFreeCopyUsed(
  payload: QuotaPayload,
  slug: string,
): QuotaPayload {
  const week = utcWeekKey();
  const used = new Set(payload.w[week] ?? []);
  used.add(slug);
  // Drop older weeks to keep cookie small
  const nextW: Record<string, string[]> = { [week]: [...used] };
  for (const [k, v] of Object.entries(payload.w)) {
    if (k === week) continue;
    if (Object.keys(nextW).length >= 3) break;
    nextW[k] = v;
  }
  return { ...payload, w: nextW };
}

export function ensureQuotaPayload(
  existing: QuotaPayload | null,
  anonymousId: string,
): QuotaPayload {
  if (existing?.id) return existing;
  return { v: 1, id: anonymousId, w: {} };
}

export function attachQuotaCookie(
  res: NextResponse,
  payload: QuotaPayload,
): void {
  const maxAge = 60 * 60 * 24 * 400;
  res.cookies.set(SCREEN_QUOTA_COOKIE, encodePayload(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  });
}

/** Soft device hint — never use IP alone; fold into anon id seed only when minting. */
export function deviceSeedFromRequest(request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  const ua = request.headers.get("user-agent")?.slice(0, 120) ?? "";
  return createHmac("sha256", signingSecret())
    .update(`${ip}|${ua}`)
    .digest("hex")
    .slice(0, 16);
}
