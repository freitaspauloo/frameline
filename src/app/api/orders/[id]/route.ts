import { NextResponse } from "next/server";

import { getDemoOrderById } from "@/lib/fulfillment";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
}
