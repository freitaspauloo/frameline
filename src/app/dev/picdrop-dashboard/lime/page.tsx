import PicdropDashboard from "@/screens/picdrop-dashboard/picdrop-dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevPicdropDashboardLimeLivePage() {
  return <PicdropDashboard key="lime-live" theme="lime" />;
}
