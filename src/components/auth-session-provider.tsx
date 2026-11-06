"use client";

import * as React from "react";

import {
  clearClientSession,
  exchangeFirebaseSession,
  fetchServerSession,
  getDemoSession,
  readLocalSession,
  rememberClientSession,
  subscribeAuthSession,
  type ClientSessionUser,
} from "@/lib/auth-client";

type AuthSessionContextValue = {
  user: ClientSessionUser | null;
  ready: boolean;
  signOut: () => Promise<void>;
};

const AuthSessionContext = React.createContext<AuthSessionContextValue | null>(
  null,
);

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<ClientSessionUser | null>(null);
  const [ready, setReady] = React.useState(false);
  const restoring = React.useRef(false);

  React.useEffect(() => {
    let cancelled = false;
    let unsubFirebase: (() => void) | undefined;

    const unsub = subscribeAuthSession((next) => {
      if (!cancelled) setUser(next);
    });

    async function hydrate() {
      let serverUser: ClientSessionUser | null = null;
      try {
        serverUser = await fetchServerSession();
      } catch {
        serverUser = null;
      }
      if (cancelled) return;

      const cookieUser = getDemoSession();
      const next = serverUser ?? cookieUser;
      if (next) {
        rememberClientSession(next);
        setUser(next);
      }

      try {
        const [{ getFirebaseClientAuth }, { onAuthStateChanged }] =
          await Promise.all([
            import("@/lib/firebase-client"),
            import("firebase/auth"),
          ]);
        const auth = getFirebaseClientAuth();
        if (!auth) {
          if (!next) {
            clearClientSession();
            setUser(null);
          }
          if (!cancelled) setReady(true);
          return;
        }

        unsubFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
          if (cancelled) return;
          const cookie = getDemoSession();
          if (firebaseUser?.email && !cookie && !restoring.current) {
            restoring.current = true;
            try {
              await exchangeFirebaseSession(
                await firebaseUser.getIdToken(),
                "unknown",
              );
            } catch {
              const fallback = readLocalSession() ?? next;
              if (fallback) setUser(fallback);
            } finally {
              restoring.current = false;
            }
          } else if (cookie) {
            rememberClientSession(cookie);
          } else if (!firebaseUser && !cookie) {
            const server =
              next ?? (await fetchServerSession().catch(() => null));
            if (!server) {
              clearClientSession();
              setUser(null);
            }
          }
          if (!cancelled) setReady(true);
        });
      } catch {
        if (!cancelled) setReady(true);
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
      unsub();
      unsubFirebase?.();
    };
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      const { clientSignOut } = await import("@/lib/firebase-client");
      await clientSignOut();
    } catch {
      // still clear Frameline cookies
    }
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      // local clear still applies
    }
    clearClientSession();
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, ready, signOut }),
    [user, ready, signOut],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const ctx = React.useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return ctx;
}

export function useOptionalAuthSession(): AuthSessionContextValue | null {
  return React.useContext(AuthSessionContext);
}
