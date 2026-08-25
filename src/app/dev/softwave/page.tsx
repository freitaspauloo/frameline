"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Softwave, SoftwaveSkeleton } from "@/screens/softwave";

function DevSoftwavePreview() {
  const searchParams = useSearchParams();
  const skeleton = searchParams.get("skeleton") === "1";

  if (skeleton) {
    return <SoftwaveSkeleton />;
  }

  return <Softwave />;
}

export default function DevSoftwavePage() {
  return (
    <Suspense fallback={<SoftwaveSkeleton />}>
      <DevSoftwavePreview />
    </Suspense>
  );
}
