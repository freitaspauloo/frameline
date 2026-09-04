import PicdropDashboardSkeleton from "@/screens/picdrop-dashboard/picdrop-dashboard-skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevPicdropDashboardCyanSkeletonPage() {
  return <PicdropDashboardSkeleton key="cyan-skeleton" theme="cyan" />;
}
