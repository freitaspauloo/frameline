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

function toPascalCase(slug: string) {
  return slug
    .split("-")
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join("");
}

export default async function InstallationDocsPage({
  searchParams,
}: {
  searchParams: Promise<{ material?: string }>;
}) {
  const { material = "aurora-mesh" } = await searchParams;
  const componentName = toPascalCase(material);

  return (
    <DocsShell
      currentPath="/docs/installation"
      description="CLI or copy-paste. Source lands in your repo — you own it, you can edit it, and there is no runtime lock-in."
      title="Installation"
    >
      <DocsP>
        Frameline materials install like shadcn components: a registry package
        writes typed source into{" "}
        <DocsInlineCode>@/components/ui</DocsInlineCode>. Free materials install
        without auth. Paid materials need a registry token from your account
        after purchase.
      </DocsP>

      <DocsH2 id="cli">CLI install</DocsH2>
      <DocsP>
        From your app root (Next.js, Vite, or any project already set up for
        the shadcn CLI):
      </DocsP>
      <DocsCode>{`# Free or entitled materials
npx shadcn@latest add @frameline/${material}

# Explicit registry URL (CI / non-interactive)
npx shadcn@latest add "https://frameline.ai/r/${material}.json"`}</DocsCode>
      <DocsP>
        Continuing from a material page? Replace{" "}
        <DocsInlineCode>{material}</DocsInlineCode> with any catalog slug, or
        open{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href={`/materials/${material}`}
        >
          {material}
        </Link>{" "}
        for the copy button that matches the live configurator output.
      </DocsP>

      <DocsH2 id="import">Import and render</DocsH2>
      <DocsCode>{`import { ${componentName} } from "@/components/ui/${material}"

export function Hero() {
  return (
    <section className="relative min-h-[70vh]">
      <${componentName} className="absolute inset-0" aria-hidden />
      <div className="relative z-10 …">…</div>
    </section>
  )
}`}</DocsCode>
      <DocsUl>
        <li>
          Materials are decorative by default — put{" "}
          <DocsInlineCode>aria-hidden</DocsInlineCode> on the surface and keep
          readable content in a sibling layer.
        </li>
        <li>
          Pass colors as props that map to your CSS variables (see{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/docs/theming"
          >
            Theming
          </Link>
          ).
        </li>
        <li>
          Prefer the material’s documented size and placement notes on its
          detail page over inventing new containers.
        </li>
      </DocsUl>

      <DocsH2 id="copy-paste">Copy-paste path</DocsH2>
      <DocsP>
        If you do not use the CLI, open any material detail page and use{" "}
        <strong className="font-medium text-foreground">Copy JSX</strong> from
        the configurator. Paste the generated component tree into your file,
        then copy the underlying source from the same page’s install panel into{" "}
        <DocsInlineCode>components/ui/{material}.tsx</DocsInlineCode>. Keep peer
        dependencies listed on the material page in sync with your{" "}
        <DocsInlineCode>package.json</DocsInlineCode>.
      </DocsP>

      <DocsH2 id="registry-token">Registry token (paid materials)</DocsH2>
      <DocsP>
        After checkout, your receipt email and{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/account"
        >
          account
        </Link>{" "}
        page include a registry access token. Configure it once:
      </DocsP>
      <DocsCode>{`# .env.local — never commit
FRAMELINE_REGISTRY_TOKEN=fl_live_…

# components.json — registry auth (shadcn-compatible)
{
  "registries": {
    "@frameline": {
      "url": "https://frameline.ai/r/{name}.json",
      "headers": {
        "Authorization": "Bearer \${FRAMELINE_REGISTRY_TOKEN}"
      }
    }
  }
}`}</DocsCode>
      <DocsCallout title="403 on install">
        A 403 almost always means a missing or revoked token, or a plan that
        does not include that SKU. Confirm entitlement on{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/account"
        >
          /account
        </Link>
        , regenerate the token if it was rotated, and retry. Full checklist:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/troubleshooting#install-403"
        >
          Troubleshooting → Install 403
        </Link>
        .
      </DocsCallout>

      <DocsH2 id="verify">Verify the install</DocsH2>
      <DocsUl>
        <li>Component file exists under your UI path and TypeScript resolves.</li>
        <li>
          Dev server renders without hydration warnings (see{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/docs/troubleshooting#hydration"
          >
            hydration
          </Link>
          ).
        </li>
        <li>
          Theme tokens flow through — colors should match your design system,
          not Frameline’s marketing palette.
        </li>
        <li>
          Toggle OS reduced-motion and confirm the static fallback, not a frozen
          animation.
        </li>
      </DocsUl>

      <DocsP>
        Next:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/theming"
        >
          bind tokens
        </Link>{" "}
        or jump to{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/examples"
        >
          recipes
        </Link>
        .
      </DocsP>
    </DocsShell>
  );
}
