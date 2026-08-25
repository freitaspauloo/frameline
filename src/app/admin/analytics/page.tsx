import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { buildAssetMetaMap } from "@/lib/asset-catalog";
import { readEvents } from "@/lib/events";
import {
  analyticsSince,
  fetchesByAgent,
  funnelSummary,
  signupSummary,
  trafficSummary,
  usageBySlug,
} from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const since = analyticsSince();

  const [signups, funnel, usage, agents, recent, traffic] = await Promise.all([
    signupSummary(),
    funnelSummary(since),
    usageBySlug(since),
    fetchesByAgent(since),
    readEvents({ limit: 25, since }),
    trafficSummary(since),
  ]);

  const assetMeta = buildAssetMetaMap(usage.map((row) => row.slug));

  return (
    <AnalyticsDashboard
      agents={agents}
      assetMeta={assetMeta}
      funnel={funnel}
      recent={recent}
      signups={signups}
      traffic={traffic}
      usage={usage}
    />
  );
}
