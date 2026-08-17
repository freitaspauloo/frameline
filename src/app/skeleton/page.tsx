import type { Metadata } from "next";

import { FramelineHomeSkeleton } from "@/components/frameline-home-skeleton";

export const metadata: Metadata = {
  title: "Skeleton",
  description: "Homepage loading skeleton for Frameline.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SkeletonPage() {
  return <FramelineHomeSkeleton />;
}
