"use client";

import { motion, useReducedMotion } from "motion/react";

import { CONTINUITY_SPRING, SPRING_PRESS } from "@/lib/ease";
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
  const reduce = useReducedMotion();

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      role="tablist"
      aria-label="Relay pages"
    >
      <div className="relative flex items-center gap-1 rounded-relay-pill border border-relay-border bg-relay-white p-1 shadow-relay-lg">
        {pages.map((page) => {
          const isActive = page.id === active;
          return (
            <motion.button
              key={page.id}
              aria-selected={isActive}
              className={cn(
                "relative rounded-relay-pill px-4 py-2 text-[13px] font-medium",
                isActive
                  ? "text-relay-blue"
                  : "text-relay-secondary hover:text-relay-ink",
              )}
              onClick={() => onChange(page.id)}
              role="tab"
              type="button"
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={SPRING_PRESS}
            >
              {isActive ? (
                <motion.span
                  layoutId="relay-page-pill"
                  className="absolute inset-0 rounded-relay-pill bg-relay-blue-tint"
                  transition={CONTINUITY_SPRING}
                />
              ) : null}
              <span className="relative z-10">{page.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
