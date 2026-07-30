"use client";

import {
  AuroraMesh,
  GrainField,
  InkDither,
  type MaterialCatalogEntry,
} from "@/materials";

export function MaterialPreview({
  entry,
  forceStatic = true,
}: {
  entry: MaterialCatalogEntry;
  forceStatic?: boolean;
}) {
  const common = "absolute inset-0 h-full w-full";

  switch (entry.slug) {
    case "aurora-mesh":
      return <AuroraMesh className={common} forceStatic={forceStatic} />;
    case "ink-dither":
      return <InkDither className={common} forceStatic={forceStatic} />;
    case "grain-field":
      return <GrainField className={common} forceStatic={forceStatic} />;
    default:
      return (
        <div
          className={common}
          style={{
            backgroundImage: `linear-gradient(135deg, ${entry.fallbackColors.join(", ")})`,
          }}
        />
      );
  }
}
