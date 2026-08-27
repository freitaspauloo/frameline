import { NextResponse } from "next/server";

import { isAdminEmail, resolveDemoUser } from "@/lib/auth";
import {
  getResolvedMaterial,
  getResolvedScreen,
  writeCatalogOverride,
} from "@/lib/demo-catalog";
import { MATERIALS_CATALOG, type MaterialTier } from "@/materials";
import { listAllScreenEntries } from "@/screens/catalog";

const TIERS: MaterialTier[] = ["free", "personal", "team"];
const STATUSES = ["draft", "published"] as const;

function isTier(value: unknown): value is MaterialTier {
  return typeof value === "string" && TIERS.includes(value as MaterialTier);
}

function isStatus(value: unknown): value is (typeof STATUSES)[number] {
  return typeof value === "string" && STATUSES.includes(value as (typeof STATUSES)[number]);
}

async function requireAdmin() {
  const user = await resolveDemoUser();
  if (!user || user.role !== "admin" || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}

export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  }

  const material = await getResolvedMaterial(slug);
  if (!material) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, material });
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

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const slugRaw = "slug" in body ? body.slug : undefined;
  if (typeof slugRaw !== "string" || !slugRaw.trim()) {
    return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  }
  const slug = slugRaw.trim();

  if (
    !MATERIALS_CATALOG.some((m) => m.slug === slug) &&
    !listAllScreenEntries().some((s) => s.slug === slug)
  ) {
    return NextResponse.json({ ok: false, error: "Unknown slug" }, { status: 404 });
  }

  const patch: {
    title?: string;
    description?: string;
    tier?: MaterialTier;
    status?: "draft" | "published";
  } = {};

  if ("title" in body && typeof body.title === "string") {
    patch.title = body.title.trim();
  }
  if ("description" in body && typeof body.description === "string") {
    patch.description = body.description.trim();
  }
  if ("tier" in body) {
    if (!isTier(body.tier)) {
      return NextResponse.json({ ok: false, error: "Invalid tier" }, { status: 400 });
    }
    patch.tier = body.tier;
  }
  if ("status" in body) {
    if (!isStatus(body.status)) {
      return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    }
    patch.status = body.status;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { ok: false, error: "No fields to update" },
      { status: 400 },
    );
  }

  try {
    const override = await writeCatalogOverride(slug, patch);
    const material = await getResolvedMaterial(slug, { all: true, includeDrafts: true });
    const screen = await getResolvedScreen(slug, { all: true, includeDrafts: true });
    return NextResponse.json({ ok: true, override, material, screen });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
