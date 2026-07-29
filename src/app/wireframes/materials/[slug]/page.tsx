import Link from "next/link";

import { WireframeMaterialPreview } from "@/components/wireframes/material-preview";
import {
  WfBadge,
  WfBtn,
  WfLabel,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";
import { getMaterial } from "@/materials";

export default async function WireframeMaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tier?: string; entitled?: string }>;
}) {
  const { slug } = await params;
  const { tier, entitled } = await searchParams;
  const material = getMaterial(slug);
  const isPaid = tier === "paid" || material?.tier !== "free";
  const isFree = !isPaid;
  const isEntitled = entitled === "1";

  const title =
    material?.title ??
    slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");

  const nextHref =
    isPaid && !isEntitled
      ? "/wireframes/pricing"
      : "/wireframes/docs/installation";
  const nextLabel = isPaid && !isEntitled ? "Pricing" : "Install";

  return (
    <WireframeShell
      flow={isEntitled ? "Account" : isPaid ? "Paid" : "Free"}
      nextHref={nextHref}
      nextLabel={nextLabel}
      route={`/wireframes/materials/${slug}`}
      title="Material"
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          className="font-mono text-[12px] text-relay-secondary hover:text-relay-ink"
          href="/wireframes/materials"
        >
          ← Catalog
        </Link>
        <WfBadge tone={isFree || isEntitled ? "free" : "paid"}>
          {isEntitled ? "Entitled" : isFree ? "Free" : "Paid · locked"}
        </WfBadge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative min-h-80 overflow-hidden rounded-relay-lg border border-relay-border bg-relay-ink">
          <WireframeMaterialPreview slug={slug} />
        </div>

        <div className="space-y-5 rounded-relay-lg border border-relay-border bg-relay-white p-6">
          <div className="space-y-2">
            <WfLabel>Material</WfLabel>
            <WfTitle className="text-2xl sm:text-3xl">{title}</WfTitle>
            <WfMuted>
              {material?.description ??
                "Live preview + props. CTA reflects free vs paid."}
            </WfMuted>
          </div>

          <div className="space-y-3 border-t border-relay-border pt-4">
            <WfLabel>Configurator</WfLabel>
            <label className="block space-y-1.5">
              <span className="text-xs text-relay-secondary">Intensity</span>
              <input
                className="h-2 w-full accent-relay-blue"
                defaultValue={60}
                type="range"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-relay-secondary">Speed</span>
              <input
                className="h-2 w-full accent-relay-blue"
                defaultValue={40}
                type="range"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-relay-secondary">Grain</span>
              <input
                className="h-2 w-full accent-relay-blue"
                defaultValue={25}
                type="range"
              />
            </label>
          </div>

          <div className="space-y-2 border-t border-relay-border pt-4">
            {isPaid && !isEntitled ? (
              <>
                <WfBtn className="w-full" href="/wireframes/pricing">
                  Buy license
                </WfBtn>
                <WfMuted>Install locked until purchase.</WfMuted>
              </>
            ) : (
              <>
                <WfBtn className="w-full" href="/wireframes/docs/installation">
                  Install material
                </WfBtn>
                <WfMuted>
                  {isEntitled
                    ? "Licensed — reinstall anytime from Account."
                    : "Free — no account required."}
                </WfMuted>
              </>
            )}
          </div>
        </div>
      </div>
    </WireframeShell>
  );
}
