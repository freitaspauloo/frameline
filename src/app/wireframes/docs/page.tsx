import Link from "next/link";

import {
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

const GUIDES = [
  { href: "/wireframes/docs/installation", label: "Installation", route: "/docs/installation" },
  { href: "/wireframes/docs/theming", label: "Theming & tokens", route: "/docs/theming" },
  { href: "/wireframes/docs/accessibility", label: "Accessibility", route: "/docs/accessibility" },
  { href: "/wireframes/docs/performance", label: "Performance", route: "/docs/performance" },
  { href: "/wireframes/docs/examples", label: "Examples", route: "/docs/examples" },
  { href: "/wireframes/docs/troubleshooting", label: "Troubleshooting", route: "/docs/troubleshooting" },
] as const;

export default function WireframeDocsHubPage() {
  return (
    <WireframeShell
      flow="Docs"
      nextHref="/wireframes/docs/installation"
      nextLabel="Installation"
      route="/wireframes/docs"
      title="Docs hub"
    >
      <div className="mb-8 max-w-xl space-y-2">
        <WfTitle>Docs</WfTitle>
        <WfMuted>Install success surfaces — guides that keep materials shipping.</WfMuted>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <li key={guide.href}>
            <Link
              className="block rounded-relay-lg border border-relay-border bg-relay-white px-4 py-4 transition-colors hover:border-relay-blue/40"
              href={guide.href}
            >
              <p className="text-sm font-medium text-relay-ink">{guide.label}</p>
              <p className="mt-1 font-mono text-[11px] text-relay-tertiary">
                {guide.route}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </WireframeShell>
  );
}
