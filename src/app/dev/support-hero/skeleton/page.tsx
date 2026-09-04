import { SupportHeroSkeleton } from "@/screens/support-hero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevSupportHeroSkeletonPage() {
  return <SupportHeroSkeleton key="pink-skeleton" theme="pink" />;
}
