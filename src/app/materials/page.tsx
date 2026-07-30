import { MaterialsCatalogPage } from "@/components/materials-catalog-page";

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return <MaterialsCatalogPage typeFilter={type} />;
}
