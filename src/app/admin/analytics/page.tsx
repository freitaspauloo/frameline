import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { readEvents } from "@/lib/events";
import {
  fetchesByAgent,
  funnelSummary,
  signupSummary,
  trafficSummary,
  usageBySlug,
} from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [signups, funnel, usage, agents, recent, traffic] = await Promise.all([
    signupSummary(),
    funnelSummary(),
    usageBySlug(),
    fetchesByAgent(),
    readEvents({ limit: 25 }),
    trafficSummary(),
  ]);

  return (
    <AnalyticsDashboard
      agents={agents}
      funnel={funnel}
      recent={recent}
      signups={signups}
      traffic={traffic}
      usage={usage}
    />
  );
}
