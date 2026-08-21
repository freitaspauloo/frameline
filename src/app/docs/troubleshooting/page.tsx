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

export default function TroubleshootingDocsPage() {
  return (
    <DocsShell
      currentPath="/docs/troubleshooting"
      description="Fix paths for the failures we see most: hydration mismatches, WebGL falling back unexpectedly, theme colors not applying, and registry 403s on install."
      title="Troubleshooting"
    >
      <DocsP>
        If your issue is not listed, check the material’s detail page specs and{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/account"
        >
          account entitlements
        </Link>
        . Support volume stays low when licensing and install are clear —
        include your material slug, framework, and a minimal repro.
      </DocsP>

      <DocsH2 id="hydration">Hydration mismatches</DocsH2>
      <DocsP>
        WebGL and browser-only APIs must not run during SSR in a way that
        diverges from the first client paint. Frameline materials wait for mount
        before attaching the live renderer and show the static fallback until
        then.
      </DocsP>
      <DocsUl>
        <li>
          Do not gate the whole page on{" "}
          <DocsInlineCode>typeof window</DocsInlineCode> without a matching
          server output — use a client shell with a static first paint.
        </li>
        <li>
          Avoid reading <DocsInlineCode>localStorage</DocsInlineCode> or media
          queries during render for colors; prefer CSS variables that resolve
          identically on server and client.
        </li>
        <li>
          If you see “Text content does not match” around a material, confirm
          you are not rendering random seeds or <DocsInlineCode>Date</DocsInlineCode>{" "}
          in the label tree.
        </li>
      </DocsUl>
      <DocsCode>{`// Good: static on server + first paint, live after mount
const mounted = useHasMounted()
return mounted ? <LiveShader /> : <StaticFallback />`}</DocsCode>

      <DocsH2 id="webgl">WebGL fails or never starts</DocsH2>
      <DocsUl>
        <li>
          Confirm the browser supports WebGL and that hardware acceleration is
          enabled. Corporate policies sometimes disable it.
        </li>
        <li>
          Check the console for context-lost events. Recover by remounting or
          staying on the static fallback.
        </li>
        <li>
          Multiple canvases competing for GPU memory will fail on mid-tier
          devices — keep one active material in view (
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/docs/performance"
          >
            performance guide
          </Link>
          ).
        </li>
        <li>
          Pass <DocsInlineCode>forceStatic</DocsInlineCode> in constrained
          environments rather than showing a broken canvas.
        </li>
      </DocsUl>

      <DocsH2 id="theme-colors">Theme colors look wrong</DocsH2>
      <DocsUl>
        <li>
          Verify props receive <DocsInlineCode>var(--token)</DocsInlineCode>, not
          resolved hex from a build-time theme helper that only runs on one
          side.
        </li>
        <li>
          Confirm the dark-mode class (or data attribute) is on an ancestor when
          you expect dark tokens.
        </li>
        <li>
          Override <DocsInlineCode>fallbackColors</DocsInlineCode> when you
          customize — otherwise reduced-motion and pre-mount states show the
          Frameline demo palette.
        </li>
        <li>
          Full pattern:{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/docs/theming"
          >
            Theming & tokens
          </Link>
          .
        </li>
      </DocsUl>

      <DocsH2 id="install-403">Install returns 403</DocsH2>
      <DocsP>
        Registry 403 means the request was understood but not authorized for
        that package.
      </DocsP>
      <DocsUl>
        <li>
          Free SKUs should not require a token. If a free install 403s, check
          you are hitting <DocsInlineCode>@frameline/…</DocsInlineCode> and not a
          mistyped paid slug.
        </li>
        <li>
          Paid SKUs need <DocsInlineCode>FRAMELINE_REGISTRY_TOKEN</DocsInlineCode>{" "}
          in the environment the CLI sees (shell env or{" "}
          <DocsInlineCode>.env.local</DocsInlineCode> loaded by your tooling).
        </li>
        <li>
          Confirm the token is still active; revoked refunds invalidate tokens.
        </li>
        <li>
          Regenerate the token from{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/account"
          >
            /account
          </Link>{" "}
          if it was rotated or leaked.
        </li>
      </DocsUl>
      <DocsCallout title="Still blocked?">
        Open your order receipt from email or{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/account"
        >
          account
        </Link>
        , verify the license version and material scope, then retry{" "}
        <DocsInlineCode>npx shadcn@latest add @frameline/…</DocsInlineCode> with
        verbose logging. Include the response body (redact the token) when
        contacting support.
      </DocsCallout>

      <DocsP>
        Install walkthrough:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/installation"
        >
          Installation
        </Link>
        . Rights questions:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/licensing"
        >
          Licensing
        </Link>
        .
      </DocsP>
    </DocsShell>
  );
}
