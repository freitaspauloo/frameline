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
