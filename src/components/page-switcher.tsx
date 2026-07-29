"use client";

import { cn } from "@/lib/utils";

export type RelayPage = "system" | "chat";

const pages: { id: RelayPage; label: string }[] = [
  { id: "system", label: "Design system" },
  { id: "chat", label: "Chat empty state" },
];

type PageSwitcherProps = {
  active: RelayPage;
  onChange: (page: RelayPage) => void;
};

/** Floating widget to switch between Relay preview pages */
export function PageSwitcher({ active, onChange }: PageSwitcherProps) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      role="tablist"
      aria-label="Relay pages"
    >
      <div className="flex items-center gap-1 rounded-relay-pill border border-relay-border bg-relay-white p-1 shadow-relay-lg">
        {pages.map((page) => {
          const isActive = page.id === active;
          return (
            <button
              key={page.id}
              aria-selected={isActive}
              className={cn(
                "rounded-relay-pill px-4 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-relay-blue-tint text-relay-blue"
                  : "text-relay-secondary hover:text-relay-ink",
              )}
              onClick={() => onChange(page.id)}
              role="tab"
              type="button"
            >
              {page.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
