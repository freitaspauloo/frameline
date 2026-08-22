import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { MaterialPreview } from "@/components/material-preview";
import {
  MarketingPageHeader,
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import { getResolvedCatalog } from "@/lib/demo-catalog";
import {
  MATERIAL_USE_CONTEXTS,
  isMaterialUseContext,
  type MaterialUseContext,
} from "@/materials";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return MATERIAL_USE_CONTEXTS.map((c) => ({ context: c.value }));
}

function contextMeta(context: MaterialUseContext) {
  return MATERIAL_USE_CONTEXTS.find((c) => c.value === context)!;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ context: string }>;
}): Promise<Metadata> {
  const { context } = await params;
  if (!isMaterialUseContext(context)) {
    return { title: "Use context" };
  }
  const meta = contextMeta(context);
  const title = `${meta.label} materials`;
  const description = `${meta.description} Browse Frameline materials tuned for ${meta.label.toLowerCase()} surfaces.`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} · Frameline`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Frameline`,
      description,
    },
  };
}

export default async function MaterialContextPage({
  params,
}: {
  params: Promise<{ context: string }>;
}) {
  const { context } = await params;
  if (!isMaterialUseContext(context)) notFound();

  const meta = contextMeta(context);
  const catalog = await getResolvedCatalog();
  const materials = catalog
    .filter((m) => m.useContexts.includes(context))
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <Button
              nativeButton={false}
              render={
                <Link href={`/materials?context=${context}`} />
              }
              size="sm"
              variant="outline"
            >
              Open in catalog
            </Button>
          }
          description={meta.description}
          eyebrow={`Use context · ${materials.length} materials`}
          title={meta.label}
        >
          <div className="flex flex-wrap gap-2 pt-2">
            {MATERIAL_USE_CONTEXTS.map((c) => (
              <Link
                key={c.value}
                className={cn(
                  "border border-border px-4 py-2 text-[0.625rem] font-semibold tracking-widest uppercase transition-colors",
                  c.value === context
                    ? "border-foreground bg-foreground text-background"
                    : "text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
                href={`/materials/contexts/${c.value}`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </MarketingPageHeader>

        {materials.length === 0 ? (
          <div className="border-b border-border px-6 py-16 text-center sm:px-8 lg:px-12">
            <p className="text-sm text-muted-foreground">
              No materials tagged for this context yet.
            </p>
            <Link
              className="mt-4 inline-block text-sm text-foreground underline underline-offset-4"
              href="/materials"
            >
              Browse all materials
            </Link>
          </div>
        ) : (
          <MarketingRuledGrid>
            {materials.map((entry) => (
              <MarketingRuledCell
                key={entry.slug}
                className="p-0 sm:p-0 lg:p-0"
              >
                <Link
                  className="group block transition-colors hover:bg-muted/40"
                  href={`/materials/${entry.slug}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
                    <MaterialPreview entry={entry} />
                  </div>
                  <div className="space-y-2.5 border-t border-border p-6 sm:p-8 lg:p-10">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-heading text-base font-medium tracking-tight">
                        {entry.title}
                      </h2>
                      <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                        {(entry.renderingTechnique ?? "webgl").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </Link>
              </MarketingRuledCell>
            ))}
          </MarketingRuledGrid>
        )}
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
