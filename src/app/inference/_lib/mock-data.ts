import type { LanguageModelUsage, Tool } from "ai";

/**
 * Everything on /inference is static. Nothing here hits a model, a gateway or
 * an API — the playground exists to look at the blocks, not to run inference.
 */

export interface MockThread {
  id: string;
  title: string;
  preview: string;
  updated: string;
  unread?: number;
  active?: boolean;
}

export const MOCK_THREADS: MockThread[] = [
  {
    active: true,
    id: "thr_dither",
    preview: "Ship a dithered hero without the default AI look",
    title: "Dither the hero plate",
    updated: "now",
  },
  {
    id: "thr_tokens",
    preview: "Audit which semantic tokens the storefront actually uses",
    title: "Token audit — storefront",
    unread: 2,
    updated: "12m",
  },
  {
    id: "thr_composer",
    preview: "Composer needs an attachment tray + model switcher",
    title: "Composer ergonomics",
    updated: "1h",
  },
  {
    id: "thr_poster",
    preview: "Poster capture is cropping 16:9 stage plates",
    title: "Poster capture regression",
    updated: "4h",
  },
  {
    id: "thr_pricing",
    preview: "Two-tier pricing copy, no dark patterns",
    title: "Pricing page copy",
    updated: "Yesterday",
  },
  {
    id: "thr_shaders",
    preview: "WebGL fallbacks for reduced-motion visitors",
    title: "Shader fallbacks",
    updated: "2d",
  },
];

export interface MockAgent {
  id: string;
  name: string;
  role: string;
  initials: string;
  status: "online" | "idle" | "busy";
}

export const MOCK_AGENTS: MockAgent[] = [
  {
    id: "agt_surface",
    initials: "SF",
    name: "Surface",
    role: "Design engineer",
    status: "online",
  },
  {
    id: "agt_ledger",
    initials: "LG",
    name: "Ledger",
    role: "Repo archaeologist",
    status: "busy",
  },
  {
    id: "agt_scribe",
    initials: "SC",
    name: "Scribe",
    role: "Docs + changelog",
    status: "idle",
  },
  {
    id: "agt_warden",
    initials: "WD",
    name: "Warden",
    role: "Reviews risky diffs",
    status: "online",
  },
];

export interface MockPrompt {
  id: string;
  label: string;
  shortcut?: string;
}

export const MOCK_PROMPTS: MockPrompt[] = [
  { id: "pr_audit", label: "Audit a component for token drift", shortcut: "⌘1" },
  { id: "pr_port", label: "Port a Figma frame to a stage plate", shortcut: "⌘2" },
  { id: "pr_shader", label: "Explain a shader uniform", shortcut: "⌘3" },
  { id: "pr_changelog", label: "Draft a changelog entry" },
  { id: "pr_a11y", label: "Reduced-motion pass" },
];

export interface MockModel {
  id: string;
  name: string;
  vendor: string;
  context: string;
  note: string;
}

export const MOCK_MODELS: MockModel[] = [
  {
    context: "200k",
    id: "surface-large",
    name: "Surface Large",
    note: "Best for layout reasoning",
    vendor: "Frameline",
  },
  {
    context: "128k",
    id: "surface-fast",
    name: "Surface Fast",
    note: "Cheap, good enough for edits",
    vendor: "Frameline",
  },
  {
    context: "1M",
    id: "atlas-pro",
    name: "Atlas Pro",
    note: "Long-context repo reads",
    vendor: "Atlas",
  },
  {
    context: "64k",
    id: "quartz-mini",
    name: "Quartz Mini",
    note: "Local, no network",
    vendor: "Quartz",
  },
];

export const MOCK_SOURCES = [
  {
    href: "https://frameline.ai/docs/materials",
    quote:
      "Materials are shader surfaces. Screens are composed plates that ship at 1920×1080.",
    title: "Frameline · Materials overview",
  },
  {
    href: "https://frameline.ai/docs/tokens",
    quote:
      "Never hardcode a hex. Every surface reads from the semantic token layer.",
    title: "Frameline · Semantic tokens",
  },
  {
    href: "https://frameline.ai/docs/stage",
    quote:
      "Stage plates are always 16:9 so catalog thumbnails and posters agree.",
    title: "Frameline · Stage plate contract",
  },
];

export const MOCK_SUGGESTIONS = [
  "Show me the dithered hero variants",
  "Which screens miss a poster?",
  "Diff the token usage against base-sera",
  "Wire the composer to a fake stream",
  "Explain the stage plate contract",
  "List every reduced-motion fallback",
];

export const MOCK_REASONING = [
  "The ask is a hero plate that reads as *designed*, not as a default AI gradient.",
  "",
  "Two constraints matter. The stage plate is locked to 1920×1080 so the poster capture and the catalog thumbnail agree, and every colour has to resolve through the semantic token layer rather than a literal hex.",
  "",
  "That points at a dither pass over a two-stop token ramp: `--background` to `--muted`, with the ordered-dither threshold driven by a uniform rather than a texture so the plate stays crisp at capture resolution.",
].join("\n");

export const MOCK_ASSISTANT_REPLY = `Here's the shape I'd ship.

**Plate**: keep \`ScreenStage\` at 1920×1080 and let the shader fill it — no \`100dvh\` on the root when embedded, or the poster capture and the detail preview disagree.

**Ramp**: two stops off the token layer, so light and dark both stay legible.

\`\`\`tsx
<ScreenStage embed className="h-full min-h-0">
  <HeroDithering
    from="var(--background)"
    to="var(--muted)"
    threshold={0.42}
  />
</ScreenStage>
\`\`\`

Three things to watch:

1. Dither at capture resolution, not at CSS resolution — otherwise \`pnpm posters\` bakes in a moiré.
2. Gate the shader behind \`prefers-reduced-motion\` and fall back to the static poster.
3. Prepend the new screen to \`SCREENS_CATALOG\` so it lands at the top of the grid.

| Surface | Token | Fallback |
| --- | --- | --- |
| Plate | \`--background\` | poster.png |
| Ramp | \`--muted\` | flat fill |
| Grain | \`--border\` | none |
`;

export const MOCK_USER_PROMPT =
  "I want the hero plate to read as designed, not as another default AI gradient. What would you ship?";

export const MOCK_TOOL_INPUT = {
  glob: "src/screens/**/*.tsx",
  limit: 40,
  query: "ordered dither threshold uniform",
};

export const MOCK_TOOL_OUTPUT = `| Path | Match | Line |
| --- | --- | --- |
| src/screens/stage.tsx | SCREEN_STAGE_WIDTH | 12 |
| src/components/ui/hero-dithering.tsx | threshold | 48 |
| src/components/hero-dithering-demo.tsx | from/to ramp | 21 |`;

export const MOCK_TASK_STEPS = [
  'Searching "ordered dither threshold uniform"',
  "Scanning 52 files under src/screens",
  "Read src/screens/stage.tsx",
  "Read src/components/ui/hero-dithering.tsx",
  "Cross-checking SCREEN_STAGE_WIDTH against the poster script",
];

export const MOCK_PLAN_STEPS = [
  {
    detail: "Two token stops, threshold as a uniform.",
    label: "Add the dither ramp to the stage plate",
    status: "complete" as const,
  },
  {
    detail: "Gate behind prefers-reduced-motion.",
    label: "Wire the reduced-motion fallback",
    status: "complete" as const,
  },
  {
    detail: "pnpm posters hero-dither",
    label: "Recapture the poster at 1920×1080",
    status: "active" as const,
  },
  {
    detail: "Newest first, per the catalog order rule.",
    label: "Prepend to SCREENS_CATALOG",
    status: "pending" as const,
  },
];

export const MOCK_QUEUE = [
  "Recapture posters for the three newest screens",
  "Diff base-sera tokens against the storefront",
  "Draft the changelog entry for the dither plate",
];

export const MOCK_CODE_TSX = `import { ScreenStage } from "@/screens/stage";
import { HeroDithering } from "@/components/ui/hero-dithering";

export function HeroDitherPlate() {
  return (
    <ScreenStage embed className="h-full min-h-0">
      <HeroDithering
        from="var(--background)"
        to="var(--muted)"
        threshold={0.42}
      />
    </ScreenStage>
  );
}`;

export const MOCK_CODE_CSS = `@theme inline {
  --color-plate: var(--background);
  --color-plate-ramp: var(--muted);
  --color-plate-grain: var(--border);
}`;

export const MOCK_TERMINAL_OUTPUT = `$ pnpm posters hero-dither
\u001b[90m›\u001b[0m launching chromium (1920×1080)
\u001b[90m›\u001b[0m navigating to /screens/hero-dither?embed=1
\u001b[32m✓\u001b[0m captured public/screens/hero-dither/poster.png
\u001b[33m!\u001b[0m 2 screens still missing a poster
\u001b[32m✓\u001b[0m done in 4.1s`;

/** Same run, without the ANSI escapes, for panes that render plain text. */
export const MOCK_SANDBOX_LOG = `$ pnpm posters hero-dither
› launching chromium (1920×1080)
› navigating to /screens/hero-dither?embed=1
✓ captured public/screens/hero-dither/poster.png
! 2 screens still missing a poster
✓ done in 4.1s`;

export const MOCK_CONSOLE_LOGS = [
  {
    level: "log" as const,
    message: "[stage] plate mounted at 1920×1080",
    timestamp: new Date("2026-08-26T09:14:00Z"),
  },
  {
    level: "warn" as const,
    message: "[dither] threshold clamped to 0.42",
    timestamp: new Date("2026-08-26T09:14:01Z"),
  },
  {
    level: "error" as const,
    message: "[webgl] context lost — falling back to poster.png",
    timestamp: new Date("2026-08-26T09:14:03Z"),
  },
];

export const MOCK_STACK_TRACE = `TypeError: Cannot read properties of undefined (reading 'uniforms')
    at HeroDithering (src/components/ui/hero-dithering.tsx:48:19)
    at ScreenStage (src/screens/stage.tsx:31:7)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:16305:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20074:13)
    at HeroDitherPlate (src/screens/hero-dither/screen.tsx:14:5)`;

export const MOCK_ENV_VARS = [
  { name: "NEXT_PUBLIC_APP_URL", required: true, value: "https://frameline.ai" },
  { name: "POSTER_VIEWPORT", required: false, value: "1920x1080" },
  { name: "PLAYGROUND_MODE", required: false, value: "static" },
];

export const MOCK_FILE_TREE = {
  files: ["poster.png", "screen.tsx", "meta.ts"],
  folder: "src/screens/hero-dither",
};

export const MOCK_USAGE: LanguageModelUsage = {
  inputTokenDetails: {
    cacheReadTokens: 18_400,
    cacheWriteTokens: 2_100,
    noCacheTokens: 23_600,
  },
  inputTokens: 42_000,
  outputTokenDetails: {
    reasoningTokens: 1_850,
    textTokens: 4_450,
  },
  outputTokens: 6_300,
  totalTokens: 48_300,
};

/**
 * `Tool` is a runtime schema type in the AI SDK; the playground only ever
 * renders the schema, so a plain JSON-schema literal is enough.
 */
export const MOCK_AGENT_TOOLS: { key: string; tool: Tool }[] = [
  {
    key: "search_repo",
    tool: {
      description: "Search the repository for a symbol or string.",
      inputSchema: {
        properties: {
          glob: { description: "Restrict the search", type: "string" },
          query: { description: "What to look for", type: "string" },
        },
        required: ["query"],
        type: "object",
      },
    } as unknown as Tool,
  },
  {
    key: "capture_poster",
    tool: {
      description: "Capture a 1920×1080 poster for a screen slug.",
      inputSchema: {
        properties: {
          slug: { type: "string" },
          viewport: { default: "1920x1080", type: "string" },
        },
        required: ["slug"],
        type: "object",
      },
    } as unknown as Tool,
  },
  {
    key: "read_tokens",
    tool: {
      description: "Read the semantic token layer from globals.css.",
      inputSchema: {
        properties: { scope: { enum: ["root", "dark", "both"], type: "string" } },
        type: "object",
      },
    } as unknown as Tool,
  },
];

/** A 24×24 checker swatch, inlined so the image block never touches the network. */
export const MOCK_IMAGE_BASE64 =
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMxYzFhMTgiLz48cGF0aCBkPSJNMCAwaDEydjEySDB6TTEyIDEyaDEydjEySDEyeiIgZmlsbD0iIzNhMzUzMSIvPjwvc3ZnPg==";
