import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

import {
  hasFirebaseAdminEnv,
  readFirebasePrivateKey,
} from "@/lib/firebase-admin-env";

export {
  firebaseAdminEnvSnapshot,
  hasFirebaseAdminEnv,
  readFirebasePrivateKey,
} from "@/lib/firebase-admin-env";

let app: App | undefined;
let loadError: string | null = null;

/** True when Admin SDK credentials are configured. */
export function isFirebaseAdminConfigured(): boolean {
  return hasFirebaseAdminEnv();
}

export function getFirebaseAdminLoadError(): string | null {
  return loadError;
}

export function getFirebaseAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    const privateKey = readFirebasePrivateKey();

    if (projectId && clientEmail && privateKey) {
      app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        projectId,
      });
      loadError = null;
      return app;
    }

    // ADC / GOOGLE_APPLICATION_CREDENTIALS path
    app = initializeApp({ projectId: projectId || undefined });
    loadError = null;
    return app;
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Firebase Admin failed to initialize";
    return null;
  }
}

export function getFirebaseAdminAuth(): Auth | null {
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;
  return getAuth(adminApp);
}

export async function verifyFirebaseIdToken(idToken: string) {
  const auth = getFirebaseAdminAuth();
  if (!auth) {
    throw new Error(
      loadError || "Firebase Admin is not configured",
    );
  }
  return auth.verifyIdToken(idToken);
}

function isFirebaseUserNotFound(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = "code" in err ? String(err.code) : "";
  return (
    code === "auth/user-not-found" ||
    code === "auth/user-disabled" ||
    (err instanceof Error && /no user record/i.test(err.message))
  );
}

/** False when the Auth user was deleted (ID tokens can still verify until expiry). */
export async function firebaseAuthUserExists(uid: string): Promise<boolean> {
  const auth = getFirebaseAdminAuth();
  if (!auth) return false;
  try {
    await auth.getUser(uid);
    return true;
  } catch (err) {
    if (isFirebaseUserNotFound(err)) return false;
    throw err;
  }
}

/**
 * Remove the Firebase Auth user by uid or email.
 * Missing users are success — the account is already gone there.
 */
export async function deleteFirebaseAuthUser(input: {
  email: string;
  uid?: string | null;
}): Promise<{ deleted: boolean; missing: boolean }> {
  const auth = getFirebaseAdminAuth();
  if (!auth) {
    throw new Error(loadError || "Firebase Admin is not configured");
  }

  let uid = input.uid?.trim() || "";
  if (!uid) {
    try {
      uid = (await auth.getUserByEmail(input.email.trim().toLowerCase())).uid;
    } catch (err) {
      if (isFirebaseUserNotFound(err)) return { deleted: false, missing: true };
      throw err;
    }
  }

  try {
    await auth.revokeRefreshTokens(uid);
  } catch (err) {
    if (!isFirebaseUserNotFound(err)) {
      // Still try deleteUser — revocation is best-effort.
      console.warn("[firebase-admin] revokeRefreshTokens failed", err);
    }
  }

  try {
    await auth.deleteUser(uid);
    return { deleted: true, missing: false };
  } catch (err) {
    if (isFirebaseUserNotFound(err)) return { deleted: false, missing: true };
    throw err;
  }
}
