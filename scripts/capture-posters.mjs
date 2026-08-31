/**
 * Poster capture — screenshots /capture/<slug> into public/screens/<dir>/poster.png.
 *
 *   pnpm dev                     # in another shell
 *   pnpm posters [slug...]
 *
 * Posters are always 1920×1080 (16:9). The viewport stays locked to that size;
 * ScreenStage scales each screen plate to fit. Do not resize the viewport to
 * non–16:9 stage dimensions — catalog tiles assume 16:9 and use object-cover.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT ?? "3000";
const baseUrl = process.env.POSTER_BASE_URL ?? `http://localhost:${port}`;

/** Catalog poster plate — default 16:9; FORGE.AI uses Paper artboard 1440×1080. */
const POSTER_WIDTH = 1920;
const POSTER_HEIGHT = 1080;

const FORGEAI_POSTER_WIDTH = 1440;
const FORGEAI_POSTER_HEIGHT = 1080;

const FORGEAI_SLUGS = new Set([
  "forgeai",
  "fifty-x-hero",
  "forgeai-pink",
  "forgeai-lime",
  "forgeai-skeleton",
  "forgeai-pink-skeleton",
  "forgeai-lime-skeleton",
]);

function posterDimensions(slug) {
  if (FORGEAI_SLUGS.has(slug)) {
    return { width: FORGEAI_POSTER_WIDTH, height: FORGEAI_POSTER_HEIGHT };
  }
  return { width: POSTER_WIDTH, height: POSTER_HEIGHT };
}

/** Longest screen entrance is ~1.5s; leave headroom for shader first paint. */
const SETTLE_MS = 4000;

/** Pulse hero uses FlutedGlass + optional video; allow shader image load. */
const SETTLE_MS_BY_SLUG = {
  "health-ai": 6000,
  "health-ai-skeleton": 4500,
};

function settleMs(slug) {
  return SETTLE_MS_BY_SLUG[slug] ?? SETTLE_MS;
}

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : null,
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : null,
  "/opt/google/chrome/chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
].filter(Boolean);

/**
 * Catalog slug -> public/screens directory. They match except for the three
 * screens that kept their original product folder when the slug was renamed.
 */
const POSTER_DIRS = {
  orb: "built-for-yield",
  "feature-cards": "catch-killer-defects",
  insights: "defect-capture",
};

const DEFAULT_SLUGS = [
  "health-ai-skeleton",
  "health-ai",
  "passo-mono-skeleton",
  "passo-skeleton",
  "passo-mono",
  "passo",
  "forgeai-lime-skeleton",
  "forgeai-pink-skeleton",
  "forgeai-lime",
  "forgeai-pink",
  "forgeai",
  "softwave",
  "softwave-features",
  "bridge-dither",
  "mexin-hero",
  "miracle-login-cyan",
  "miracle-login",
  "dark-pill-hero",
  "ascii-hero",
  "orb",
  "feature-cards",
  "insights",
  "magenta-landscape",
  "browser-frame",
  "feature-rail",
  "blueprint",
  "spaceman-moon",
  "light-rays",
  "prompt-bar",
];

function resolveChrome() {
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      `No Chrome binary found. Set CHROME_PATH. Looked in: ${CHROME_CANDIDATES.join(", ")}`,
    );
  }
  return found;
}

function readPngSize(filePath) {
  const buf = readFileSync(filePath);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function capture(browser, slug) {
  const dir = POSTER_DIRS[slug] ?? slug;
  const out = join(root, "public", "screens", dir, "poster.png");
  mkdirSync(dirname(out), { recursive: true });

  const { width, height } = posterDimensions(slug);

  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });

  try {
    await page.goto(`${baseUrl}/capture/${slug}`, {
      waitUntil: "load",
      timeout: 60_000,
    });

    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(settleMs(slug));

    // Always shoot the locked 16:9 viewport — never match a taller stage plate.
    await page.screenshot({ path: out, animations: "allow" });
  } finally {
    await page.close();
  }

  const actual = readPngSize(out);
  const expected = posterDimensions(slug);
  if (actual.width !== expected.width || actual.height !== expected.height) {
    throw new Error(
      `${slug}: expected ${expected.width}×${expected.height}, got ${actual.width}×${actual.height}`,
    );
  }

  return { out, dir };
}

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : DEFAULT_SLUGS;

const browser = await chromium.launch({
  executablePath: resolveChrome(),
  args: [
    "--no-sandbox",
    // Software WebGL so shader-backed screens still paint headlessly.
    "--enable-unsafe-swiftshader",
    // Subpixel AA fringes small text with colour once the poster is scaled.
    "--disable-lcd-text",
  ],
});

try {
  for (const slug of slugs) {
    const { out } = await capture(browser, slug);
    console.log(`captured ${slug} -> ${out.replace(`${root}/`, "")}`);
  }
} finally {
  await browser.close();
}
