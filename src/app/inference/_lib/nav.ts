export const INFERENCE_NAV = [
  { href: "/inference/workspace", label: "Workspace" },
  { href: "/inference/conversation", label: "Conversation" },
  { href: "/inference/composers", label: "Composers" },
  { href: "/inference/agents", label: "Agents & tools" },
  { href: "/inference/sources", label: "Sources" },
  { href: "/inference/code", label: "Code & signals" },
  { href: "/inference/primitives", label: "Primitives" },
] as const;

export type InferenceNavHref = (typeof INFERENCE_NAV)[number]["href"];
