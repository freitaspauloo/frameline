import { NextResponse } from "next/server";

import { getDemoOrderById } from "@/lib/fulfillment";
import { captureException } from "@/lib/monitoring";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const order = await getDemoOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        email: order.email,
        status: order.status,
        planKey: order.planKey,
        licenseVersion: order.licenseVersion,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        createdAt: order.createdAt,
        materialSlug: order.materialSlug,
        registryToken: order.registryToken,
        entitlementId: order.entitlementId,
        paymentProviderRef: order.paymentProviderRef,
      },
    });
  } catch (err) {
    captureException(err, { route: "api/orders/[id]", id });
    const message =
      err instanceof Error ? err.message : "Order lookup failed";
    // Surface Prisma engine / DB init failures so deploy issues are visible.
    return NextResponse.json(
      {
        ok: false,
        error: "Order lookup failed",
        detail: message.slice(0, 240),
      },
      { status: 500 },
    );
  }
}
