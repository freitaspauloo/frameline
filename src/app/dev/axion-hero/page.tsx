"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { ReticleAsciiHero, ReticleAsciiHeroSkeleton } from "@/screens/ascii-hero";

function DevAsciiHeroPreview() {
  const searchParams = useSearchParams();
  const skeleton = searchParams.get("skeleton") === "1";

  if (skeleton) {
    return <ReticleAsciiHeroSkeleton />;
  }

  return <ReticleAsciiHero />;
}

export default function DevAsciiHeroPage() {
  return (
    <Suspense fallback={<ReticleAsciiHeroSkeleton />}>
      <DevAsciiHeroPreview />
    </Suspense>
  );
}
