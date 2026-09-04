import { SupportHero } from "@/screens/support-hero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SupportHeroPage() {
  return <SupportHero key="pink-live" theme="pink" />;
}
