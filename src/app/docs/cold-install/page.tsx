import type { Metadata } from "next";
import Link from "next/link";

import {
  DocsCallout,
  DocsCode,
  DocsH2,
  DocsInlineCode,
  DocsP,
  DocsShell,
  DocsTable,
  DocsUl,
} from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Cold install",
  description:
    "Operator checklist — install a free Frameline material into a fresh Next.js + Tailwind app in under 60 seconds.",
};

export default function ColdInstallDocsPage() {
  return (
    <DocsShell
      currentPath="/docs/cold-install"
      description="Verify that a stranger can install a free material into a fresh Next.js + Tailwind app without Frameline-specific setup beyond the registry URL. Target: under 60 seconds wall-clock."
      title="Cold install checklist"
    >
      <DocsP>
        SKU under test:{" "}
        <DocsInlineCode>aurora-mesh</DocsInlineCode> (free tier). Swap the slug
        if you are verifying another free material. Full repo copy lives in{" "}
        <DocsInlineCode>docs/COLD-INSTALL.md</DocsInlineCode>.
      </DocsP>

      <DocsH2 id="prerequisites">Prerequisites (not on the clock)</DocsH2>
      <DocsUl>
        <li>Node 20+ and a package manager (pnpm / npm / yarn)</li>
        <li>
          Network access to the Frameline registry host under test (local{" "}
          <DocsInlineCode>http://localhost:3000</DocsInlineCode> or production)
        </li>
        <li>
          A browser (WebGL optional for CSS-only materials;{" "}
          <DocsInlineCode>aurora-mesh</DocsInlineCode> needs WebGL)
        </li>
      </DocsUl>

      <DocsH2 id="timed-steps">Timed steps</DocsH2>
      <DocsTable
        headers={["#", "Action", "Pass criteria"]}
        rows={[
          [
            "1",
            <>
              Scaffold a fresh app:{" "}
              <DocsInlineCode>
                pnpm create next-app@latest cold-install --ts --tailwind
                --eslint --app --src-dir --use-pnpm
              </DocsInlineCode>
              .{" "}
              <DocsInlineCode>cd cold-install && pnpm install</DocsInlineCode> if
              needed.
            </>,
            <>
              App boots with <DocsInlineCode>pnpm dev</DocsInlineCode>.
            </>,
          ],
          [
            "2",
            <>
              Init shadcn if missing:{" "}
              <DocsInlineCode>pnpm dlx shadcn@latest init -y</DocsInlineCode>{" "}
              (accept defaults that match the app).
            </>,
            <>
              <DocsInlineCode>components.json</DocsInlineCode> exists.
            </>,
          ],
          [
            "3",
            <>
              Point <DocsInlineCode>@frameline</DocsInlineCode> at the registry
              under test. For local: set{" "}
              <DocsInlineCode>
                registries[&quot;@frameline&quot;].url
              </DocsInlineCode>{" "}
              to{" "}
              <DocsInlineCode>
                http://localhost:3000/api/registry/{"{name}"}
              </DocsInlineCode>
              . No auth header for free SKUs.
            </>,
            <>
              Registry entry present; no{" "}
              <DocsInlineCode>FRAMELINE_REGISTRY_TOKEN</DocsInlineCode> required.
            </>,
          ],
          [
            "4",
            <>
              Install:{" "}
              <DocsInlineCode>
                pnpm dlx shadcn@latest add @frameline/aurora-mesh
              </DocsInlineCode>{" "}
              or the explicit local registry URL.
            </>,
            <>
              Component lands under the configured UI path (e.g.{" "}
              <DocsInlineCode>src/components/ui/aurora-mesh.tsx</DocsInlineCode>
              ).
            </>,
          ],
          [
            "5",
            <>
              Drop the component into{" "}
              <DocsInlineCode>src/app/page.tsx</DocsInlineCode> (full-bleed
              decorative layer + sibling content).
            </>,
            "Typecheck / save succeeds.",
          ],
          [
            "6",
            <>
              Load <DocsInlineCode>http://localhost:3000</DocsInlineCode> in the
              browser.
            </>,
            "Surface renders; no install 403; no missing-module error.",
          ],
        ]}
      />
      <DocsP>
        Stop the clock after step 6. Record elapsed time and registry host
        used.
      </DocsP>

      <DocsH2 id="local-install">Local install one-liner</DocsH2>
      <DocsCode>{`pnpm dlx shadcn@latest add "http://localhost:3000/api/registry/aurora-mesh"`}</DocsCode>

      <DocsH2 id="triage">Failure triage</DocsH2>
      <DocsUl>
        <li>
          <strong className="font-medium text-foreground">403</strong> — Paid
          slug or auth wrongly required for free. Use catalog{" "}
          <DocsInlineCode>tier: &quot;free&quot;</DocsInlineCode> only.
        </li>
        <li>
          <strong className="font-medium text-foreground">404</strong> — Wrong
          registry URL or slug typo.
        </li>
        <li>
          <strong className="font-medium text-foreground">Peer deps</strong> —
          Install packages the registry lists; re-run step 4 if the CLI
          prompted and you skipped.
        </li>
        <li>
          <strong className="font-medium text-foreground">Blank canvas</strong>{" "}
          — WebGL blocked or unexpected reduced-motion path; see{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/docs/troubleshooting"
          >
            Troubleshooting
          </Link>
          .
        </li>
      </DocsUl>

      <DocsCallout title="Sign-off">
        Record date, operator, registry host, elapsed seconds, pass/fail, and
        notes. Related:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/installation"
        >
          Installation
        </Link>
        ,{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/free"
        >
          /free
        </Link>{" "}
        funnel, and <DocsInlineCode>docs/DISCOVERY.md</DocsInlineCode> Gate 01.
      </DocsCallout>
    </DocsShell>
  );
}
