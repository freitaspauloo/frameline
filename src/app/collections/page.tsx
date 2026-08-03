import type { Metadata } from "next";

import { CollectionsIndexPage } from "@/components/collections-index-page";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Curated Frameline collections — materials grouped by job, not by trend.",
};

export default function CollectionsPage() {
  return <CollectionsIndexPage />;
}
