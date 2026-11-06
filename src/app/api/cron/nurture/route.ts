import { NextResponse } from "next/server";

import { runNurtureDue } from "@/lib/nurture";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function cronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization") ?? "";

  if (secret) {
    return auth === `Bearer ${secret}`;
  }

  // Local / preview without a secret. Production must set CRON_SECRET.
  return process.env.NODE_ENV !== "production";
}

/**
 * Daily tick. Each subscriber is due 15 days after signup (or last send).
 * Vercel Cron: GET /api/cron/nurture  (Authorization: Bearer $CRON_SECRET)
 * Dry run:     GET /api/cron/nurture?dryRun=1
 */
export async function GET(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dryRun =
    url.searchParams.get("dryRun") === "1" ||
    url.searchParams.get("dryRun") === "true";
  const limitRaw = Number(url.searchParams.get("limit") ?? "80");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 80;

  try {
    const result = await runNurtureDue({ dryRun, limit });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Nurture run failed",
      },
      { status: 500 },
    );
  }
}
