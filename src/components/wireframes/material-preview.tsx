"use client";

import {
  AuroraMesh,
  GrainField,
  InkDither,
  getMaterial,
} from "@/materials";
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

  switch (slug) {
    case "aurora-mesh":
      return <AuroraMesh className={common} />;
    case "ink-dither":
      return <InkDither className={common} />;
    case "grain-field":
      return <GrainField className={common} />;
    default:
      return (
        <div
          className={common}
          style={{
            backgroundImage: `linear-gradient(135deg, ${(entry?.fallbackColors ?? ["#E6E8EC", "#0B0D12"]).join(", ")})`,
          }}
        />
      );
  }
}
