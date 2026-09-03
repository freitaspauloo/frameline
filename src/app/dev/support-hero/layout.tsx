import { SupportHeroPreviewNav } from "@/screens/support-hero/preview-nav";

export default function DevSupportHeroLayout({ children }: LayoutProps<"/dev/support-hero">) {
  return (
    <>
      {children}
      <SupportHeroPreviewNav />
    </>
  );
}
