import type { Metadata } from "next";

import { MaterialsCatalogPage } from "@/components/materials-catalog-page";
import { getResolvedCatalog, getResolvedScreens } from "@/lib/demo-catalog";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "Browse Frameline screens and materials — cinematic templates plus mesh, dither, and grain surfaces you can install.",
};

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    q?: string;
    context?: string;
    tier?: string;
    sort?: string;
  }>;
}) {
  const { type, q, context, tier, sort } = await searchParams;
  const [catalog, screens] = await Promise.all([
    getResolvedCatalog(),
    getResolvedScreens(),
  ]);
  return (
    <MaterialsCatalogPage
      catalog={catalog}
      screens={screens}
      contextFilter={context}
      qFilter={q}
      sortFilter={sort}
      tierFilter={tier}
      typeFilter={type}
    />
  );
}
