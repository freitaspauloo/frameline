import type { Metadata } from "next";

import { MaterialsCatalogPage } from "@/components/materials-catalog-page";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "Browse production-ready Frameline materials — mesh, dither, and grain surfaces you can install.",
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
  return (
    <MaterialsCatalogPage
      contextFilter={context}
      qFilter={q}
      sortFilter={sort}
      tierFilter={tier}
      typeFilter={type}
    />
  );
}
