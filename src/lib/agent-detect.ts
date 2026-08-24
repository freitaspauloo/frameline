/**
 * Classify the client behind a request from its User-Agent.
 *
 * Used to answer "which agent or IDE actually pulled this code?" — the raw
 * User-Agent is always stored alongside the verdict so new tools can be
 * reclassified later without losing history.
 */

export type AgentKind =
  | "cursor"
  | "claude-code"
  | "copilot"
  | "windsurf"
  | "vscode"
  | "jetbrains"
  | "zed"
  | "codex"
  | "chatgpt"
  | "gemini"
  | "perplexity"
  | "shadcn-cli"
  | "node"
  | "curl"
  | "wget"
  | "python"
  | "go"
  | "postman"
  | "browser"
  | "bot"
  | "unknown";

/** Coarse grouping for dashboard rollups. */
export type AgentClass = "agent" | "ide" | "cli" | "browser" | "bot" | "unknown";

type Rule = { kind: AgentKind; match: RegExp };

/**
 * Ordered most-specific first: an agent embedded in an IDE should report the
 * agent, and every coding tool should win over the generic runtime it uses.
 */
const RULES: Rule[] = [
  { kind: "cursor", match: /cursor/i },
  { kind: "claude-code", match: /claude[-\s]?(code|cli|user)|anthropic/i },
  { kind: "copilot", match: /copilot/i },
  { kind: "windsurf", match: /windsurf|codeium/i },
  { kind: "codex", match: /codex/i },
  { kind: "chatgpt", match: /chatgpt|gptbot|oai-searchbot|openai/i },
  { kind: "gemini", match: /gemini|google-extended|bard/i },
  { kind: "perplexity", match: /perplexity/i },
  { kind: "zed", match: /\bzed\b/i },
  { kind: "jetbrains", match: /jetbrains|intellij|webstorm|pycharm|fleet/i },
  { kind: "vscode", match: /vs\s?code|visual\s?studio\s?code|\bcode\/\d/i },
  { kind: "shadcn-cli", match: /shadcn/i },
  { kind: "postman", match: /postman|insomnia|thunder\s?client/i },
  { kind: "curl", match: /\bcurl\//i },
  { kind: "wget", match: /\bwget\b/i },
  { kind: "python", match: /python-requests|httpx|aiohttp|urllib/i },
  { kind: "go", match: /go-http-client|\bgo\/\d/i },
  { kind: "node", match: /undici|node-fetch|axios|\bgot\b|\bbun\b|\bdeno\b|\bnode\b|npm|pnpm|yarn/i },
  { kind: "bot", match: /bot\b|crawler|spider|slurp|facebookexternalhit|preview/i },
];

const CLASS_BY_KIND: Record<AgentKind, AgentClass> = {
  cursor: "agent",
  "claude-code": "agent",
  copilot: "agent",
  windsurf: "agent",
  codex: "agent",
  chatgpt: "agent",
  gemini: "agent",
  perplexity: "agent",
  vscode: "ide",
  jetbrains: "ide",
  zed: "ide",
  "shadcn-cli": "cli",
  node: "cli",
  curl: "cli",
  wget: "cli",
  python: "cli",
  go: "cli",
  postman: "cli",
  browser: "browser",
  bot: "bot",
  unknown: "unknown",
};

/** Human labels for the admin dashboard. */
const LABEL_BY_KIND: Record<AgentKind, string> = {
  cursor: "Cursor",
  "claude-code": "Claude Code",
  copilot: "GitHub Copilot",
  windsurf: "Windsurf",
  codex: "Codex",
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  vscode: "VS Code",
  jetbrains: "JetBrains",
  zed: "Zed",
  "shadcn-cli": "shadcn CLI",
  node: "Node / package manager",
  curl: "curl",
  wget: "wget",
  python: "Python client",
  go: "Go client",
  postman: "API client",
  browser: "Browser",
  bot: "Crawler",
  unknown: "Unknown",
};

function looksLikeBrowser(userAgent: string): boolean {
  // Real browsers send a Mozilla token plus an engine token. Many CLIs spoof
  // "Mozilla/5.0" alone, so require the engine too.
  return (
    /mozilla\/\d/i.test(userAgent) &&
    /(chrome|safari|firefox|edg|webkit|gecko)\//i.test(userAgent)
  );
}

/** Best-effort classification. Never throws; unknown input yields "unknown". */
export function classifyAgent(userAgent: string | null | undefined): AgentKind {
  const ua = userAgent?.trim();
  if (!ua) return "unknown";

  for (const rule of RULES) {
    if (rule.match.test(ua)) return rule.kind;
  }

  return looksLikeBrowser(ua) ? "browser" : "unknown";
}

export function agentClass(kind: AgentKind): AgentClass {
  return CLASS_BY_KIND[kind] ?? "unknown";
}

export function agentLabel(kind: string): string {
  return LABEL_BY_KIND[kind as AgentKind] ?? kind;
}

/**
 * True when the request almost certainly came from a program rather than a
 * browser tab. Browsers always send Sec-Fetch-* on same-origin fetches and an
 * Accept-Language header; tools generally send neither.
 */
export function looksAutomated(request: Request): boolean {
  const kind = classifyAgent(request.headers.get("user-agent"));
  if (kind === "browser") return false;
  if (kind !== "unknown") return true;

  const hasSecFetch = Boolean(request.headers.get("sec-fetch-mode"));
  const hasLanguage = Boolean(request.headers.get("accept-language"));
  return !hasSecFetch && !hasLanguage;
}

/**
 * Describe the caller of a registry/asset fetch in one pass.
 * `hint` lets a route add context the User-Agent cannot carry (e.g. a request
 * shaped like a shadcn registry resolve).
 */
export function describeClient(
  request: Request,
  hint?: AgentKind,
): { kind: AgentKind; class: AgentClass; userAgent: string | null } {
  const userAgent = request.headers.get("user-agent");
  let kind = classifyAgent(userAgent);
  // A generic Node runtime hitting a registry URL is the shadcn CLI in practice.
  if (hint && (kind === "node" || kind === "unknown")) kind = hint;
  return { kind, class: agentClass(kind), userAgent };
}
