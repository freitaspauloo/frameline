import { NextResponse } from "next/server";

import { expireSessionCookies } from "@/lib/session";

/** Clears Frameline session cookies. Client should also call Firebase signOut. */
export async function POST() {
  const response = NextResponse.json({
    ok: true,
    provider: "frameline+firebase",
  });
  expireSessionCookies((name, value, options) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
