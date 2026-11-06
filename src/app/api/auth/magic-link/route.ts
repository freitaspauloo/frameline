import { NextResponse } from "next/server";

import { sessionUserFromEmail } from "@/lib/auth";
import { writeSessionCookies } from "@/lib/session";
import { notifyAccountSignup } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { enrollNurture } from "@/lib/nurture";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { ensureUser } from "@/lib/users";

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

  const record = await ensureUser({ email });
  await recordEvent({
    name: record?.created ? "signup" : "signin",
    email,
    request,
    source: "magic-link",
    props: { authMethod: "email" },
  });
  if (record?.created) {
    await notifyAccountSignup(email);
    await enrollNurture(email, "account");
  }

  const response = NextResponse.json({
    ok: true,
    user,
    message: "Demo magic link accepted — real provider later (Clerk/Firebase).",
  });
  writeSessionCookies(
    (name, value, options) => {
      response.cookies.set(name, value, options);
    },
    user,
  );
  return response;
}
