import { CollectionDetailPage } from "@/components/collection-detail-page";
import { MATERIALS_COLLECTIONS } from "@/materials";

export function generateStaticParams() {
  return MATERIALS_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CollectionDetailPage slug={slug} />;
}
