import { NextResponse } from "next/server";

import { purgeFramelineAccountData } from "@/lib/account-deletion";
import { isListedAdminEmail } from "@/lib/admin-emails";
import { getDemoEmail } from "@/lib/auth";
import { sendAccountDeletedEmail } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { firebaseAdminEnvSnapshot } from "@/lib/firebase-admin-env";
import { captureException } from "@/lib/monitoring";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { expireSessionCookies } from "@/lib/session";
import { findUserByEmail } from "@/lib/users";

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

  if (isListedAdminEmail(targetEmail)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "This account cannot be deleted automatically. Contact support to remove admin access.",
      },
      { status: 403 },
    );
  }

  const stored = await findUserByEmail(targetEmail);
  const uid = firebaseUid || stored?.firebaseUid || null;

  if (adminSnapshot.configured) {
    try {
      const { deleteFirebaseAuthUser, getFirebaseAdminApp } = await import(
        "@/lib/firebase-admin"
      );
      if (getFirebaseAdminApp()) {
        await deleteFirebaseAuthUser({ email: targetEmail, uid });
      }
    } catch (err) {
      captureException(err, {
        route: "account/delete",
        phase: "firebase-delete",
        email: targetEmail,
      });
      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not remove the login for this account. Try again or contact support.",
        },
        { status: 500 },
      );
    }
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

  await recordEvent({
    name: "account_deleted",
    email: targetEmail,
    request,
    source: uid ? "firebase" : "magic-link",
  });

  await sendAccountDeletedEmail(targetEmail);

  const response = NextResponse.json({
    ok: true,
    message:
      "Your Frameline account was deleted. A confirmation email is on the way. Order history may be retained for legal and tax records; registry access for your purchases was revoked.",
  });
  expireSessionCookies((name, value, options) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
