import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MaterialDetailPage } from "@/components/material-detail-page";
import { ScreenDetailPage } from "@/components/screen-detail-page";
import { getResolvedMaterial } from "@/lib/demo-catalog";
import { getLicensePlan } from "@/lib/license-plans";
import {
  getV1LaunchCatalog,
  type MaterialCatalogEntry,
} from "@/materials";
import { getScreenBySlug, listScreens } from "@/screens/catalog";

export function generateStaticParams() {
  return [
    ...getV1LaunchCatalog().map((m) => ({ slug: m.slug })),
    ...listScreens().map((screen) => ({ slug: screen.slug })),
  ];
}

function materialMetaDescription(material: MaterialCatalogEntry) {
  return `${material.description} Installable ${material.type} material · Free on Frameline.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const screen = getScreenBySlug(slug);
  if (screen) {
    return {
      title: screen.title,
      description: screen.description,
    };
  }
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
  const screen = getScreenBySlug(slug);
  const initialParams = await searchParams;

  if (screen) {
    const first = (value: string | string[] | undefined) =>
      Array.isArray(value) ? value[0] : value;
    return (
      <ScreenDetailPage
        email={first(initialParams.email)}
        entry={screen}
        sessionId={first(initialParams.session_id)}
        unlocked={first(initialParams.unlocked) === "1"}
      />
    );
  }

  const material = await getResolvedMaterial(slug);
  if (!material) notFound();
  const plan = getLicensePlan("free");
  const price = "0";

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
