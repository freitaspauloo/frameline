import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import { deviceSeedFromRequest } from "@/lib/screen-quota-cookie";

/**
 * Durable anonymous id, shared by the free-copy quota and the analytics stream.
 *
 * Single source of truth: the screens access and copy routes previously minted
 * this cookie inline with slightly different logic, which meant the same device
 * could end up with two identities depending on which route it hit first.
 */
export const ANON_ID_COOKIE = "fl_anon_id";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 400; // ~13 months

export function readAnonId(request: NextRequest | Request): string | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ANON_ID_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.slice(ANON_ID_COOKIE.length + 1)).trim();
  return value.length >= 8 ? value : null;
}

export function mintAnonId(request: Request): string {
  return `anon_${deviceSeedFromRequest(request)}_${nanoid(12)}`;
}

/** Existing id when present, otherwise a fresh one flagged for a Set-Cookie. */
export function resolveAnonId(request: NextRequest | Request): {
  id: string;
  minted: boolean;
} {
  const existing = readAnonId(request);
  if (existing) return { id: existing, minted: false };
  return { id: mintAnonId(request), minted: true };
}

export function attachAnonCookie(res: NextResponse, id: string): void {
  res.cookies.set(ANON_ID_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

/** For plain Response objects that build headers by hand. */
export function anonymousIdCookieHeader(id: string): string {
  return `${ANON_ID_COOKIE}=${encodeURIComponent(id)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax; HttpOnly`;
}
