"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { SupportHero, SupportHeroSkeleton } from "@/screens/support-hero";

function DevSupportHeroPreview() {
  const searchParams = useSearchParams();
  const skeleton = searchParams.get("skeleton") === "1";

  if (skeleton) {
    return <SupportHeroSkeleton />;
  }

  return <SupportHero />;
}

export default function SupportHeroPage() {
  return (
    <Suspense fallback={<SupportHeroSkeleton />}>
      <DevSupportHeroPreview />
    </Suspense>
  );
}
