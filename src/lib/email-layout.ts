import { relayColors } from "@/lib/relay-tokens";

/** Inline hex from Relay tokens — email clients ignore CSS variables. */
export const mail = {
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

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export type FramelineEmailLayoutInput = {
  documentTitle: string;
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaHref: string;
  footerNote?: string;
  unsubscribeUrl?: string;
};

/**
 * Shared HTML chrome for Frameline mail (receipts, nurture).
 * Table-based, inline CSS, Instrument Serif + Inter.
 */
export function buildFramelineEmailHtml(
  input: FramelineEmailLayoutInput,
): string {
  const cta = escapeHtml(input.ctaHref);
  const unsubscribe = input.unsubscribeUrl
    ? escapeHtml(input.unsubscribeUrl)
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <title>${escapeHtml(input.documentTitle)}</title>
  <!--[if !mso]><!-->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
  <!--<![endif]-->
</head>
<body style="margin:0;padding:0;background:${mail.canvas};color:${mail.ink};-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(input.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${mail.canvas};padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${mail.white};border:1px solid ${mail.border}">
          <tr>
            <td style="height:3px;background:${mail.blue};font-size:0;line-height:0">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px">
              <p style="margin:0 0 20px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${mail.blue}">${escapeHtml(input.eyebrow)}</p>
              <h1 style="margin:0 0 10px;font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:1.15;letter-spacing:-0.02em;color:${mail.ink}">${escapeHtml(input.heading)}</h1>
              <p style="margin:0 0 24px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55;color:${mail.secondary}">${escapeHtml(input.intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px">
              ${input.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px">
              <a href="${cta}" style="display:inline-block;background:${mail.blue};color:${mail.white};text-decoration:none;padding:12px 18px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;border-radius:0;border:1px solid ${mail.blue}">${escapeHtml(input.ctaLabel)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid ${mail.border};background:${mail.panel}">
              <p style="margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;line-height:1.5;color:${mail.tertiary}">${escapeHtml(input.footerNote ?? "Design assets for the AI era")} &middot; <a href="https://frameline.ai" style="color:${mail.secondary};text-decoration:none">frameline.ai</a></p>
              ${
                unsubscribe
                  ? `<p style="margin:8px 0 0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;line-height:1.5;color:${mail.tertiary}">These notes go out every 15 days. <a href="${unsubscribe}" style="color:${mail.secondary};text-decoration:underline">Unsubscribe</a></p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function featureBlock(items: ReadonlyArray<{
  kicker: string;
  title: string;
  body: string;
}>): string {
  const rows = items
    .map((item, index) => {
      const last = index === items.length - 1;
      return `<tr>
  <td style="padding:0 0 ${last ? "0" : "16px"}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${mail.panel};border:1px solid ${mail.border}">
      <tr>
        <td style="padding:16px 18px">
          <p style="margin:0 0 6px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${mail.tertiary}">${escapeHtml(item.kicker)}</p>
          <p style="margin:0 0 6px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:15px;font-weight:600;line-height:1.35;color:${mail.ink}">${escapeHtml(item.title)}</p>
          <p style="margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:1.5;color:${mail.secondary}">${escapeHtml(item.body)}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}
