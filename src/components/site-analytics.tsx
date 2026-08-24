"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function sendBeacon(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics/beacon",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  void fetch("/api/analytics/beacon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

function clickLabel(target: HTMLElement): string | undefined {
  const text = target.textContent?.trim().replace(/\s+/g, " ");
  if (text && text.length <= 128) return text;
  const aria = target.getAttribute("aria-label")?.trim();
  if (aria) return aria.slice(0, 128);
  return undefined;
}

/**
 * First-party visit and click analytics. Skips /admin routes.
 */
export function SiteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const path = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    if (lastPath.current === path) return;
    lastPath.current = path;
    sendBeacon({ name: "page_view", path });
  }, [pathname, searchParams]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const path = window.location.pathname;
      if (path.startsWith("/admin")) return;

      const link = target.closest("a");
      if (link instanceof HTMLAnchorElement && link.href) {
        sendBeacon({
          name: "click",
          path,
          element: "a",
          label: clickLabel(link),
          href: link.getAttribute("href") ?? link.href,
        });
        return;
      }

      const button = target.closest("button");
      if (button instanceof HTMLButtonElement) {
        sendBeacon({
          name: "click",
          path,
          element: "button",
          label: clickLabel(button),
        });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

/** Records one material/screen detail view on mount. */
export function MaterialViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug || window.location.pathname.startsWith("/admin")) return;
    sendBeacon({
      name: "material_view",
      slug,
      path: window.location.pathname,
    });
  }, [slug]);

  return null;
}
