/**
 * Relay design tokens — synced from Figma Brand + System pages.
 * CSS variables in globals.css mirror these values.
 */

export const relayColors = {
  brand: {
    blue: { value: "#2D6BFF", css: "--relay-blue", label: "Blue" },
    blueDeep: { value: "#1B4DD1", css: "--relay-blue-deep", label: "Blue deep" },
    blueTint: { value: "#EAF1FF", css: "--relay-blue-tint", label: "Blue tint" },
  },
  text: {
    ink: { value: "#0B0D12", css: "--relay-ink", label: "Ink" },
    secondary: { value: "#6B7280", css: "--relay-secondary", label: "Secondary" },
    tertiary: { value: "#9AA1AC", css: "--relay-tertiary", label: "Tertiary" },
  },
  surface: {
    white: { value: "#FFFFFF", css: "--relay-white", label: "White" },
    canvas: { value: "#FCFCFD", css: "--relay-canvas", label: "Canvas" },
    panel: { value: "#F7F8FA", css: "--relay-panel", label: "Panel" },
  },
  fill: {
    muted: { value: "#F3F4F6", css: "--relay-muted", label: "Muted" },
  },
  border: {
    default: { value: "#E6E8EC", css: "--relay-border", label: "Border" },
  },
} as const;

export const relayRadii = {
  sm: { value: "8px", css: "--relay-radius-sm", label: "sm" },
  md: { value: "10px", css: "--relay-radius-md", label: "md" },
  lg: { value: "14px", css: "--relay-radius-lg", label: "lg" },
  pill: { value: "26px", css: "--relay-radius-pill", label: "pill" },
} as const;

export const relaySpacing = {
  4: { value: "4px", label: "4" },
  8: { value: "8px", label: "8" },
  12: { value: "12px", label: "12" },
  16: { value: "16px", label: "16" },
  20: { value: "20px", label: "20" },
  24: { value: "24px", label: "24" },
  32: { value: "32px", label: "32" },
  40: { value: "40px", label: "40" },
  80: { value: "80px", label: "80" },
} as const;

export const relayTypography = {
  display64: {
    size: "64px",
    weight: 600,
    tracking: "-0.02em",
    sample: "Relay",
    label: "Display / 64 Semi Bold",
  },
  display40: {
    size: "40px",
    weight: 600,
    tracking: "-0.005em",
    sample: "Describe it. See it. Run it.",
    label: "Display / 40 Semi Bold",
  },
  heading28: {
    size: "28px",
    weight: 600,
    tracking: "-0.01em",
    sample: "Build agents by describing them",
    label: "Heading / 28 Semi Bold",
  },
  subhead20: {
    size: "20px",
    weight: 500,
    tracking: "0",
    sample: "Language in, a legible system out",
    label: "Subhead / 20 Medium",
  },
  body14: {
    size: "14px",
    weight: 400,
    tracking: "0",
    sample: "Relay turns a plain-language description into a working agent.",
    label: "Body / 14 Regular",
  },
  small13: {
    size: "13px",
    weight: 400,
    tracking: "0",
    sample: "Docs · Enterprise · Pricing",
    label: "Small / 13 Regular",
  },
  small12: {
    size: "12px",
    weight: 400,
    tracking: "0",
    sample: "Used for secondary labels and metadata.",
    label: "Small / 12 Regular",
  },
} as const;

export const relayElevation = {
  sm: {
    value: "0 2px 8px rgba(15, 23, 41, 0.07)",
    css: "--relay-elevation-sm",
    label: "elevation/sm",
  },
  lg: {
    value: "0 10px 30px rgba(15, 23, 41, 0.13)",
    css: "--relay-elevation-lg",
    label: "elevation/lg",
  },
} as const;

export const relayVoice = [
  { title: "Plain over clever", body: "Say the thing. No jargon, no filler." },
  { title: "Calm and precise", body: "Confident, never loud. No hype or exclamation soup." },
  { title: "Show the mechanism", body: "Trust comes from seeing how it works, not being told to." },
  { title: "Outcomes, not nodes", body: "Talk about what the user gets, not the plumbing underneath." },
] as const;

export const relayIconCatalog = [
  "agents",
  "templates",
  "runs",
  "integrations",
  "logs",
  "settings",
  "search",
  "plus",
  "sparkle",
  "bolt",
  "branch",
  "chevron",
  "check",
  "more",
  "bell",
  "close",
] as const;

export type RelayIconName = (typeof relayIconCatalog)[number];

export const relayComponentCatalog = [
  { name: "Button", variants: ["Primary", "Secondary", "Ghost"], figma: "38:2" },
  { name: "Input", variants: ["Text", "Select"], figma: "38:3" },
  { name: "Chip", variants: ["Default"], figma: "22:15" },
  { name: "StatusPill", variants: ["Running"], figma: "22:17" },
  { name: "CommandBar", variants: ["Default"], figma: "22:21" },
  { name: "PromptInput", variants: ["Empty state"], figma: "111:285" },
  { name: "Node", variants: ["Trigger", "AI", "Condition", "Action"], figma: "38:4" },
  { name: "NavItem", variants: ["Active", "Default"], figma: "51:27" },
  { name: "IconButton", variants: ["Default", "Muted", "Send"], figma: "51:28" },
  { name: "Avatar", variants: ["Initial"], figma: "51:32" },
  { name: "Logo/01", variants: ["Primary"], figma: "36:2" },
  { name: "Logo/02", variants: ["Inverse"], figma: "36:3" },
  { name: "Logo/Mark", variants: ["Default"], figma: "47:15" },
  { name: "Logo/Lockup-horizontal", variants: ["Default"], figma: "47:18" },
  { name: "Logo/Lockup-stacked", variants: ["Default"], figma: "47:22" },
] as const;
