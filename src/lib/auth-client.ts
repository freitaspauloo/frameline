/**
 * Client-safe session helpers (no next/headers).
 * Server routes should use `@/lib/auth` instead.
 */

export const SESSION_COOKIE = "fl_session";

export type ClientSessionUser = {
  email: string;
  role: "buyer" | "admin";
};

/**
 * Provider-agnostic session helper (client).
 * Reads `fl_session` cookie set by demo magic-link or Firebase `/api/auth/session`.
 */
export function getDemoSession(): ClientSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    if (!match) return null;
    const raw = decodeURIComponent(match.slice(SESSION_COOKIE.length + 1));
    const parsed = JSON.parse(raw) as Partial<ClientSessionUser>;
    if (!parsed.email || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      role: parsed.role === "admin" ? "admin" : "buyer",
    };
  } catch {
    return null;
  }
}
