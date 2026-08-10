"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { MacOSDock, type DockApp } from "@/components/ui/macos-dock";

const HERO_DOCK_APPS: DockApp[] = [
  {
    id: "materials",
    name: "Materials",
    icon: "https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024",
  },
  {
    id: "collections",
    name: "Collections",
    icon: "https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024",
  },
  {
    id: "free",
    name: "Free",
    icon: "https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024",
  },
  {
    id: "pricing",
    name: "Pricing",
    icon: "https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024",
  },
  {
    id: "docs",
    name: "Docs",
    icon: "https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024",
  },
  {
    id: "browse",
    name: "Browse",
    icon: "https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024",
  },
];

const APP_HREF: Record<string, string> = {
  materials: "/materials",
  collections: "/collections",
  free: "/free",
  pricing: "/pricing",
  docs: "/docs",
  browse: "#browse",
};

export function HeroMacOSDock() {
  const router = useRouter();
  const [openApps, setOpenApps] = React.useState<string[]>([
    "materials",
    "browse",
  ]);

  const handleAppClick = (appId: string) => {
    setOpenApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId],
    );

    const href = APP_HREF[appId];
    if (!href) return;
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    router.push(href);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto">
        <MacOSDock
          apps={HERO_DOCK_APPS}
          onAppClick={handleAppClick}
          openApps={openApps}
        />
      </div>
    </div>
  );
}
