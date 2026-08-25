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

/** Catalog poster plate — must match SCREEN_STAGE_WIDTH/HEIGHT in stage.tsx. */
const POSTER_WIDTH = 1920;
const POSTER_HEIGHT = 1080;

/** Longest screen entrance is ~1.5s; leave headroom for shader first paint. */
const SETTLE_MS = 4000;

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
  "softwave",
  "softwave-features",
  "bridge-dither",
  "mexin-hero",
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

  const page = await browser.newPage({
    viewport: { width: POSTER_WIDTH, height: POSTER_HEIGHT },
    deviceScaleFactor: 1,
  });

  try {
    await page.goto(`${baseUrl}/capture/${slug}`, {
      waitUntil: "load",
      timeout: 60_000,
    });

    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(SETTLE_MS);

    // Always shoot the locked 16:9 viewport — never match a taller stage plate.
    await page.screenshot({ path: out, animations: "allow" });
  } finally {
    await page.close();
  }

  const { width, height } = readPngSize(out);
  if (width !== POSTER_WIDTH || height !== POSTER_HEIGHT) {
    throw new Error(
      `${slug}: expected ${POSTER_WIDTH}×${POSTER_HEIGHT}, got ${width}×${height}`,
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
