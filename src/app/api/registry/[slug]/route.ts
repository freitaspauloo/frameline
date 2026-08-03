import { NextResponse } from "next/server";

import { getMaterial } from "@/materials";
import { isFreeMaterial } from "@/lib/entitlements";

/**
 * Registry read stub (WP6 / WP9).
 * Free materials are publicly readable. Paid materials return 403 until
 * entitlement-gated token verification is wired.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const material = getMaterial(slug);

  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  if (!isFreeMaterial(material) && material.tier !== "free") {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json(
        {
          error: "Entitlement required",
          message:
            "Paid registry sources require a Frameline access token. Purchase a license, then pass Authorization: Bearer <token>.",
        },
        { status: 403 },
      );
    }
    // Token verification lands with Postgres entitlements — accept demo tokens for now.
    if (!token.startsWith("fl_demo_") && !token.startsWith("fl_live_")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  }

  return NextResponse.json({
    name: material.slug,
    title: material.title,
    tier: material.tier,
    type: material.type,
    description: material.description,
    registry: `@frameline/${material.slug}`,
    install: `npx shadcn@latest add @frameline/${material.slug}`,
    status: "stub",
    note: "Package payload ships when the private registry is connected.",
  });
}
