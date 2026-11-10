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

const SANS =
  "Inter,ui-sans-serif,system-ui,sans-serif";
const SERIF = "'Instrument Serif',Georgia,'Times New Roman',serif";

/** Solid cell. Email clients drop empty cells unless they hold a nbsp. */
function swatch(size: number, color: string): string {
  return `<td width="${size}" height="${size}" bgcolor="${color}" style="width:${size}px;height:${size}px;background:${color};font-size:0;line-height:0">&nbsp;</td>`;
}

/**
 * Four squares with a cross gap — the Frameline mark, reduced to cells
 * Outlook will actually paint.
 */
export function mailAperture(): string {
  const size = 8;
  const gap = 3;
  const gutter = `<td width="${gap}" height="${size}" style="width:${gap}px;font-size:0;line-height:0">&nbsp;</td>`;
  const rowGap = `<tr><td colspan="3" height="${gap}" style="height:${gap}px;font-size:0;line-height:0">&nbsp;</td></tr>`;
  const row = `<tr>${swatch(size, mail.blue)}${gutter}${swatch(size, mail.blue)}</tr>`;
  return `<!-- frameline-ornament:aperture --><table role="presentation" cellpadding="0" cellspacing="0" border="0">${row}${rowGap}${row}</table>`;
}

/** Tiny material chip — a two-row checker, the shader swatch in miniature. */
export function mailChip(): string {
  const size = 8;
  const row = (offset: number) =>
    `<tr>${[0, 1, 2, 3]
      .map((index) =>
        swatch(
          size,
          (index + offset) % 2 === 0 ? mail.blue : mail.blueTint,
        ),
      )
      .join("")}</tr>`;
  return `<!-- frameline-ornament:chip --><table role="presentation" cellpadding="0" cellspacing="0" border="0">${row(0)}${row(1)}</table>`;
}

/** Mark, wordmark, and chip. The letterhead shared by every Frameline mail. */
export function mailLetterhead(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td valign="middle" style="padding-top:2px;vertical-align:middle">${mailAperture()}</td>
      <td width="12" valign="middle" style="width:12px;font-size:0;line-height:0;vertical-align:middle">&nbsp;</td>
      <td valign="middle" style="vertical-align:middle;font-family:${SERIF};font-size:22px;line-height:1;letter-spacing:-0.02em;color:${mail.ink}">Frameline</td>
      <td align="right" valign="middle" style="text-align:right;vertical-align:middle">${mailChip()}</td>
    </tr>
  </table>`;
}

/**
 * Hairline with a square on each end — the same registration mark the
 * marketing pages put on rail intersections.
 */
export function mailRail(): string {
  const dot = swatch(5, mail.blue);
  return `<!-- frameline-ornament:rail --><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${dot}<td height="5" style="height:5px;border-bottom:1px solid ${mail.border};font-size:0;line-height:0">&nbsp;</td>${dot}</tr></table>`;
}

/** Square perforations along the top edge. Counts stay low so phones still fit. */
export function mailPerforation(): string {
  const count = 12;
  const hole = `<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0"><tr>${swatch(7, mail.blue)}</tr></table>`;
  const cells = Array.from(
    { length: count },
    () =>
      `<td align="center" valign="middle" style="padding:9px 0;text-align:center;vertical-align:middle">${hole}</td>`,
  ).join("");
  return `<!-- frameline-ornament:perforation --><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${mail.panel}" style="background:${mail.panel}"><tr>${cells}</tr></table>`;
}

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
  /** Extra HTML inside the CTA cell, under the button. */
  belowCtaHtml?: string;
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
            <td style="font-size:0;line-height:0">${mailPerforation()}</td>
          </tr>
          <tr>
            <td style="padding:26px 28px 8px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 0 18px">${mailLetterhead()}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 22px">${mailRail()}</td>
                </tr>
              </table>
              <p style="margin:0 0 20px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${mail.blue}">${escapeHtml(input.eyebrow)}</p>
              <h1 style="margin:0 0 10px;font-family:${SERIF};font-size:34px;font-weight:400;line-height:1.15;letter-spacing:-0.02em;color:${mail.ink}">${escapeHtml(input.heading)}</h1>
              <p style="margin:0 0 24px;font-family:${SANS};font-size:14px;line-height:1.55;color:${mail.secondary}">${escapeHtml(input.intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px">
              ${input.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px">
              <a href="${cta}" style="display:inline-block;background:${mail.blue};color:${mail.white};text-decoration:none;padding:12px 18px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;border-radius:0;border:1px solid ${mail.blue}">${escapeHtml(input.ctaLabel)}</a>
              ${input.belowCtaHtml ?? ""}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 16px">${mailRail()}</td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:${mail.panel}">
              <p style="margin:0;font-family:${SANS};font-size:11px;line-height:1.5;color:${mail.tertiary}">${escapeHtml(input.footerNote ?? "Design assets for the AI era")} &middot; <a href="https://frameline.ai" style="color:${mail.secondary};text-decoration:none">frameline.ai</a></p>
              ${
                unsubscribe
                  ? `<p style="margin:8px 0 0;font-family:${SANS};font-size:11px;line-height:1.5;color:${mail.tertiary}">These notes go out every 15 days. <a href="${unsubscribe}" style="color:${mail.secondary};text-decoration:underline">Unsubscribe</a></p>`
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
          <p style="margin:0 0 6px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${mail.tertiary}">${escapeHtml(item.kicker)}</p>
          <p style="margin:0 0 6px;font-family:${SANS};font-size:15px;font-weight:600;line-height:1.35;color:${mail.ink}">${escapeHtml(item.title)}</p>
          <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.5;color:${mail.secondary}">${escapeHtml(item.body)}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}
