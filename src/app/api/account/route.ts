import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  DEMO_EMAIL_COOKIE,
  SESSION_COOKIE,
  getDemoEmail,
  isAdminEmail,
} from "@/lib/auth";
import { purgeFramelineAccountData } from "@/lib/account-deletion";
import { recordEvent } from "@/lib/events";
import { firebaseAdminEnvSnapshot } from "@/lib/firebase-admin-env";
import { captureException } from "@/lib/monitoring";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const e = value.trim().toLowerCase();
  if (!e || !e.includes("@")) return null;
  return e;
}

/**
 * DELETE /api/account — remove Frameline-side account data and sign out.
 * Body: { confirmEmail: string, idToken?: string } — must match the signed-in identity.
 */
export async function DELETE(request: Request) {
  const limited = rateLimit(`account-delete:${clientIp(request)}`);
  if (!limited.ok) return rateLimitResponse(limited);

  let body: { confirmEmail?: string; idToken?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const confirmEmail = normalizeEmail(body.confirmEmail);
  if (!confirmEmail) {
    return NextResponse.json(
      {
        ok: false,
        error: "confirmEmail is required and must match your account address",
      },
      { status: 400 },
    );
  }

  const idToken = body.idToken?.trim();
  const adminSnapshot = firebaseAdminEnvSnapshot();
  let targetEmail: string | null = null;
  let firebaseUid: string | null = null;

  if (idToken && adminSnapshot.configured) {
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
      const decoded = await mod.verifyFirebaseIdToken(idToken);
      const tokenEmail = decoded.email?.trim().toLowerCase();
      if (!tokenEmail) {
        return NextResponse.json(
          { ok: false, error: "Token has no email claim" },
          { status: 400 },
        );
      }
      if (tokenEmail !== confirmEmail) {
        return NextResponse.json(
          {
            ok: false,
            error: "Email confirmation does not match the signed-in account",
          },
          { status: 400 },
        );
      }
      targetEmail = tokenEmail;
      firebaseUid = decoded.uid;
    } catch (err) {
      captureException(err, { route: "account/delete", phase: "verify" });
      return NextResponse.json(
        { ok: false, error: "Invalid or expired Firebase ID token" },
        { status: 401 },
      );
    }
  } else {
    const demo = (await getDemoEmail())?.trim().toLowerCase() ?? null;
    if (!demo || demo !== confirmEmail) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Sign in first, or pass a valid idToken. Email must match your session.",
        },
        { status: 401 },
      );
    }
    targetEmail = demo;
  }

  if (isAdminEmail(targetEmail)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "This account cannot be deleted automatically. Contact support to remove admin access.",
      },
      { status: 403 },
    );
  }

  try {
    await purgeFramelineAccountData(targetEmail);
  } catch (err) {
    captureException(err, { route: "account/delete", email: targetEmail });
    return NextResponse.json(
      { ok: false, error: "Could not complete account deletion" },
      { status: 500 },
    );
  }

  if (firebaseUid && adminSnapshot.configured) {
    try {
      const { getFirebaseAdminAuth } = await import("@/lib/firebase-admin");
      const auth = getFirebaseAdminAuth();
      if (auth) await auth.deleteUser(firebaseUid);
    } catch (err) {
      captureException(err, {
        route: "account/delete",
        phase: "firebase-delete",
        uid: firebaseUid,
      });
    }
  }

  await recordEvent({
    name: "account_deleted",
    email: targetEmail,
    request,
    source: firebaseUid ? "firebase" : "magic-link",
  });

  const store = await cookies();
  store.delete(DEMO_EMAIL_COOKIE);
  store.delete(SESSION_COOKIE);

  return NextResponse.json({
    ok: true,
    message:
      "Your Frameline account data was removed. Order history may be retained for legal and tax records; registry access for your purchases was revoked.",
  });
}
