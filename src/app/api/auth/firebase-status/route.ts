import { NextResponse } from "next/server";

import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";

/** Non-secret readiness check for Firebase wiring. */
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? "";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? "";
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    null;

  return NextResponse.json({
    ok: true,
    projectId,
    admin: isFirebaseAdminConfigured(),
    client: {
      configured: Boolean(apiKey && appId && projectId),
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? null,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? null,
      hasApiKey: Boolean(apiKey),
      hasAppId: Boolean(appId),
      hasMeasurementId: Boolean(
        process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim(),
      ),
    },
  });
}
