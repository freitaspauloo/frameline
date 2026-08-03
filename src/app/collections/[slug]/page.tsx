import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionDetailPage } from "@/components/collection-detail-page";
import { MATERIALS_COLLECTIONS, getCollection } from "@/materials";

export function generateStaticParams() {
  return MATERIALS_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) {
    return { title: "Collection" };
  }
  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: `${collection.title} · Frameline`,
      description: collection.description,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getCollection(slug)) notFound();
  return <CollectionDetailPage slug={slug} />;
}
