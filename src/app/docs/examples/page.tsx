import Link from "next/link";

import {
  DocsCode,
  DocsH2,
  DocsInlineCode,
  DocsP,
  DocsShell,
  DocsUl,
} from "@/components/docs-shell";
import { MATERIALS_CATALOG, MATERIAL_USE_CONTEXTS } from "@/materials";

export default function ExamplesDocsPage() {
  const contextCounts = MATERIAL_USE_CONTEXTS.map((c) => ({
    ...c,
    count: MATERIALS_CATALOG.filter((m) => m.useContexts.includes(c.value))
      .length,
  }));

  return (
    <DocsShell
      currentPath="/docs/examples"
      description="Paste-ready compositions for the four surfaces teams ship most: hero, card, auth shell, and empty state. Swap the material; keep the structure."
      title="Examples"
    >
      <DocsP>
        These recipes assume install via{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/installation"
        >
          Installation
        </Link>{" "}
        and colors wired per{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/theming"
        >
          Theming
        </Link>
        . Free starter:{" "}
        <DocsInlineCode>aurora-mesh</DocsInlineCode>. Quiet panels:{" "}
        <DocsInlineCode>grain-field</DocsInlineCode>. High-contrast moments:{" "}
        <DocsInlineCode>ink-dither</DocsInlineCode>.
      </DocsP>

      <DocsH2 id="context-coverage">Context coverage</DocsH2>
      <DocsP>
        Catalog materials tagged for each use context (a material can count in
        more than one). Filter live on{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/materials"
        >
          Materials
        </Link>
        .
      </DocsP>
      <div className="mb-8 flex flex-wrap gap-2">
        {contextCounts.map((c) => (
          <Link
            key={c.value}
            className="border border-border px-3 py-1.5 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:border-foreground hover:text-foreground"
            href={`/materials?context=${c.value}`}
          >
            {c.label} · {c.count}
          </Link>
        ))}
      </div>

      <DocsH2 id="hero">Hero</DocsH2>
      <DocsP>
        Full-bleed mesh behind a single brand line and one CTA group. Surface is
        absolute; content is relative with a scrim for contrast.
      </DocsP>
      <DocsCode>{`import { AuroraMesh } from "@/components/ui/aurora-mesh"
import Link from "next/link"

export function MarketingHero() {
  return (
    <section className="relative isolate min-h-[min(100dvh,52rem)] overflow-hidden">
      <AuroraMesh
        aria-hidden
        className="absolute inset-0 -z-10"
        colors={[
          "var(--brand-surface)",
          "var(--brand-accent)",
          "var(--brand-highlight)",
          "var(--brand-ink)",
        ]}
      />
      <div className="absolute inset-0 -z-10 bg-background/20" aria-hidden />
      <div className="mx-auto flex min-h-[inherit] max-w-5xl flex-col justify-end px-6 pb-16 pt-28">
        <p className="text-[0.625rem] font-semibold tracking-widest uppercase text-muted-foreground">
          Frameline
        </p>
        <h1 className="mt-4 max-w-2xl font-heading text-5xl tracking-tight">
          Surface as code
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Production materials you install, theme, and ship.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/materials" className="bg-foreground px-5 py-2.5 text-sm text-background">
            Browse materials
          </Link>
          <Link href="/docs" className="border border-border px-5 py-2.5 text-sm">
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  )
}`}</DocsCode>

      <DocsH2 id="card">Card panel</DocsH2>
      <DocsP>
        Quiet grain under a content panel — interaction lives in the card, not
        in the material.
      </DocsP>
      <DocsCode>{`import { GrainField } from "@/components/ui/grain-field"

export function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="relative overflow-hidden border border-border">
      <GrainField
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        forceStatic={false}
      />
      <div className="relative space-y-3 bg-background/75 p-6 backdrop-blur-sm">
        <h3 className="font-heading text-base font-medium">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </article>
  )
}`}</DocsCode>

      <DocsH2 id="auth">Auth shell</DocsH2>
      <DocsP>
        Split layout: material column + form column. Keep inputs off the canvas
        and pause the field when reduced motion is on (built into the shell).
      </DocsP>
      <DocsCode>{`import { GrainField } from "@/components/ui/grain-field"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden min-h-[40vh] lg:block">
        <GrainField aria-hidden className="absolute inset-0" />
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-6">{children}</div>
      </div>
    </div>
  )
}`}</DocsCode>

      <DocsH2 id="empty">Empty state</DocsH2>
      <DocsP>
        High-contrast dither behind a short message — decorative only, with a
        clear next action.
      </DocsP>
      <DocsCode>{`import { InkDither } from "@/components/ui/ink-dither"

export function EmptyProjects({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="relative overflow-hidden border border-dashed border-border px-6 py-20 text-center">
      <InkDither
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
      />
      <div className="relative mx-auto max-w-sm space-y-4 bg-background/80 px-6 py-8">
        <h2 className="font-heading text-lg font-medium">No projects yet</h2>
        <p className="text-sm text-muted-foreground">
          Create a project to attach materials and share previews with your team.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="bg-foreground px-4 py-2 text-sm text-background"
        >
          New project
        </button>
      </div>
    </div>
  )
}`}</DocsCode>

      <DocsUl>
        <li>
          Browse live materials in the{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials"
          >
            catalog
          </Link>{" "}
          and copy JSX from each configurator for props that match what you
          tuned.
        </li>
        <li>
          For licensing of client deliverables that include these compositions,
          see{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/docs/licensing"
          >
            Licensing
          </Link>
          .
        </li>
      </DocsUl>
    </DocsShell>
  );
}
