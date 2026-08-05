import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let app: App | undefined;

function readPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return undefined;
  // .env.local stores newlines as `\n`
  return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
}

/** True when Admin SDK credentials are configured. */
export function isFirebaseAdminConfigured(): boolean {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return true;
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getFirebaseAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = readPrivateKey();

  if (projectId && clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
    return app;
  }

  // ADC / GOOGLE_APPLICATION_CREDENTIALS path
  app = initializeApp({ projectId: projectId || undefined });
  return app;
}

export function getFirebaseAdminAuth(): Auth | null {
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;
  return getAuth(adminApp);
}

export async function verifyFirebaseIdToken(idToken: string) {
  const auth = getFirebaseAdminAuth();
  if (!auth) {
    throw new Error("Firebase Admin is not configured");
  }
  return auth.verifyIdToken(idToken);
}
