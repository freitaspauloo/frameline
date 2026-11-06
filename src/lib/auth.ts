import { cookies } from "next/headers";

import { isAdminEmail } from "@/lib/admin-emails";

export { ADMIN_EMAILS, isAdminEmail } from "@/lib/admin-emails";

export type SessionUser = {
  email: string;
  role: "buyer" | "admin";
};

/** Demo email cookie set by `/api/auth/magic-link`. */
export const DEMO_EMAIL_COOKIE = "fl_demo_email";

/** Optional client-readable session JSON cookie (`{ email, role }`). */
export const SESSION_COOKIE = "fl_session";

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
