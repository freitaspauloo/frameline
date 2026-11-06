import { appBaseUrl } from "@/lib/app-url";
import {
  buildFramelineEmailHtml,
  featureBlock,
} from "@/lib/email-layout";

/** Cadence from signup (and between issues). */
export const NURTURE_INTERVAL_DAYS = 15;
export const NURTURE_INTERVAL_MS = NURTURE_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

export type NurtureIssueId =
  | "materials"
  | "screens"
  | "craft"
  | "shipping"
  | "collections"
  | "frames"
  | "still"
  | "install"
  | "offer"
  | "checkin"
  | "highlight"
  | "recipes";

export type NurtureIssue = {
  id: NurtureIssueId;
  /** 1-based issue number in the rotating sequence. */
  number: number;
  subject: string;
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  ctaLabel: string;
  path: string;
  features: ReadonlyArray<{ kicker: string; title: string; body: string }>;
  textBody: string;
};

/**
 * Twelve rotating notes (~6 months at 15-day spacing). Issue 1 goes out
 * 15 days after signup; each later issue waits another 15 days, then the
 * sequence loops.
 */
export const NURTURE_ISSUES: readonly NurtureIssue[] = [
  {
    id: "materials",
    number: 1,
    subject: "Frameline · a surface worth installing",
    preheader: "Two free materials, one install command, and the catalog.",
    eyebrow: "Frameline · Note 01",
    heading: "A surface worth installing",
    intro:
      "Materials are typed React you drop into the repo — not a black-box plugin. Start with a free one, wire your tokens, ship.",
    ctaLabel: "Browse materials",
    path: "/materials",
    features: [
      {
        kicker: "Free · mesh",
        title: "Aurora Mesh",
        body: "Soft multi-color mesh for heroes and marketing shells. Token-friendly color array. npx shadcn@latest add @frameline/aurora-mesh",
      },
      {
        kicker: "Free · grain",
        title: "Neuro Veil",
        body: "Glowing neural grain for cards, sections, and loading shells. One instance is plenty — pause it off-screen.",
      },
      {
        kicker: "Catalog",
        title: "Forty surfaces, same craft bar",
        body: "Free and paid share the same production bar. Filter by hero, card, auth, empty, or loading — then copy JSX or install from the registry.",
      },
    ],
    textBody:
      "Materials are typed React you drop into the repo. Start with Aurora Mesh or Neuro Veil (both free), wire your tokens, ship. Catalog: https://frameline.ai/materials",
  },
  {
    id: "screens",
    number: 2,
    subject: "Frameline · a screen, not a vibe",
    preheader: "Finished heroes with prompt + code copies. $9/mo.",
    eyebrow: "Frameline · Note 02",
    heading: "A screen, not a vibe",
    intro:
      "Screens are finished landing heroes — layout, motion, and copy already composed. One template, unlimited prompt and code copies.",
    ctaLabel: "Browse screens",
    path: "/screens",
    features: [
      {
        kicker: "$9/mo · hero",
        title: "Pulse Hero",
        body: "AI health companion landing — light sky canvas, hero video with fluted glass, GSAP morph intro, floating pill nav.",
      },
      {
        kicker: "$9/mo · hero",
        title: "Passo",
        body: "Running app homepage — night slideshow, lime accents, flip nav, two-column lockup. Built to look like a product, not a prompt.",
      },
      {
        kicker: "$9/mo · hero",
        title: "Softwave Hero",
        body: "Vintage desktop hero — bliss hill video, pixel headline, glass pill nav. Analog warmth without the generic AI sheen.",
      },
    ],
    textBody:
      "Screens are finished landing heroes. Pulse, Passo, Softwave — $9/mo for unlimited prompt + code copies. Catalog: https://frameline.ai/screens",
  },
  {
    id: "craft",
    number: 3,
    subject: "Frameline · tokens, not a palette",
    preheader: "Theme with your system. Pause off-screen. Own the source.",
    eyebrow: "Frameline · Note 03",
    heading: "Tokens, not a palette",
    intro:
      "If a material fights your design system, we failed. Defaults are token-bound. You own the component in the repo the moment it installs.",
    ctaLabel: "Read the theming guide",
    path: "/docs/theming",
    features: [
      {
        kicker: "Theming",
        title: "Wire colors to your theme",
        body: "Pass your tokens into the color props. Materials should not force Frameline blue onto a product that is not Frameline.",
      },
      {
        kicker: "Performance",
        title: "One instance, pause off-screen",
        body: "WebGL is fine for a hero. It is not fine stacked in a long list. Prefer forceStatic in grids; see the performance notes on each material.",
      },
      {
        kicker: "Install",
        title: "CLI or copy JSX",
        body: "npx shadcn@latest add @frameline/<slug> — or copy the component from the detail page. Either way, it is source in your tree.",
      },
    ],
    textBody:
      "Theme with your tokens. Pause WebGL off-screen. Install as source. Theming: https://frameline.ai/docs/theming — Performance: https://frameline.ai/docs/performance",
  },
  {
    id: "shipping",
    number: 4,
    subject: "Frameline · what shipped",
    preheader: "Catalog notes, licenses, and the next surface.",
    eyebrow: "Frameline · Note 04",
    heading: "What shipped",
    intro:
      "The catalog moves. This note is the quiet changelog — new surfaces, license clarity, and the path back in if you have not installed yet.",
    ctaLabel: "Open the changelog",
    path: "/changelog",
    features: [
      {
        kicker: "Catalog",
        title: "Materials stay free to evaluate",
        body: "Production-ready free materials with the same craft bar as paid. Screens are $9/mo for unlimited copies of one template.",
      },
      {
        kicker: "Licensing",
        title: "You own the code after install",
        body: "Source in your repo, license pinned on the receipt. Terms and the comparison table live on the license page.",
      },
      {
        kicker: "Still browsing",
        title: "Waitlist + live demos",
        body: "If you have not picked a surface yet, the waitlist page still has live previews. We write when a new one ships.",
      },
    ],
    textBody:
      "Catalog notes and licenses. Changelog: https://frameline.ai/changelog — License: https://frameline.ai/license — Waitlist: https://frameline.ai/waitlist",
  },
  {
    id: "collections",
    number: 5,
    subject: "Frameline · pick a set, not a slug",
    preheader: "Hero surfaces, quiet fields, and nocturnal — curated, not dumped.",
    eyebrow: "Frameline · Note 05",
    heading: "Pick a set, not a slug",
    intro:
      "The catalog is forty surfaces. Collections are the short list — grouped by job, not by shader family.",
    ctaLabel: "Browse collections",
    path: "/collections",
    features: [
      {
        kicker: "Hero",
        title: "Hero surfaces",
        body: "Full-bleed mesh and dither for the first viewport. Aurora Mesh, Tide Wave, Ember Warp — brand and CTA on the same plate.",
      },
      {
        kicker: "Cards · auth",
        title: "Quiet fields",
        body: "Understated grain and soft mesh for cards, auth shells, and secondary bands. Grain Field and Neuro Veil live here.",
      },
      {
        kicker: "Night",
        title: "Nocturnal",
        body: "Dark and dusk materials for night auth, heroes, and quiet cards. Grain Night, Aurora Dusk, Dusk Veil.",
      },
    ],
    textBody:
      "Collections group surfaces by job. Hero surfaces, Quiet fields, Nocturnal. Catalog: https://frameline.ai/collections",
  },
  {
    id: "frames",
    number: 6,
    subject: "Frameline · three more frames",
    preheader: "FORGE.AI, Bridge Dither, Miracle Login — finished heroes, $9/mo.",
    eyebrow: "Frameline · Note 06",
    heading: "Three more frames",
    intro:
      "If Pulse and Passo were not the product, these might be. Same $9/mo: unlimited prompt and code copies of one template.",
    ctaLabel: "Browse screens",
    path: "/screens",
    features: [
      {
        kicker: "$9/mo · hero",
        title: "FORGE.AI Hero",
        body: "AI builder landing — blue gradient field, typewriter prompt, model chips, template rail. A prompt bar that looks shipped.",
      },
      {
        kicker: "$9/mo · hero",
        title: "Bridge Dither",
        body: "Warm bridge dither art — interactive canvas, progressive blur edges, GSAP headline reveal. Not a stock gradient.",
      },
      {
        kicker: "$9/mo · auth",
        title: "Miracle Login",
        body: "Split-panel sign-in — magenta-tinted cover art, Reticle chrome, GSAP panel entrance. Auth as a designed surface.",
      },
    ],
    textBody:
      "FORGE.AI, Bridge Dither, Miracle Login — $9/mo for unlimited prompt + code copies. Catalog: https://frameline.ai/screens",
  },
  {
    id: "still",
    number: 7,
    subject: "Frameline · still, not spinning",
    preheader: "CSS washes and static fields when a GPU loop is the wrong tool.",
    eyebrow: "Frameline · Note 07",
    heading: "Still, not spinning",
    intro:
      "Not every surface should animate. CSS-only washes and static mesh fields hold atmosphere with negligible GPU — for long pages, emails of the product, and quiet chrome.",
    ctaLabel: "See free surfaces",
    path: "/free",
    features: [
      {
        kicker: "CSS · free",
        title: "CSS essentials",
        body: "Sera Wash, Stone Band, Blue Signal, Grid Ghost — washes, bands, and soft layers. Negligible GPU cost.",
      },
      {
        kicker: "Static mesh",
        title: "Still gradients",
        body: "Still Mesh, Radial Still, Paper Tooth. No animation loop, full atmosphere. Prefer these in grids instead of stacking WebGL.",
      },
      {
        kicker: "Evaluate",
        title: "Free to try",
        body: "Fourteen free materials at the same craft bar as paid. Install one, theme it, decide later.",
      },
    ],
    textBody:
      "CSS washes and static fields when a loop is wrong. Free surfaces: https://frameline.ai/free — Collections: https://frameline.ai/collections/css-essentials",
  },
  {
    id: "install",
    number: 8,
    subject: "Frameline · one command, then it is yours",
    preheader: "Registry install or copy JSX. Source in the repo either way.",
    eyebrow: "Frameline · Note 08",
    heading: "One command, then it is yours",
    intro:
      "Frameline is not a runtime you keep paying to host. Install from the registry or copy the JSX. The component lives in your tree.",
    ctaLabel: "Read the install guide",
    path: "/docs/installation",
    features: [
      {
        kicker: "CLI",
        title: "shadcn registry",
        body: "npx shadcn@latest add @frameline/aurora-mesh — same flow as the rest of your UI kit. Pin the slug, ship.",
      },
      {
        kicker: "Copy",
        title: "JSX from the detail page",
        body: "Open a material, copy the component. No CLI required. You still own the file.",
      },
      {
        kicker: "Stuck",
        title: "Docs, not a ticket",
        body: "Installation, theming, performance, troubleshooting. Written for engineers who ship, not a support queue.",
      },
    ],
    textBody:
      "Install from the registry or copy JSX. Guide: https://frameline.ai/docs/installation — Examples: https://frameline.ai/docs/examples",
  },
  {
    id: "offer",
    number: 9,
    subject: "Frameline · $9, or one copy a week",
    preheader: "Free is one copy per week. Screen is $9/mo, $49/y, or $150 lifetime.",
    eyebrow: "Frameline · Note 09",
    heading: "$9, or one copy a week",
    intro:
      "Materials stay free to evaluate. Screens are the paid surface — unlimited prompt and code copies of one template. No seat tax.",
    ctaLabel: "See pricing",
    path: "/pricing",
    features: [
      {
        kicker: "Free",
        title: "$0 · one copy a week",
        body: "Install any free material. One prompt or code copy per week. Enough to try, not enough to ship a whole marketing site on the house.",
      },
      {
        kicker: "Screen",
        title: "$9/mo · unlimited copies",
        body: "One template, unlimited prompt + code. Yearly is $49. Lifetime is $150 if you do not want a renewal.",
      },
      {
        kicker: "Source",
        title: "You own the file after copy",
        body: "The license is on the receipt. Edit, theme, ship. You are not renting a hosted shader.",
      },
    ],
    textBody:
      "Free: 1 copy/week. Screen: $9/mo, $49/y, or $150 lifetime. Pricing: https://frameline.ai/pricing",
  },
  {
    id: "checkin",
    number: 10,
    subject: "Frameline · still here?",
    preheader: "No pitch. A reminder the catalog is still open, and you can leave.",
    eyebrow: "Frameline · Note 10",
    heading: "Still here?",
    intro:
      "It has been a few months. If a surface is sitting in a tab, install it. If these notes are noise, unsubscribe — the link is at the bottom, no guilt.",
    ctaLabel: "Open the catalog",
    path: "/materials",
    features: [
      {
        kicker: "If you stalled",
        title: "Pick one free material",
        body: "Aurora Mesh or Neuro Veil. One command. Theme the colors. That is the whole test.",
      },
      {
        kicker: "If you already shipped",
        title: "You can ignore this",
        body: "The catalog is there when the next hero needs a field that does not look like every other AI landing page.",
      },
      {
        kicker: "If this is noise",
        title: "Leave in one click",
        body: "Unsubscribe in the footer. Receipts and license mail still go out if you buy. These notes stop.",
      },
    ],
    textBody:
      "Still here? Catalog: https://frameline.ai/materials — Unsubscribe is in the footer of this email.",
  },
  {
    id: "highlight",
    number: 11,
    subject: "Frameline · what is on the table now",
    preheader: "A snapshot of shipped screens and materials — the live catalog, not a rumor.",
    eyebrow: "Frameline · Note 11",
    heading: "What is on the table now",
    intro:
      "This note is the publication pass — what is actually on frameline.ai today. New heroes land on /screens. New fields land in the catalog. Ship notes live on the changelog.",
    ctaLabel: "Open the changelog",
    path: "/changelog",
    features: [
      {
        kicker: "Screens",
        title: "Ten finished heroes",
        body: "Pulse, Passo, FORGE.AI, Softwave, Bridge Dither, Miracle Login, Dark Pill Nav, and the rest of the public grid. $9/mo per template.",
      },
      {
        kicker: "Materials",
        title: "Forty surfaces, fourteen free",
        body: "Mesh, dither, grain, CSS washes. Same craft bar. Filter by hero, card, auth, empty, loading.",
      },
      {
        kicker: "Ship notes",
        title: "Changelog, not a thread",
        body: "When something new actually ships, it is written here. No launch-week theatrics.",
      },
    ],
    textBody:
      "What is live now. Changelog: https://frameline.ai/changelog — Screens: https://frameline.ai/screens — Materials: https://frameline.ai/materials",
  },
  {
    id: "recipes",
    number: 12,
    subject: "Frameline · a recipe, not a demo",
    preheader: "Hero, card, auth, empty, loading — paste-ready compositions.",
    eyebrow: "Frameline · Note 12",
    heading: "A recipe, not a demo",
    intro:
      "The last note in the cycle is how to actually compose. Examples are paste-ready. Use contexts tell you where a surface belongs.",
    ctaLabel: "Open examples",
    path: "/docs/examples",
    features: [
      {
        kicker: "Hero · section",
        title: "Full-bleed first",
        body: "Mesh and wave for the first viewport. One instance. Pause off-screen. Wire tokens before you ship the palette.",
      },
      {
        kicker: "Card · auth · empty",
        title: "Quiet chrome",
        body: "Grain, still gradients, CSS washes. Prefer forceStatic in lists. Auth shells should not melt the fan.",
      },
      {
        kicker: "Loading",
        title: "A field, not a spinner",
        body: "Signal Dots, Neuro Veil, Grid Ghost — wait states that still look like the product.",
      },
    ],
    textBody:
      "Paste-ready compositions. Examples: https://frameline.ai/docs/examples — Contexts: https://frameline.ai/materials",
  },
] as const;

export function getNurtureIssue(id: string): NurtureIssue | null {
  return NURTURE_ISSUES.find((issue) => issue.id === id) ?? null;
}

export function nurtureIssueAt(index: number): NurtureIssue {
  const issue = NURTURE_ISSUES[index % NURTURE_ISSUES.length];
  if (!issue) {
    throw new Error("NURTURE_ISSUES is empty");
  }
  return issue;
}

export type RenderNurtureInput = {
  email: string;
  unsubscribeUrl: string;
  baseUrl?: string;
};

export type RenderedNurtureEmail = {
  issue: NurtureIssue;
  subject: string;
  html: string;
  text: string;
  ctaHref: string;
};

export function renderNurtureEmail(
  issue: NurtureIssue,
  input: RenderNurtureInput,
): RenderedNurtureEmail {
  const base = (input.baseUrl ?? appBaseUrl()).replace(/\/$/, "");
  const ctaHref = new URL(issue.path, `${base}/`).toString();

  const html = buildFramelineEmailHtml({
    documentTitle: issue.subject,
    preheader: issue.preheader,
    eyebrow: issue.eyebrow,
    heading: issue.heading,
    intro: issue.intro,
    bodyHtml: featureBlock(issue.features),
    ctaLabel: issue.ctaLabel,
    ctaHref,
    unsubscribeUrl: input.unsubscribeUrl,
  });

  const text = [
    issue.subject,
    "",
    issue.intro,
    "",
    issue.textBody,
    "",
    `${issue.ctaLabel}: ${ctaHref}`,
    "",
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");

  return { issue, subject: issue.subject, html, text, ctaHref };
}

export function isNurtureDue(input: {
  enrolledAt: Date | string;
  lastSentAt: Date | string | null;
  unsubscribedAt: Date | string | null;
  now?: Date;
}): boolean {
  if (input.unsubscribedAt) return false;
  const now = input.now ?? new Date();
  const anchor = input.lastSentAt ?? input.enrolledAt;
  const at = typeof anchor === "string" ? new Date(anchor) : anchor;
  if (Number.isNaN(at.getTime())) return false;
  return now.getTime() - at.getTime() >= NURTURE_INTERVAL_MS;
}
