import { NextResponse } from "next/server";

import { sessionUserFromEmail } from "@/lib/auth";
import { writeSessionCookies } from "@/lib/session";
import { recordEvent } from "@/lib/events";
import { firebaseAdminEnvSnapshot } from "@/lib/firebase-admin-env";
import { captureException } from "@/lib/monitoring";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { ensureUser, shouldDeliverSignupWelcome } from "@/lib/users";
import { notifyAccountSignup } from "@/lib/email";
import { enrollNurture } from "@/lib/nurture";

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

  let firebaseAdmin: typeof import("@/lib/firebase-admin");
  let verifyFirebaseIdToken: (idToken: string) => Promise<{
    email?: string;
    uid: string;
    name?: string;
  }>;
  try {
    firebaseAdmin = await import("@/lib/firebase-admin");
    if (!firebaseAdmin.getFirebaseAdminApp()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            firebaseAdmin.getFirebaseAdminLoadError() ||
            "Firebase Admin failed to initialize",
        },
        { status: 503 },
      );
    }
    verifyFirebaseIdToken = firebaseAdmin.verifyFirebaseIdToken;
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

  let body: { idToken?: string; authMethod?: string } = {};
  try {
    body = (await request.json()) as { idToken?: string; authMethod?: string };
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

    const stillExists = await firebaseAdmin.firebaseAuthUserExists(decoded.uid);
    if (!stillExists) {
      return NextResponse.json(
        { ok: false, error: "This account no longer exists" },
        { status: 401 },
      );
    }

    const user = sessionUserFromEmail(email);

    const authMethod =
      body.authMethod === "google"
        ? "google"
        : body.authMethod === "email"
          ? "email"
          : "unknown";

    const record = await ensureUser({
      email,
      firebaseUid: decoded.uid,
      displayName: decoded.name ?? null,
    });
    await recordEvent({
      // A user row that did not exist a moment ago is a signup.
      name: record?.created ? "signup" : "signin",
      email,
      request,
      source: "firebase",
      props: { uid: decoded.uid, authMethod },
    });
    if (
      record &&
      shouldDeliverSignupWelcome(record.user, record.created, authMethod)
    ) {
      await enrollNurture(email, "account");
      await notifyAccountSignup(email);
    }

    const response = NextResponse.json({
      ok: true,
      user,
      uid: decoded.uid,
      provider: "firebase",
    });

    writeSessionCookies(
      (name, value, options) => {
        response.cookies.set(name, value, options);
      },
      user,
      { uid: decoded.uid },
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
