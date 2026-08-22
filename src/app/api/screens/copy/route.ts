import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getDemoEmail } from "@/lib/auth";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { ownsScreen } from "@/lib/screen-access";
import {
  attachQuotaCookie,
  deviceSeedFromRequest,
  ensureQuotaPayload,
  freeCopiesLeftThisWeek,
  markFreeCopyUsed,
  readQuotaCookie,
  SCREEN_QUOTA_COOKIE,
} from "@/lib/screen-quota-cookie";
import { getScreenBySlug } from "@/screens/catalog";
import {
  buildSpacemanMoonCodePayload,
  SPACEMAN_MOON_PROMPT,
} from "@/screens/spaceman-moon/copy";
import type { ScreenCopyPath } from "@/screens/types";

const ANON_COOKIE = "fl_anon_id";

function readAnonId(request: NextRequest): string | null {
  return request.cookies.get(ANON_COOKIE)?.value?.trim() || null;
}

function mintAnonId(request: Request): string {
  const seed = deviceSeedFromRequest(request);
  return `anon_${seed}_${nanoid(12)}`;
}

function attachAnonCookie(res: NextResponse, id: string) {
  res.cookies.set(ANON_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(`screen-copy:${clientIp(request)}`, {
      limit: 30,
      windowMs: 60_000,
    });
    if (!limited.ok) return rateLimitResponse(limited);

    let body: { slug?: string; path?: string; email?: string } = {};
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON" },
        { status: 400 },
      );
    }

    const slug = body.slug?.trim() ?? "";
    const copyPath = (body.path?.trim().toLowerCase() ?? "") as ScreenCopyPath;
    if (!getScreenBySlug(slug)) {
      return NextResponse.json(
        { ok: false, error: "Unknown screen" },
        { status: 404 },
      );
    }
    if (copyPath !== "prompt" && copyPath !== "code") {
      return NextResponse.json(
        { ok: false, error: "path must be prompt or code" },
        { status: 400 },
      );
    }

    const sessionEmail = await getDemoEmail();
    const bodyEmail = body.email?.trim().toLowerCase();
    const email =
      sessionEmail ||
      (bodyEmail && bodyEmail.includes("@") ? bodyEmail : null);

    let anonId = readAnonId(request);
    let mintAnon = false;
    if (!anonId) {
      anonId = mintAnonId(request);
      mintAnon = true;
    }

    const owned = await ownsScreen(email, slug);
    let quota = ensureQuotaPayload(readQuotaCookie(request), anonId);
    // Prefer email-bound subject id when signed in so refresh can't reset week
    if (email) {
      quota = { ...quota, id: `email:${email}` };
    }

    const left = owned ? null : freeCopiesLeftThisWeek(quota, slug);

    if (!owned && left === 0) {
      const res = NextResponse.json({
        ok: false,
        reason: "pay" as const,
        message:
          "You’ve used this week’s free copy. $9/mo or $49/y unlocks unlimited prompt + code.",
        copiesLeftThisWeek: 0,
        checkout: {
          plan: "screen",
          material: slug,
          amountCents: 900,
        },
      });
      if (mintAnon) attachAnonCookie(res, anonId);
      attachQuotaCookie(res, quota);
      return res;
    }

    let text: string;
    if (copyPath === "prompt") {
      text = SPACEMAN_MOON_PROMPT;
    } else if (slug === "spaceman-moon") {
      text = await buildSpacemanMoonCodePayload();
    } else {
      return NextResponse.json(
        { ok: false, error: "No code payload for this screen" },
        { status: 404 },
      );
    }

    if (!owned) {
      quota = markFreeCopyUsed(quota, slug);
    }

    const res = NextResponse.json({
      ok: true,
      path: copyPath,
      text,
      owned,
      copiesLeftThisWeek: owned ? null : 0,
    });
    if (mintAnon) attachAnonCookie(res, anonId);
    attachQuotaCookie(res, quota);
    // Drop legacy unsigned cookie name if we still set it elsewhere
    void SCREEN_QUOTA_COOKIE;
    return res;
  } catch (err) {
    console.error("[screens/copy]", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Copy failed",
      },
      { status: 500 },
    );
  }
}
