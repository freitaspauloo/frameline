"use client";

import { ScreenLivePreview } from "@/screens/preview";

export function LayoutRoutePage({ slug }: { slug: string }) {
  return (
    <div className="h-dvh w-full overflow-hidden bg-black">
      <ScreenLivePreview embed={false} slug={slug} />
    </div>
  );
}
