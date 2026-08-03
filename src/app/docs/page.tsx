import type { Metadata } from "next";
import Link from "next/link";

import {
  DOCS_NAV,
  DocsP,
  DocsShell,
} from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Install, theming, accessibility, performance, examples, troubleshooting, and licensing for Frameline materials.",
};

export default function DocsHubPage() {
  return (
    <DocsShell
      currentPath="/docs"
      description="Install success surfaces. These guides cover install, tokens, accessibility, performance, recipes, troubleshooting, and licensing — written for engineers who ship."
      title="Documentation"
    >
      <DocsP>
        Start with{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/installation"
        >
          Installation
        </Link>{" "}
        if you already picked a material. Use{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/examples"
        >
          Examples
        </Link>{" "}
        when you need a paste-ready composition. Licensing answers are in{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/licensing"
        >
          Licensing
        </Link>
        .
      </DocsP>

      <ul className="mt-10 divide-y divide-border border-y border-border">
        {DOCS_NAV.filter((item) => item.href !== "/docs").map((item) => (
          <li key={item.href}>
            <Link
              className="group flex flex-col gap-1 py-5 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              href={item.href}
            >
              <span className="font-heading text-base font-medium tracking-tight text-foreground group-hover:text-muted-foreground">
                {item.label}
              </span>
              <span className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-right">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <DocsP>
        Prefer browsing first? Open the{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/materials"
        >
          materials catalog
        </Link>{" "}
        — each detail page includes live props, install commands, and a license
        summary for that SKU.
      </DocsP>
    </DocsShell>
  );
}
