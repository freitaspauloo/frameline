import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { RelayIconName } from "@/lib/relay-tokens";

type IconProps = {
  className?: string;
};

function IconBase({
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M10 5V15M5 10H15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M8 6L12 10L8 14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconSparkle({ className }: IconProps) {
  return (
    <svg aria-hidden className={cn("size-5 shrink-0", className)} viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5L11.2 7.8L16.5 9L11.2 10.2L10 15.5L8.8 10.2L3.5 9L8.8 7.8L10 2.5Z" fill="currentColor" />
    </svg>
  );
}

export function IconBolt({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M11 3L6 11H10L9 17L14 9H10L11 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconBranch({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M6 4V16M6 10H14M14 6V14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M5 10L8.5 13.5L15 7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="9" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 13L16 16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconAgents({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="6" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 10H11.5" stroke="currentColor" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconTemplates({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 8H16M8 4V16" stroke="currentColor" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconRuns({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M6 5V15M6 10H12C14 10 15 9 15 7.5C15 6 14 5 12 5H6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconIntegrations({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 6H11V14" stroke="currentColor" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconLogs({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M5 6H15M5 10H15M5 14H11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconSettings({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 3V4.5M10 15.5V17M3 10H4.5M15.5 10H17M5.2 5.2L6.3 6.3M13.7 13.7L14.8 14.8M5.2 14.8L6.3 13.7M13.7 6.3L14.8 5.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconMore({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="5" cy="10" r="1" fill="currentColor" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </IconBase>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M10 4C7.5 4 6 6 6 8V12L4 14H16L14 12V8C14 6 12.5 4 10 4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="M8.5 14.5C8.7 15.3 9.3 16 10 16C10.7 16 11.3 15.3 11.5 14.5" stroke="currentColor" strokeWidth="1.6" />
    </IconBase>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </IconBase>
  );
}

const iconMap = {
  agents: IconAgents,
  templates: IconTemplates,
  runs: IconRuns,
  integrations: IconIntegrations,
  logs: IconLogs,
  settings: IconSettings,
  search: IconSearch,
  plus: IconPlus,
  sparkle: IconSparkle,
  bolt: IconBolt,
  branch: IconBranch,
  chevron: IconChevron,
  check: IconCheck,
  more: IconMore,
  bell: IconBell,
  close: IconClose,
} satisfies Record<RelayIconName, ComponentType<IconProps>>;

export function RelayIcon({ name, className }: { name: RelayIconName; className?: string }) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}
