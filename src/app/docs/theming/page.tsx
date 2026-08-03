import Link from "next/link";

import {
  DocsCallout,
  DocsCode,
  DocsH2,
  DocsInlineCode,
  DocsP,
  DocsShell,
  DocsUl,
} from "@/components/docs-shell";

export default function ThemingDocsPage() {
  return (
    <DocsShell
      currentPath="/docs/theming"
      description="Materials bind to your design tokens. There is no Frameline color fork for dark mode — pass CSS variables and the surface follows your theme."
      title="Theming & tokens"
    >
      <DocsP>
        Every material exposes color (and sometimes intensity) props that accept
        any valid CSS color. The production pattern is to pass{" "}
        <DocsInlineCode>var(--…)</DocsInlineCode> references from your theme —
        the same variables your buttons, cards, and text already use.
      </DocsP>

      <DocsH2 id="token-binding">Token binding</DocsH2>
      <DocsP>
        Prefer semantic tokens over raw hex. Example for a mesh that takes a
        color array:
      </DocsP>
      <DocsCode>{`import { AuroraMesh } from "@/components/ui/aurora-mesh"

export function BrandedHero() {
  return (
    <AuroraMesh
      aria-hidden
      className="absolute inset-0"
      colors={[
        "var(--brand-surface)",
        "var(--brand-accent)",
        "var(--brand-highlight)",
        "var(--brand-ink)",
      ]}
    />
  )
}`}</DocsCode>
      <DocsUl>
        <li>
          Map material props 1:1 to your token names in one place (a thin
          wrapper component) so product screens never hardcode Frameline demos.
        </li>
        <li>
          Keep fallback gradients in sync — materials ship{" "}
          <DocsInlineCode>fallbackColors</DocsInlineCode> for reduced-motion and
          pre-mount states; override them with the same token set when you
          customize.
        </li>
        <li>
          Opacity and blend props should stay unitless or use theme-owned
          spacing scales — avoid one-off magic numbers per page.
        </li>
      </DocsUl>

      <DocsH2 id="css-variables">CSS variables</DocsH2>
      <DocsP>
        Define tokens on <DocsInlineCode>:root</DocsInlineCode> and a dark
        selector your app already uses (
        <DocsInlineCode>.dark</DocsInlineCode>,{" "}
        <DocsInlineCode>{`[data-theme="dark"]`}</DocsInlineCode>, etc.):
      </DocsP>
      <DocsCode>{`:root {
  --brand-surface: oklch(0.97 0.02 220);
  --brand-accent: oklch(0.62 0.2 264);
  --brand-highlight: oklch(0.72 0.18 330);
  --brand-ink: oklch(0.22 0.02 264);
}

.dark {
  --brand-surface: oklch(0.22 0.03 264);
  --brand-accent: oklch(0.7 0.16 264);
  --brand-highlight: oklch(0.75 0.14 330);
  --brand-ink: oklch(0.95 0.01 220);
}`}</DocsCode>
      <DocsP>
        Because the material reads live CSS variables, flipping the theme class
        (or <DocsInlineCode>prefers-color-scheme</DocsInlineCode> if that drives
        your tokens) updates the surface without remounting or forking the
        component.
      </DocsP>

      <DocsH2 id="dark-mode">Dark mode without a fork</DocsH2>
      <DocsUl>
        <li>
          Do not ship a second “dark” material. One component + token pairs is
          the contract.
        </li>
        <li>
          Preview both themes on the material detail page before you install —
          contrast for overlaid text can change dramatically.
        </li>
        <li>
          If a WebGL material samples colors at mount, ensure your theme class
          is applied before first paint (same rule as any tokenized UI).
        </li>
      </DocsUl>

      <DocsCallout title="Tailwind tip">
        If you use Tailwind v4 theme tokens, expose them as CSS variables and
        pass those into material props. Avoid translating through{" "}
        <DocsInlineCode>theme()</DocsInlineCode> inside the material itself —
        keep the boundary at the call site so design-system ownership stays in
        your app.
      </DocsCallout>

      <DocsP>
        Related:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/accessibility"
        >
          contrast over materials
        </Link>{" "}
        ·{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/troubleshooting#theme-colors"
        >
          theme colors look wrong
        </Link>
        .
      </DocsP>
    </DocsShell>
  );
}
