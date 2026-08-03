import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  DEMO_EMAIL_COOKIE,
  SESSION_COOKIE,
  sessionUserFromEmail,
} from "@/lib/auth";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = rateLimit(`magic-link:${clientIp(request)}`);
  if (!limited.ok) return rateLimitResponse(limited);

  let body: { email?: string } = {};
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required" },
      { status: 400 },
    );
  }

  const user = sessionUserFromEmail(email);
  const store = await cookies();

  store.set(DEMO_EMAIL_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  // Non-httpOnly mirror for client demo session helpers
  store.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({
    ok: true,
    user,
    message: "Demo magic link accepted — real provider later (Clerk/Firebase).",
  });
}
