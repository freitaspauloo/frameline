import { Resend } from "resend";

import type { LicensePlanKey } from "@/lib/domain";
import { getLicensePlan } from "@/lib/license-plans";
import { captureException, captureMessage } from "@/lib/monitoring";
import { appBaseUrl } from "@/lib/stripe";

let resend: Resend | null = null;

export type OrderReceiptInput = {
  created: boolean;
  registryToken: string;
  order: {
    id: string;
    email: string;
    planKey: LicensePlanKey;
    licenseVersion: string;
    total: number;
    materialSlug: string | null;
  };
};

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!resend) {
    resend = new Resend(key);
  }
  return resend;
}

export function isEmailConfigured(): boolean {
  return Boolean(getResend());
}

/** From address — use a verified domain in production; Resend test sender otherwise. */
export function emailFrom(): string {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "Frameline <onboarding@resend.dev>"
  );
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export type SendResult =
  | { ok: true; id: string; skipped?: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string };

/**
 * Send order receipt + durable access link.
 * No-ops when RESEND_API_KEY is unset so local/demo still works.
 */
export async function sendOrderReceipt(
  result: OrderReceiptInput,
): Promise<SendResult> {
  const client = getResend();
  if (!client) {
    return { ok: true, skipped: true, reason: "RESEND_API_KEY not set" };
  }

  // Idempotent retries must not re-email (token plaintext only on create).
  if (!result.created) {
    return { ok: true, skipped: true, reason: "order already fulfilled" };
  }

  const order = result.order;
  const license = getLicensePlan(order.planKey);
  const planName = license?.name ?? order.planKey;
  const amount = formatCents(order.total);
  const base = appBaseUrl();
  const accessUrl = new URL(`/orders/${order.id}`, base);
  accessUrl.searchParams.set("email", order.email);
  accessUrl.searchParams.set("plan", order.planKey);
  accessUrl.searchParams.set("token", result.registryToken);
  if (order.materialSlug) {
    accessUrl.searchParams.set("material", order.materialSlug);
  }

  const materialLine = order.materialSlug
    ? `<p style="margin:0 0 12px"><strong>Material:</strong> ${escapeHtml(order.materialSlug)}</p>`
    : "";

  const subject = `Frameline receipt — ${planName} license`;
  const html = `<!DOCTYPE html>
<html>
<body style="font-family:ui-sans-serif,system-ui,sans-serif;color:#111;line-height:1.5;max-width:560px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#666">Frameline</p>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:600">Your license is ready</h1>
  <p style="margin:0 0 16px">Thanks for your purchase. Keep this email — it is your receipt and reinstall path.</p>
  <div style="border:1px solid #e5e5e5;border-radius:12px;padding:16px;margin:0 0 20px;background:#fafafa">
    <p style="margin:0 0 8px"><strong>Order:</strong> ${escapeHtml(order.id)}</p>
    <p style="margin:0 0 8px"><strong>Plan:</strong> ${escapeHtml(planName)} (${escapeHtml(amount)})</p>
    <p style="margin:0 0 8px"><strong>License version:</strong> ${escapeHtml(order.licenseVersion)}</p>
    ${materialLine}
    <p style="margin:0"><strong>Email:</strong> ${escapeHtml(order.email)}</p>
  </div>
  <p style="margin:0 0 20px">
    <a href="${escapeHtml(accessUrl.toString())}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:500">Open order &amp; registry token</a>
  </p>
  <p style="margin:0;font-size:13px;color:#666">If the button does not work, copy this link:<br/>${escapeHtml(accessUrl.toString())}</p>
</body>
</html>`;

  const text = [
    "Frameline — your license is ready",
    "",
    `Order: ${order.id}`,
    `Plan: ${planName} (${amount})`,
    `License version: ${order.licenseVersion}`,
    order.materialSlug ? `Material: ${order.materialSlug}` : null,
    `Email: ${order.email}`,
    "",
    `Open your order: ${accessUrl.toString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { data, error } = await client.emails.send({
      from: emailFrom(),
      to: [order.email],
      subject,
      html,
      text,
    });

    if (error) {
      captureException(error, { route: "email/receipt", orderId: order.id });
      return { ok: false, error: error.message };
    }

    if (!data?.id) {
      captureMessage("Resend returned no email id", {
        route: "email/receipt",
        orderId: order.id,
      });
      return { ok: false, error: "Resend returned no email id" };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    captureException(err, { route: "email/receipt", orderId: order.id });
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send receipt",
    };
  }
}

/** Optional notify for contact form submissions. */
export async function sendContactNotification(input: {
  name: string;
  email: string;
  message: string;
}): Promise<SendResult> {
  const client = getResend();
  if (!client) {
    return { ok: true, skipped: true, reason: "RESEND_API_KEY not set" };
  }

  const notifyTo =
    process.env.CONTACT_TO?.trim() ||
    process.env.FRAMELINE_ADMIN_EMAILS?.split(",")[0]?.trim();

  if (!notifyTo) {
    return {
      ok: true,
      skipped: true,
      reason: "CONTACT_TO / FRAMELINE_ADMIN_EMAILS not set",
    };
  }

  try {
    const { data, error } = await client.emails.send({
      from: emailFrom(),
      to: [notifyTo],
      replyTo: input.email,
      subject: `Frameline contact — ${input.name}`,
      text: [
        `From: ${input.name} <${input.email}>`,
        "",
        input.message,
      ].join("\n"),
    });

    if (error) {
      captureException(error, { route: "email/contact" });
      return { ok: false, error: error.message };
    }

    return data?.id
      ? { ok: true, id: data.id }
      : { ok: false, error: "Resend returned no email id" };
  } catch (err) {
    captureException(err, { route: "email/contact" });
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send contact mail",
    };
  }
}
