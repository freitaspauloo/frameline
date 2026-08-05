import { cookies } from "next/headers";

export type SessionUser = {
  email: string;
  role: "buyer" | "admin";
};

/** Demo email cookie set by `/api/auth/magic-link`. */
export const DEMO_EMAIL_COOKIE = "fl_demo_email";

/** Optional client-readable session JSON cookie (`{ email, role }`). */
export const SESSION_COOKIE = "fl_session";

const DEMO_ADMIN_FALLBACK = "admin@frameline.ai";

export const ADMIN_EMAILS: string[] = (() => {
  const raw = process.env.FRAMELINE_ADMIN_EMAILS;
  if (!raw?.trim()) return [DEMO_ADMIN_FALLBACK];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
})();

export function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (ADMIN_EMAILS.includes(normalized)) return true;
  // Demo: any signed-in address containing "admin"
  if (normalized.includes("admin")) return true;
  return false;
}

/**
 * Provider-agnostic session helper (client).
 * Reads `fl_session` cookie set by demo magic-link or Firebase `/api/auth/session`.
 */
export function getDemoSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE}=`));
    if (!match) return null;
    const raw = decodeURIComponent(match.slice(SESSION_COOKIE.length + 1));
    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (!parsed.email || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      role: parsed.role === "admin" ? "admin" : "buyer",
    };
  } catch {
    return null;
  }
}

/** Read the httpOnly demo email cookie (server / route handlers). */
export async function getDemoEmail(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(DEMO_EMAIL_COOKIE)?.value;
  if (!value?.trim()) return null;
  return value.trim().toLowerCase();
}

/** Resolve a demo user from the magic-link cookie. */
export async function resolveDemoUser(): Promise<SessionUser | null> {
  const email = await getDemoEmail();
  if (!email) return null;
  return {
    email,
    role: isAdminEmail(email) ? "admin" : "buyer",
  };
}

export function sessionUserFromEmail(email: string): SessionUser {
  const normalized = email.trim().toLowerCase();
  return {
    email: normalized,
    role: isAdminEmail(normalized) ? "admin" : "buyer",
  };
}
