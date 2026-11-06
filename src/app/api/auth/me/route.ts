import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DEMO_EMAIL_COOKIE, resolveDemoUser, SESSION_COOKIE } from "@/lib/auth";
import { expireSessionCookies } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Current Frameline session from cookies. Used to hydrate the client chrome. */
export async function GET() {
  const store = await cookies();
  const hadCookie = Boolean(
    store.get(DEMO_EMAIL_COOKIE)?.value || store.get(SESSION_COOKIE)?.value,
  );
  const user = await resolveDemoUser();
  const response = NextResponse.json({
    ok: true,
    user,
  });
  if (!user && hadCookie) {
    expireSessionCookies((name, value, options) => {
      response.cookies.set(name, value, options);
    });
  }
  return response;
}
