/**
 * Client-safe session helpers (no next/headers).
 * Server routes should use `@/lib/auth` instead.
 */

import {
  LEGACY_SESSION_STORAGE_KEY,
  LOCAL_SESSION_KEY,
  parseSessionCookieValue,
  SESSION_COOKIE,
  type SessionUser,
} from "@/lib/session";

export { SESSION_COOKIE } from "@/lib/session";

export type ClientSessionUser = SessionUser;

export const AUTH_SESSION_EVENT = "fl-auth-session";

type AuthListener = (user: ClientSessionUser | null) => void;

const listeners = new Set<AuthListener>();

function emitAuthSession(user: ClientSessionUser | null) {
  for (const listener of listeners) listener(user);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_SESSION_EVENT, { detail: user }),
    );
  }
}

export function subscribeAuthSession(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readCookieRaw(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((row) => row.startsWith(prefix));
  if (!match) return null;
  return match.slice(prefix.length);
}

/** Cookie-only session. Checkout and pay walls should use this, not localStorage. */
export function getDemoSession(): ClientSessionUser | null {
  if (typeof window === "undefined") return null;
  return parseSessionCookieValue(readCookieRaw(SESSION_COOKIE));
}

export function readLocalSession(): ClientSessionUser | null {
  if (typeof window === "undefined") return null;
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      const key =
        storage === window.localStorage
          ? LOCAL_SESSION_KEY
          : LEGACY_SESSION_STORAGE_KEY;
      const raw = storage.getItem(key);
      const parsed = parseSessionCookieValue(raw ?? undefined);
      if (parsed) return parsed;
    } catch {
      // quota / private mode
    }
  }
  return null;
}

export function rememberClientSession(user: ClientSessionUser) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify(user);
    window.localStorage.setItem(LOCAL_SESSION_KEY, payload);
    window.sessionStorage.setItem(LEGACY_SESSION_STORAGE_KEY, payload);
  } catch {
    // ignore storage failures
  }
  emitAuthSession(user);
}

export function clearClientSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
    window.sessionStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
  emitAuthSession(null);
}

export async function exchangeFirebaseSession(
  idToken: string,
  authMethod: "google" | "email" | "unknown" = "unknown",
): Promise<{ user: ClientSessionUser }> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, authMethod }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    error?: string;
    user?: Partial<ClientSessionUser>;
  };
  if (!res.ok || !data.ok || !data.user?.email) {
    throw new Error(data.error ?? "Could not create session");
  }
  const user: ClientSessionUser = {
    email: data.user.email.trim().toLowerCase(),
    role: data.user.role === "admin" ? "admin" : "buyer",
  };
  rememberClientSession(user);
  return { user };
}

export async function fetchServerSession(): Promise<ClientSessionUser | null> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    user?: Partial<ClientSessionUser> | null;
  };
  if (!data.user?.email) return null;
  return {
    email: data.user.email.trim().toLowerCase(),
    role: data.user.role === "admin" ? "admin" : "buyer",
  };
}
