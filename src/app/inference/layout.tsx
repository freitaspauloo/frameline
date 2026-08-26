import type { Metadata } from "next";
import type { ReactNode } from "react";

import "streamdown/styles.css";

import { InferenceDarkScope } from "./_components/dark-scope";

export const metadata: Metadata = {
  description:
    "Internal scratch space for AI interface blocks. Static mock state, no model calls.",
  robots: { follow: false, index: false },
  title: "Inference · AI UI kit",
};

export default function InferenceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <InferenceDarkScope />
      {children}
    </div>
  );
}
