import { SupportHero } from "@/screens/support-hero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DevSupportHeroCyanPage() {
  return <SupportHero key="cyan-live" theme="cyan" />;
}
