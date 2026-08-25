"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { DarkPillHero, DarkPillHeroSkeleton } from "@/screens/dark-pill-hero";

function DevDarkPillHeroPreview() {
  const searchParams = useSearchParams();
  const skeleton = searchParams.get("skeleton") === "1";

  if (skeleton) {
    return <DarkPillHeroSkeleton />;
  }

  return <DarkPillHero />;
}

export default function DevDarkPillHeroPage() {
  return (
    <Suspense fallback={<DarkPillHeroSkeleton />}>
      <DevDarkPillHeroPreview />
    </Suspense>
  );
}
