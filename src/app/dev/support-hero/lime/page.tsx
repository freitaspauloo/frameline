import { SupportHero } from "@/screens/support-hero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevSupportHeroLimePage() {
  return <SupportHero key="lime-live" theme="lime" />;
}
