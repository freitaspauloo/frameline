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
  | "shipping";

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
 * Four rotating notes. Issue 1 goes out 15 days after signup;
 * each later issue waits another 15 days, then the sequence loops.
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
