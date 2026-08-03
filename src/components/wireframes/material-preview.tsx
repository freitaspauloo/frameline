"use client";

import { getMaterial } from "@/materials";
import { renderMaterial } from "@/materials/renderers";
import { cn } from "@/lib/utils";

export function WireframeMaterialPreview({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const entry = getMaterial(slug);
  const common = cn("absolute inset-0 h-full w-full", className);
  const node = renderMaterial(slug, {
    className: common,
    props: {},
  });

  if (node) return node;

  return (
    <div
      className={common}
      style={{
        backgroundImage: `linear-gradient(135deg, ${(entry?.fallbackColors ?? ["#E6E8EC", "#0B0D12"]).join(", ")})`,
      }}
    />
  );
}
