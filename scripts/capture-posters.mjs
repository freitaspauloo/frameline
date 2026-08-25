/**
 * Poster capture — screenshots /capture/<slug> into public/screens/<dir>/poster.png.
 *
 *   pnpm dev                     # in another shell
 *   pnpm posters [slug...]
 *
 * Each screen draws on its own ScreenStage, so the viewport is resized to that
 * stage's natural size (scale 1) and only the stage element is shot. Entrances
 * are GSAP timelines, so the shot waits for them to finish in real time.
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT ?? "3000";
const baseUrl = process.env.POSTER_BASE_URL ?? `http://localhost:${port}`;

/** Longest screen entrance is ~1.5s; leave headroom for shader first paint. */
const SETTLE_MS = 4000;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
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
  "dark-pill-hero",
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

async function capture(browser, slug) {
  const dir = POSTER_DIRS[slug] ?? slug;
  const out = join(root, "public", "screens", dir, "poster.png");
  mkdirSync(dirname(out), { recursive: true });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  try {
    await page.goto(`${baseUrl}/capture/${slug}`, {
      waitUntil: "load",
      timeout: 60_000,
    });

    const stage = page.locator(".stage").first();
    const staged = await stage
      .waitFor({ state: "visible", timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    if (staged) {
      // A stage is a fixed-size plate scaled to fit; match it so scale is 1:1.
      const size = await stage.evaluate((el) => ({
        width: el.offsetWidth,
        height: el.offsetHeight,
      }));
      await page.setViewportSize(size);
    }

    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(SETTLE_MS);

    // The viewport now matches the stage exactly, and screens without a stage
    // (spaceman-moon) fill it — so shoot the page and skip Playwright's
    // element-stability wait, which never settles on looping screens.
    await page.screenshot({ path: out, animations: "allow" });
  } finally {
    await page.close();
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
