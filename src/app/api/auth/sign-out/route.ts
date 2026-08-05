import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DEMO_EMAIL_COOKIE, SESSION_COOKIE } from "@/lib/auth";

/** Clears Frameline session cookies. Client should also call Firebase signOut. */
export async function POST() {
  const store = await cookies();
  store.delete(DEMO_EMAIL_COOKIE);
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true, provider: "frameline+firebase" });
}
