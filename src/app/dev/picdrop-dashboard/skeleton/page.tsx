import PicdropDashboardSkeleton from "@/screens/picdrop-dashboard/picdrop-dashboard-skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevPicdropDashboardSkeletonPage() {
  return <PicdropDashboardSkeleton key="pink-skeleton" theme="pink" />;
}
