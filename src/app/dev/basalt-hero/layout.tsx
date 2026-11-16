import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Basalt Hero — Dev Preview",
  description:
    "Frameline dev preview (not in catalog): dark developer-tool hero with a living Frameline-blue aurora and command-bar mockup.",
  robots: { index: false, follow: false },
};

export default function DevBasaltHeroLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <style>{`[data-frameline-quota], nextjs-portal { display: none !important; }`}</style>
      {children}
    </>
  );
}
