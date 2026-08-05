import { NextResponse } from "next/server";

import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { FIREBASE_PUBLIC_CONFIG } from "@/lib/firebase-public-config";

/** Non-secret readiness check for Firebase wiring. */
export async function GET() {
  const envApiKey = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim());
  const envAppId = Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim());
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    FIREBASE_PUBLIC_CONFIG.projectId;

  return NextResponse.json({
    ok: true,
    projectId,
    admin: isFirebaseAdminConfigured(),
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
    hint: isFirebaseAdminConfigured()
      ? null
      : "Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY to Cursor/Vercel env secrets for session exchange",
  });
}
