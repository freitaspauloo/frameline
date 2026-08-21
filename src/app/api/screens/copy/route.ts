import { NextResponse } from "next/server";

import {
  anonymousIdCookieHeader,
  getOrCreateAnonymousId,
} from "@/lib/anonymous-id";
import { getDemoEmail } from "@/lib/auth";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import {
  hasUsedFreeCopyToday,
  ownsScreen,
  recordFreeCopyUsed,
  screenQuotaSubject,
} from "@/lib/screen-access";
import { getScreenBySlug } from "@/screens/catalog";
import {
  buildSpacemanMoonCodePayload,
  SPACEMAN_MOON_PROMPT,
} from "@/screens/spaceman-moon/copy";
import type { ScreenCopyPath } from "@/screens/types";

export async function POST(request: Request) {
  const limited = rateLimit(`screen-copy:${clientIp(request)}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (!limited.ok) return rateLimitResponse(limited);

  let body: { slug?: string; path?: string; email?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
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

  const anon = await getOrCreateAnonymousId();
  const owned = await ownsScreen(email, slug);
  const subject = screenQuotaSubject({
    email,
    anonymousId: anon.id,
  });
  const usedFree = owned ? false : await hasUsedFreeCopyToday({ subject, slug });

  if (!owned && usedFree) {
    const res = NextResponse.json({
      ok: false,
      reason: "pay" as const,
      message:
        "You’ve used today’s free copy. $9 unlocks unlimited prompt + code.",
      checkout: {
        plan: "screen",
        material: slug,
        amountCents: 900,
      },
    });
    if (anon.setCookie) {
      res.headers.append("Set-Cookie", anonymousIdCookieHeader(anon.id));
    }
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
    await recordFreeCopyUsed({ subject, slug });
  }

  const res = NextResponse.json({
    ok: true,
    path: copyPath,
    text,
    owned,
    freeRemainingToday: owned ? null : 0,
  });
  if (anon.setCookie) {
    res.headers.append("Set-Cookie", anonymousIdCookieHeader(anon.id));
  }
  return res;
}
