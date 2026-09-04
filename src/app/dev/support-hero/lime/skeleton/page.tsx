import { SupportHeroSkeleton } from "@/screens/support-hero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevSupportHeroLimeSkeletonPage() {
  return <SupportHeroSkeleton key="lime-skeleton" theme="lime" />;
}
