import { Resend } from "resend";

import type { LicensePlanKey } from "@/lib/domain";
import { getLicensePlan } from "@/lib/license-plans";
import { captureException, captureMessage } from "@/lib/monitoring";
import { relayColors } from "@/lib/relay-tokens";
import { appBaseUrl } from "@/lib/stripe";

let resend: Resend | null = null;

/** Inline hex from Relay tokens — email clients ignore CSS variables. */
const mail = {
  ink: relayColors.text.ink.value,
  secondary: relayColors.text.secondary.value,
  tertiary: relayColors.text.tertiary.value,
  blue: relayColors.brand.blue.value,
  blueTint: relayColors.brand.blueTint.value,
  white: relayColors.surface.white.value,
  canvas: relayColors.surface.canvas.value,
  panel: relayColors.surface.panel.value,
  border: relayColors.border.default.value,
} as const;

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

function detailRow(label: string, value: string, last = false): string {
  const pad = last ? "0" : "10px";
  return `<tr>
  <td style="padding:0 0 ${pad};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${mail.tertiary};font-family:Inter,ui-sans-serif,system-ui,sans-serif;width:132px;vertical-align:top">${escapeHtml(label)}</td>
  <td style="padding:0 0 ${pad};font-size:14px;line-height:1.45;color:${mail.ink};font-family:Inter,ui-sans-serif,system-ui,sans-serif;word-break:break-all">${value}</td>
</tr>`;
}

/** Receipt HTML aligned with Relay / order confirmation UI. */
export function buildOrderReceiptHtml(input: {
  orderId: string;
  planName: string;
  amount: string;
  licenseVersion: string;
  materialSlug: string | null;
  email: string;
  accessUrl: string;
}): string {
  const access = escapeHtml(input.accessUrl);
  const materialRow = input.materialSlug
    ? detailRow("Material", escapeHtml(input.materialSlug))
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <title>Frameline receipt</title>
  <!--[if !mso]><!-->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
  <!--<![endif]-->
</head>
<body style="margin:0;padding:0;background:${mail.canvas};color:${mail.ink};-webkit-font-smoothing:antialiased">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${mail.canvas};padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${mail.white};border:1px solid ${mail.border}">
          <tr>
            <td style="height:3px;background:${mail.blue};font-size:0;line-height:0">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px">
              <p style="margin:0 0 20px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${mail.blue}">Frameline</p>
              <h1 style="margin:0 0 10px;font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:1.15;letter-spacing:-0.02em;color:${mail.ink}">You&rsquo;re in</h1>
              <p style="margin:0 0 24px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55;color:${mail.secondary}">${escapeHtml(input.planName)} license confirmed (${escapeHtml(input.amount)}). Keep this email &mdash; receipt and reinstall path.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${mail.panel};border:1px solid ${mail.border}">
                <tr>
                  <td style="padding:18px 20px">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${detailRow("Order", escapeHtml(input.orderId))}
                      ${detailRow("Plan", `${escapeHtml(input.planName)} (${escapeHtml(input.amount)})`)}
                      ${detailRow("License", escapeHtml(input.licenseVersion))}
                      ${materialRow}
                      ${detailRow("Email", escapeHtml(input.email), true)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px">
              <a href="${access}" style="display:inline-block;background:${mail.blue};color:${mail.white};text-decoration:none;padding:12px 18px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;border-radius:0;border:1px solid ${mail.blue}">Open order &amp; token</a>
              <p style="margin:16px 0 0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:12px;line-height:1.5;color:${mail.tertiary}">If the button does not work, copy this link:<br/><a href="${access}" style="color:${mail.blue};text-decoration:underline;word-break:break-all">${access}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid ${mail.border};background:${mail.panel}">
              <p style="margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;line-height:1.5;color:${mail.tertiary}">Design assets for the AI era &middot; <a href="https://frameline.ai" style="color:${mail.secondary};text-decoration:none">frameline.ai</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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

  const subject = `Frameline receipt — ${planName} license`;
  const html = buildOrderReceiptHtml({
    orderId: order.id,
    planName,
    amount,
    licenseVersion: order.licenseVersion,
    materialSlug: order.materialSlug,
    email: order.email,
    accessUrl: accessUrl.toString(),
  });

  const text = [
    "Frameline — you're in",
    "",
    `${planName} license confirmed (${amount}).`,
    "Keep this email — receipt and reinstall path.",
    "",
    `Order: ${order.id}`,
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

  const text = [
    `From: ${input.name} <${input.email}>`,
    "",
    input.message,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background:${mail.canvas};font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:${mail.ink}">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:${mail.white};border:1px solid ${mail.border}">
    <tr><td style="height:3px;background:${mail.blue};font-size:0;line-height:0">&nbsp;</td></tr>
    <tr>
      <td style="padding:24px 28px">
        <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${mail.blue}">Frameline · Contact</p>
        <p style="margin:0 0 8px;font-size:14px;color:${mail.secondary}"><strong style="color:${mail.ink}">${escapeHtml(input.name)}</strong> &lt;${escapeHtml(input.email)}&gt;</p>
        <p style="margin:16px 0 0;font-size:14px;line-height:1.55;white-space:pre-wrap">${escapeHtml(input.message)}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { data, error } = await client.emails.send({
      from: emailFrom(),
      to: [notifyTo],
      replyTo: input.email,
      subject: `Frameline contact — ${input.name}`,
      text,
      html,
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
