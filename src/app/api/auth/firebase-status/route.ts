import { NextResponse } from "next/server";

import { firebaseAdminEnvSnapshot } from "@/lib/firebase-admin-env";
import { FIREBASE_PUBLIC_CONFIG } from "@/lib/firebase-public-config";

/** Non-secret readiness check for Firebase wiring. */
export async function GET() {
  const envApiKey = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim());
  const envAppId = Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim());
  const adminEnv = firebaseAdminEnvSnapshot();
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    adminEnv.projectId ||
    FIREBASE_PUBLIC_CONFIG.projectId;

  // Probe Admin SDK load only when env looks ready — never throw out of this route.
  let adminSdk: {
    loaded: boolean;
    error: string | null;
  } = { loaded: false, error: null };

  if (adminEnv.configured) {
    try {
      const mod = await import("@/lib/firebase-admin");
      const app = mod.getFirebaseAdminApp();
      adminSdk = {
        loaded: Boolean(app),
        error: app ? null : mod.getFirebaseAdminLoadError(),
      };
    } catch (err) {
      adminSdk = {
        loaded: false,
        error:
          err instanceof Error
            ? err.message
            : "firebase-admin module failed to import",
      };
    }
  }

  return NextResponse.json({
    ok: true,
    projectId,
    admin: adminEnv.configured && adminSdk.loaded,
    adminEnv: {
      configured: adminEnv.configured,
      hasProjectId: adminEnv.hasProjectId,
      hasClientEmail: adminEnv.hasClientEmail,
      hasPrivateKey: adminEnv.hasPrivateKey,
      privateKeyLooksPem: adminEnv.privateKeyLooksPem,
      hasApplicationDefaultCredentials:
        adminEnv.hasApplicationDefaultCredentials,
    },
    adminSdk,
    client: {
      // Client always has committed public config fallback.
      configured: true,
      source: envApiKey && envAppId ? "env" : "public-config",
      authDomain: FIREBASE_PUBLIC_CONFIG.authDomain,
      storageBucket: FIREBASE_PUBLIC_CONFIG.storageBucket,
      hasApiKey: true,
      hasAppId: true,
      hasMeasurementId: Boolean(FIREBASE_PUBLIC_CONFIG.measurementId),
    },
    hint:
      adminEnv.configured && adminSdk.loaded
        ? null
        : !adminEnv.configured
          ? "Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY to Cursor/Vercel env secrets for session exchange"
          : `Firebase Admin env is set but SDK failed to load: ${adminSdk.error ?? "unknown error"}`,
  });
}
