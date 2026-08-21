import { cookies } from "next/headers";
import { nanoid } from "nanoid";

/** Durable anonymous id for daily free-copy quota (survives refresh). */
export const ANON_ID_COOKIE = "fl_anon_id";

export async function getOrCreateAnonymousId(): Promise<{
  id: string;
  setCookie: boolean;
}> {
  const jar = await cookies();
  const existing = jar.get(ANON_ID_COOKIE)?.value?.trim();
  if (existing && existing.length >= 8) {
    return { id: existing, setCookie: false };
  }
  return { id: `anon_${nanoid(24)}`, setCookie: true };
}

export function anonymousIdCookieHeader(id: string): string {
  const maxAge = 60 * 60 * 24 * 400; // ~13 months
  return `${ANON_ID_COOKIE}=${encodeURIComponent(id)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly`;
}
