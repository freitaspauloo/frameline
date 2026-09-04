import PicdropDashboardSkeleton from "@/screens/picdrop-dashboard/picdrop-dashboard-skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevPicdropDashboardLimeSkeletonPage() {
  return <PicdropDashboardSkeleton key="lime-skeleton" theme="lime" />;
}
