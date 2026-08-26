import { NextResponse } from "next/server";

import { isAdminEmail, resolveDemoUser } from "@/lib/auth";
import { writeCatalogOrder } from "@/lib/demo-catalog";
import { V1_LAUNCH_MATERIAL_SLUGS } from "@/materials";

async function requireAdmin() {
  const user = await resolveDemoUser();
  if (!user || user.role !== "admin" || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("slugs" in body)) {
    return NextResponse.json({ ok: false, error: "slugs required" }, { status: 400 });
  }

  const slugsRaw = body.slugs;
  if (!Array.isArray(slugsRaw) || slugsRaw.some((slug) => typeof slug !== "string")) {
    return NextResponse.json({ ok: false, error: "Invalid slugs" }, { status: 400 });
  }

  const slugs = slugsRaw.map((slug) => slug.trim()).filter(Boolean);
  const allowed = new Set<string>(V1_LAUNCH_MATERIAL_SLUGS);
  if (!slugs.every((slug) => allowed.has(slug))) {
    return NextResponse.json(
      { ok: false, error: "Unknown or invalid storefront slug" },
      { status: 400 },
    );
  }

  try {
    const order = await writeCatalogOrder(slugs);
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
