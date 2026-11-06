/**
 * Shared session cookie helpers (no next/headers, no Firebase).
 * Safe to import from server routes, client components, and smoke tests.
 */

export const DEMO_EMAIL_COOKIE = "fl_demo_email";
export const SESSION_COOKIE = "fl_session";
export const LOCAL_SESSION_KEY = "fl_session_user";
/** Back-compat key written by older sign-in forms (tab-scoped). */
export const LEGACY_SESSION_STORAGE_KEY = "fl_demo_user";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionUser = {
  email: string;
  role: "buyer" | "admin";
};

export type CookieSetFn = (
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
    path?: string;
    maxAge?: number;
  },
) => void;

export function sessionCookieBaseOptions() {
  return {
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function sessionUserFromFields(
  email: string,
  role?: string | null,
): SessionUser | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return null;
  return {
    email: normalized,
    role: role === "admin" ? "admin" : "buyer",
  };
}

/**
 * Parse `fl_session` whether Next encoded it, quoted it, or stored raw JSON.
 * Also accepts a plain `email` or `email|role` value.
 */
export function parseSessionCookieValue(
  raw: string | undefined | null,
): SessionUser | null {
  if (!raw?.trim()) return null;
  let value = raw.trim();

  for (let i = 0; i < 3; i += 1) {
    if (!value.includes("%")) break;
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).replace(/\\"/g, '"');
  }

  if (value.includes("@") && !value.startsWith("{") && !value.startsWith("[")) {
    const [emailPart, rolePart] = value.split("|");
    return sessionUserFromFields(emailPart ?? "", rolePart);
  }

  try {
    const parsed = JSON.parse(value) as Partial<SessionUser> & {
      email?: unknown;
      role?: unknown;
    };
    if (typeof parsed === "string") {
      return parseSessionCookieValue(parsed);
    }
    if (!parsed || typeof parsed.email !== "string") return null;
    return sessionUserFromFields(parsed.email, parsed.role as string | undefined);
  } catch {
    return null;
  }
}

export function serializeSessionCookieValue(
  user: SessionUser,
  extra?: Record<string, string | undefined>,
): string {
  return JSON.stringify({
    email: user.email,
    role: user.role,
    ...extra,
  });
}

export function writeSessionCookies(
  setCookie: CookieSetFn,
  user: SessionUser,
  extra?: Record<string, string | undefined>,
) {
  const base = sessionCookieBaseOptions();
  setCookie(DEMO_EMAIL_COOKIE, user.email, { ...base, httpOnly: true });
  setCookie(SESSION_COOKIE, serializeSessionCookieValue(user, extra), {
    ...base,
    httpOnly: false,
  });
}

export function expireSessionCookies(setCookie: CookieSetFn) {
  const base = sessionCookieBaseOptions();
  setCookie(DEMO_EMAIL_COOKIE, "", { ...base, httpOnly: true, maxAge: 0 });
  setCookie(SESSION_COOKIE, "", { ...base, httpOnly: false, maxAge: 0 });
}
