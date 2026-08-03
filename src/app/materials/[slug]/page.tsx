import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MaterialDetailPage } from "@/components/material-detail-page";
import { MATERIALS_CATALOG, getMaterial } from "@/materials";

export function generateStaticParams() {
  return MATERIALS_CATALOG.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterial(slug);
  if (!material) {
    return { title: "Material" };
  }
  return {
    title: material.title,
    description: material.description,
    openGraph: {
      title: `${material.title} · Frameline`,
      description: material.description,
    },
  };
}

export default async function MaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  if (!getMaterial(slug)) notFound();
  const initialParams = await searchParams;
  return <MaterialDetailPage initialParams={initialParams} slug={slug} />;
}
