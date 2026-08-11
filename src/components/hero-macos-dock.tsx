"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { MacOSDock, type DockApp } from "@/components/ui/macos-dock";

const HERO_DOCK_APPS: DockApp[] = [
  {
    id: "finder",
    name: "Finder",
    icon: "https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024",
  },
  {
    id: "cursor",
    name: "Cursor",
    icon: "/dock/cursor.png",
  },
  {
    id: "notion",
    name: "Notion",
    icon: "/dock/notion.png",
  },
  {
    id: "frameline",
    name: "Frameline",
    icon: "/dock/frameline.png",
  },
  {
    id: "paper",
    name: "Paper",
    icon: "/dock/paper.png",
  },
  {
    id: "yc",
    name: "Y Combinator",
    icon: "/dock/ycombinator.png",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024",
  },
  {
    id: "safari",
    name: "Safari",
    icon: "https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024",
  },
];

const APP_HREF: Record<string, string> = {
  finder: "/materials",
  cursor: "https://cursor.com",
  notion: "https://www.notion.so",
  frameline: "/",
  paper: "https://paper.design",
  yc: "https://www.ycombinator.com",
  terminal: "/docs",
  safari: "#browse",
};

export function HeroMacOSDock({
  variant = "overlay",
}: {
  /** `overlay` = absolute bottom of parent; `inline` = flow (parent positions it). */
  variant?: "overlay" | "inline";
}) {
  const router = useRouter();
  const [openApps, setOpenApps] = React.useState<string[]>(["finder", "safari"]);

  React.useEffect(() => {
    for (const app of HERO_DOCK_APPS) {
      const img = new window.Image();
      img.src = app.icon;
    }
  }, []);

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

    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(href);
  };

  const dock = (
    <MacOSDock
      apps={HERO_DOCK_APPS}
      onAppClick={handleAppClick}
      openApps={openApps}
    />
  );

  if (variant === "inline") {
    return dock;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto">{dock}</div>
    </div>
  );
}
