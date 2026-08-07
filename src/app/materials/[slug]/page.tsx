import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MaterialDetailPage } from "@/components/material-detail-page";
import { getResolvedMaterial } from "@/lib/demo-catalog";
import { getLicensePlan } from "@/lib/license-plans";
import {
  getV1LaunchCatalog,
  type MaterialCatalogEntry,
} from "@/materials";

export function generateStaticParams() {
  return getV1LaunchCatalog().map((m) => ({ slug: m.slug }));
}

function materialMetaDescription(material: MaterialCatalogEntry) {
  const tierLabel =
    material.tier === "free"
      ? "Free"
      : material.tier === "team"
        ? "Team"
        : "Personal";
  return `${material.description} Installable ${material.type} material · ${tierLabel} on Frameline.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = await getResolvedMaterial(slug);
  if (!material) {
    return { title: "Material" };
  }
  const title = `${material.title} — ${material.type} material`;
  const description = materialMetaDescription(material);
  const ogImage = `/og/material?slug=${encodeURIComponent(material.slug)}`;
  return {
    title,
    description,
    openGraph: {
      title: `${material.title} · Frameline`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: material.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${material.title} · Frameline`,
      description,
      images: [ogImage],
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
  const material = await getResolvedMaterial(slug);
  if (!material) notFound();
  const initialParams = await searchParams;
  const plan = getLicensePlan(material.tier);
  const price =
    plan && plan.amountCents > 0
      ? (plan.amountCents / 100).toFixed(0)
      : "0";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: material.title,
    description: materialMetaDescription(material),
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    url: `https://frameline.ai/materials/${material.slug}`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: plan?.name ?? material.tier,
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <MaterialDetailPage
        entry={material}
        initialParams={initialParams}
        slug={slug}
      />
    </>
  );
}
