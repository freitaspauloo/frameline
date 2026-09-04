import { SupportHeroSkeleton } from "@/screens/support-hero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevSupportHeroCyanSkeletonPage() {
  return <SupportHeroSkeleton key="cyan-skeleton" theme="cyan" />;
}
