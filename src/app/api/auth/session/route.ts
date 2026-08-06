import { NextResponse } from "next/server";

import {
  DEMO_EMAIL_COOKIE,
  SESSION_COOKIE,
  sessionUserFromEmail,
} from "@/lib/auth";
import { firebaseAdminEnvSnapshot } from "@/lib/firebase-admin-env";
import { captureException } from "@/lib/monitoring";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

const WEEK = 60 * 60 * 24 * 7;

/**
 * Exchange a Firebase ID token for Frameline session cookies.
 * Falls back to 503 when Admin SDK credentials are missing.
 */
export async function POST(request: Request) {
  const limited = rateLimit(`auth-session:${clientIp(request)}`);
  if (!limited.ok) return rateLimitResponse(limited);

  const adminEnv = firebaseAdminEnvSnapshot();
  if (!adminEnv.configured) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY (or GOOGLE_APPLICATION_CREDENTIALS).",
      },
      { status: 503 },
    );
  }

  let verifyFirebaseIdToken: (idToken: string) => Promise<{
    email?: string;
    uid: string;
  }>;
  try {
    const mod = await import("@/lib/firebase-admin");
    if (!mod.getFirebaseAdminApp()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            mod.getFirebaseAdminLoadError() ||
            "Firebase Admin failed to initialize",
        },
        { status: 503 },
      );
    }
    verifyFirebaseIdToken = mod.verifyFirebaseIdToken;
  } catch (err) {
    captureException(err, { route: "auth/session", phase: "import" });
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? `Firebase Admin unavailable: ${err.message}`
            : "Firebase Admin unavailable",
      },
      { status: 503 },
    );
  }

  let body: { idToken?: string } = {};
  try {
    body = (await request.json()) as { idToken?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const idToken = body.idToken?.trim();
  if (!idToken) {
    return NextResponse.json(
      { ok: false, error: "idToken is required" },
      { status: 400 },
    );
  }

  try {
    const decoded = await verifyFirebaseIdToken(idToken);
    const email = decoded.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Token has no email claim" },
        { status: 400 },
      );
    }

    const user = sessionUserFromEmail(email);
    const response = NextResponse.json({
      ok: true,
      user,
      uid: decoded.uid,
      provider: "firebase",
    });

    response.cookies.set(DEMO_EMAIL_COOKIE, email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: WEEK,
    });
    response.cookies.set(
      SESSION_COOKIE,
      JSON.stringify({
        email: user.email,
        role: user.role,
        uid: decoded.uid,
      }),
      {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: WEEK,
      },
    );

    return response;
  } catch (error) {
    captureException(error);
    return NextResponse.json(
      { ok: false, error: "Invalid or expired Firebase ID token" },
      { status: 401 },
    );
  }
}

export async function GET() {
  const adminEnv = firebaseAdminEnvSnapshot();
  let adminSdkLoaded = false;
  let adminSdkError: string | null = null;

  if (adminEnv.configured) {
    try {
      const mod = await import("@/lib/firebase-admin");
      adminSdkLoaded = Boolean(mod.getFirebaseAdminApp());
      adminSdkError = adminSdkLoaded
        ? null
        : mod.getFirebaseAdminLoadError();
    } catch (err) {
      adminSdkError =
        err instanceof Error ? err.message : "firebase-admin import failed";
    }
  }

  return NextResponse.json({
    ok: true,
    firebaseAdmin: adminEnv.configured && adminSdkLoaded,
    projectId: adminEnv.projectId,
    adminEmailsConfigured: Boolean(process.env.FRAMELINE_ADMIN_EMAILS),
    adminEnv: {
      configured: adminEnv.configured,
      hasProjectId: adminEnv.hasProjectId,
      hasClientEmail: adminEnv.hasClientEmail,
      hasPrivateKey: adminEnv.hasPrivateKey,
      privateKeyLooksPem: adminEnv.privateKeyLooksPem,
    },
    adminSdkError,
  });
}
