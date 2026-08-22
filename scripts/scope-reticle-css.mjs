import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join("/tmp/reticle/src");

function scopeCss(css, scope) {
  const atRules = [];
  let prepared = css.replace(/@(keyframes|font-face)[^{]*\{[\s\S]*?\n\}/g, (block) => {
    atRules.push(block);
    return `/*__AT_${atRules.length - 1}__*/`;
  });

  prepared = prepared.replace(
    /(^|})\s*([^@{}][^{]*)\{/g,
    (match, brace, selectors) => {
      const scoped = selectors
        .split(",")
        .map((sel) => {
          const s = sel.trim();
          if (!s) return s;
          if (s.startsWith(scope)) return s;
          return `${scope} ${s}`;
        })
        .join(", ");
      return `${brace}\n${scoped} {`;
    },
  );

  prepared = prepared.replace(/\/\*__AT_(\d+)__\*\//g, (_, i) => atRules[Number(i)]);
  return `/* Scoped from Reticle — do not Tailwind-rewrite */\n${scope} { color: inherit; }\n${prepared}\n`;
}

const jobs = [
  {
    files: ["App.css"],
    out: "src/screens/built-for-yield/built-for-yield.css",
    scope: ".fl-built-for-yield",
  },
  {
    files: ["App.css", "Skeleton.css"],
    out: "src/screens/yield-skeleton/yield-skeleton.css",
    scope: ".fl-yield-skeleton",
  },
  {
    files: ["Features.css"],
    out: "src/screens/catch-killer-defects/catch-killer-defects.css",
    scope: ".fl-catch-killer-defects",
    rewrite: (css) =>
      css
        .replaceAll("/features/card-1-dither.png", "/screens/catch-killer-defects/card-1-dither.png")
        .replaceAll("/features/card-1-glass.webp", "/screens/catch-killer-defects/card-1-glass.webp")
        .replaceAll("/features/card-2.png", "/screens/catch-killer-defects/card-2.png")
        .replaceAll("/features/card-3.png", "/screens/catch-killer-defects/card-3.png"),
  },
  {
    files: ["Features.css", "Skeleton.css"],
    out: "src/screens/features-skeleton/features-skeleton.css",
    scope: ".fl-features-skeleton",
  },
  {
    files: ["Insights.css"],
    out: "src/screens/defect-capture/defect-capture.css",
    scope: ".fl-defect-capture",
    rewrite: (css) =>
      css.replaceAll("/insights/visual.png", "/screens/defect-capture/visual.png"),
  },
  {
    files: ["Insights.css", "Skeleton.css"],
    out: "src/screens/insights-skeleton/insights-skeleton.css",
    scope: ".fl-insights-skeleton",
    rewrite: (css) =>
      css.replaceAll("/insights/visual.png", "/screens/defect-capture/visual.png"),
  },
];

for (const job of jobs) {
  let css = job.files.map((file) => readFileSync(join(src, file), "utf8")).join("\n\n");
  if (job.rewrite) css = job.rewrite(css);
  writeFileSync(join(root, job.out), scopeCss(css, job.scope));
  console.log("wrote", job.out);
}
