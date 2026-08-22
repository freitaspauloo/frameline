import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getDemoEmail } from "@/lib/auth";
import { ownsScreen } from "@/lib/screen-access";
import {
  attachQuotaCookie,
  deviceSeedFromRequest,
  ensureQuotaPayload,
  freeCopiesLeftThisWeek,
  readQuotaCookie,
} from "@/lib/screen-quota-cookie";
import { getScreenBySlug } from "@/screens/catalog";

const ANON_COOKIE = "fl_anon_id";

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

    let anonId = request.cookies.get(ANON_COOKIE)?.value?.trim() || null;
    let mintAnon = false;
    if (!anonId) {
      anonId = `anon_${deviceSeedFromRequest(request)}_${nanoid(12)}`;
      mintAnon = true;
    }

    const owned = await ownsScreen(email, slug);
    let quota = ensureQuotaPayload(readQuotaCookie(request), anonId);
    if (email) quota = { ...quota, id: `email:${email}` };

    const left = owned ? null : freeCopiesLeftThisWeek(quota, slug);

    const res = NextResponse.json({
      ok: true,
      slug,
      owned,
      copiesLeftThisWeek: left,
      freeRemainingToday: left,
      message: owned
        ? null
        : left === 0
          ? "You’ve used this week’s free copy. $9/mo or $49/y unlocks unlimited prompt + code."
          : "1 free copy this week. Then $9/mo or $49/y for unlimited.",
    });

    if (mintAnon) {
      res.cookies.set(ANON_COOKIE, anonId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 400,
        secure: process.env.NODE_ENV === "production",
      });
    }
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
