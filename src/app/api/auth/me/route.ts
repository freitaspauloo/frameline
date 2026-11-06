import { NextResponse } from "next/server";

import { resolveDemoUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Current Frameline session from cookies. Used to hydrate the client chrome. */
export async function GET() {
  const user = await resolveDemoUser();
  return NextResponse.json({
    ok: true,
    user,
  });
}
