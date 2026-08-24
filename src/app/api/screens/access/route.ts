import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { attachAnonCookie, resolveAnonId } from "@/lib/anonymous-id";
import { getDemoEmail } from "@/lib/auth";
import { ownsScreen } from "@/lib/screen-access";
import {
  attachQuotaCookie,
  ensureQuotaPayload,
  freeCopiesLeftThisWeek,
  readQuotaCookie,
} from "@/lib/screen-quota-cookie";
import { getScreenBySlug } from "@/screens/catalog";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug")?.trim() ?? "";
    if (!getScreenBySlug(slug)) {
      return NextResponse.json(
        { ok: false, error: "Unknown screen" },
        { status: 404 },
      );
    }

    const emailParam = url.searchParams.get("email")?.trim().toLowerCase();
    const sessionEmail = await getDemoEmail();
    const email =
      sessionEmail ||
      (emailParam && emailParam.includes("@") ? emailParam : null);

    const { id: anonId, minted: mintAnon } = resolveAnonId(request);

    const owned = await ownsScreen(email, slug);
    let quota = ensureQuotaPayload(readQuotaCookie(request), anonId);
    if (email) quota = { ...quota, id: `email:${email}` };

    const left = owned ? null : freeCopiesLeftThisWeek(quota, slug);

    const res = NextResponse.json({
      ok: true,
      slug,
      owned,
      signedIn: Boolean(email),
      promptRequiresSignIn: !email,
      copiesLeftThisWeek: left,
      freeRemainingToday: left,
      message: owned
        ? null
        : !email
          ? "Sign in to copy the prompt. Copy code includes 1 free copy per week."
          : left === 0
            ? "You’ve used this week’s free copy. $9/mo or $49/y unlocks unlimited prompt + code."
            : "1 free copy this week. Then $9/mo or $49/y for unlimited.",
    });

    if (mintAnon) attachAnonCookie(res, anonId);
    attachQuotaCookie(res, quota);
    return res;
  } catch (err) {
    console.error("[screens/access]", err);
    return NextResponse.json(
      { ok: false, error: "Access check failed" },
      { status: 500 },
    );
  }
}
