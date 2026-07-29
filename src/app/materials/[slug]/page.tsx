import { MaterialDetailPage } from "@/components/material-detail-page";
import { MATERIALS_CATALOG } from "@/materials";

export function generateStaticParams() {
  return MATERIALS_CATALOG.map((m) => ({ slug: m.slug }));
}

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MaterialDetailPage slug={slug} />;
}
