import { cookies } from "next/headers";

import { isAdminEmail } from "@/lib/admin-emails";
import {
  DEMO_EMAIL_COOKIE,
  parseSessionCookieValue,
  SESSION_COOKIE,
  sessionUserFromFields,
  type SessionUser as CookieSessionUser,
} from "@/lib/session";

export { ADMIN_EMAILS, isAdminEmail } from "@/lib/admin-emails";
export { DEMO_EMAIL_COOKIE, SESSION_COOKIE } from "@/lib/session";

export type SessionUser = {
  email: string;
  role: "buyer" | "admin";
};

function withComputedRole(user: CookieSessionUser): SessionUser {
  return {
    email: user.email,
    role: isAdminEmail(user.email) ? "admin" : "buyer",
  };
}

/** Read the signed-in email from httpOnly or client session cookies. */
export async function getDemoEmail(): Promise<string | null> {
  const user = await resolveDemoUser();
  return user?.email ?? null;
}

/** Resolve the signed-in user from session cookies. */
export async function resolveDemoUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const demo = store.get(DEMO_EMAIL_COOKIE)?.value?.trim();
  if (demo) {
    const user = sessionUserFromFields(demo);
    return user ? withComputedRole(user) : null;
  }
  const fromSession = parseSessionCookieValue(store.get(SESSION_COOKIE)?.value);
  return fromSession ? withComputedRole(fromSession) : null;
}

export function sessionUserFromEmail(email: string): SessionUser {
  const normalized = email.trim().toLowerCase();
  return {
    email: normalized,
    role: isAdminEmail(normalized) ? "admin" : "buyer",
  };
}
