import type { Metadata } from "next";
import type { ReactNode } from "react";

import "streamdown/styles.css";

import { InferenceShell } from "./_components/inference-shell";
import { InferenceThemeProvider } from "./_components/theme/theme-provider";
import { InferenceThemeScope } from "./_components/theme/theme-scope";

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
    <div
      className="min-h-svh bg-background text-foreground"
      data-inference-theme
    >
      <InferenceThemeProvider>
        <InferenceThemeScope />
        <InferenceShell>{children}</InferenceShell>
      </InferenceThemeProvider>
    </div>
  );
}
