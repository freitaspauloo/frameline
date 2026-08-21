import { NextResponse } from "next/server";

import {
  anonymousIdCookieHeader,
  getOrCreateAnonymousId,
} from "@/lib/anonymous-id";
import { getDemoEmail } from "@/lib/auth";
import {
  hasUsedFreeCopyToday,
  ownsScreen,
  screenQuotaSubject,
} from "@/lib/screen-access";
import { getScreenBySlug } from "@/screens/catalog";

export async function GET(request: Request) {
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
  const anon = await getOrCreateAnonymousId();
  const owned = await ownsScreen(email, slug);
  const subject = screenQuotaSubject({ email, anonymousId: anon.id });
  const usedFree = owned
    ? false
    : await hasUsedFreeCopyToday({ subject, slug });

  const res = NextResponse.json({
    ok: true,
    slug,
    owned,
    freeRemainingToday: owned ? null : usedFree ? 0 : 1,
    message: owned
      ? null
      : usedFree
        ? "You’ve used today’s free copy. $9 unlocks unlimited prompt + code."
        : "1 free copy today. Then $9 for unlimited.",
  });
  if (anon.setCookie) {
    res.headers.append("Set-Cookie", anonymousIdCookieHeader(anon.id));
  }
  return res;
}
