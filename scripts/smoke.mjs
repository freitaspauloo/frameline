#!/usr/bin/env node
/**
 * Lightweight smoke checks — no Playwright, no server required for unit path.
 *
 * Optional live checks when SMOKE_BASE_URL is set:
 *   SMOKE_BASE_URL=http://localhost:3000 pnpm smoke
 */

import { runCatalogSmoke } from "./smoke-catalog.mjs";

function fail(message) {
  console.error(`FAIL  ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`ok    ${message}`);
}

async function runUnit() {
  console.log("— unit (catalog / plans / collections) —");
  try {
    const summary = runCatalogSmoke();
    ok(
      `catalog=${summary.catalog} free=${summary.free} collections=${summary.collections} renderers=${summary.renderers} plans=${summary.plans.join(",")}`,
    );
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }
}

async function runLive(baseUrl) {
  console.log(`— live (${baseUrl}) —`);
  const root = baseUrl.replace(/\/$/, "");

  async function check(label, fn) {
    try {
      await fn();
      ok(label);
    } catch (err) {
      fail(`${label}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  await check("GET /api/registry/aurora-mesh → 200", async () => {
    const res = await fetch(`${root}/api/registry/aurora-mesh`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
  });

  await check("GET /api/registry/ember-warp → 200", async () => {
    const res = await fetch(`${root}/api/registry/ember-warp`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
  });

  await check("POST /api/checkout (demo) → 200", async () => {
    const res = await fetch(`${root}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: "screen",
        email: "smoke@frameline.test",
        material: "spaceman-moon",
      }),
    });
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`checkout not ok: ${JSON.stringify(data)}`);
    }
  });

  await check("POST /api/intent → 200", async () => {
    const res = await fetch(`${root}/api/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: "screen",
        source: "smoke",
        material: "spaceman-moon",
      }),
    });
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`intent not ok: ${JSON.stringify(data)}`);
    }
  });

  await check("POST /api/install → 200", async () => {
    const res = await fetch(`${root}/api/install`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "aurora-mesh",
        source: "smoke",
        path: "cli",
      }),
    });
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`install not ok: ${JSON.stringify(data)}`);
    }
  });

  await check("GET /api/install → count", async () => {
    const res = await fetch(`${root}/api/install`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (typeof data.count !== "number" || data.count < 1) {
      throw new Error(`expected count >= 1, got ${JSON.stringify(data)}`);
    }
  });

  await check("GET /og/material?slug=aurora-mesh → image", async () => {
    const res = await fetch(`${root}/og/material?slug=aurora-mesh`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("image")) {
      throw new Error(`expected image content-type, got ${type}`);
    }
  });

  await check("GET /r/aurora-mesh.json → registry item", async () => {
    const res = await fetch(`${root}/r/aurora-mesh.json`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (data.name !== "aurora-mesh" || !data.files?.[0]?.content) {
      throw new Error(`unexpected registry body: ${JSON.stringify(data).slice(0, 120)}`);
    }
  });

  await check("GET /r/orb.json → paid screen withholds source", async () => {
    const res = await fetch(`${root}/r/orb.json`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (data.meta?.entitled !== false) {
      throw new Error("expected entitled=false without a token");
    }
    if (data.files?.some((file) => "content" in file)) {
      throw new Error("paid screen source leaked without an entitlement");
    }
  });

  await check("GET /a/... → hosted asset with range support", async () => {
    const res = await fetch(`${root}/a/screens/spaceman-moon/poster.png`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    if (res.headers.get("accept-ranges") !== "bytes") {
      throw new Error("expected Accept-Ranges: bytes");
    }
  });

  await check("GET /a/robots.txt → 404 outside allowed roots", async () => {
    const res = await fetch(`${root}/a/robots.txt`);
    if (res.status !== 404) {
      throw new Error(`expected 404, got ${res.status}`);
    }
  });

  await check("copy → manifest URL carries a copy id", async () => {
    const res = await fetch(`${root}/api/screens/copy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "spaceman-moon", path: "code" }),
    });
    const data = await res.json();
    // A used-up weekly quota is a valid outcome; only assert on a real payload.
    if (data.reason === "pay") return;
    if (!data.ok || !data.copyId) {
      throw new Error(`expected a copyId, got ${JSON.stringify(data).slice(0, 120)}`);
    }
    if (!data.text.includes(`c=${data.copyId}`)) {
      throw new Error("copied payload does not carry its copy id");
    }
  });
}

const baseUrl = process.env.SMOKE_BASE_URL?.trim();

await runUnit();
if (baseUrl) {
  await runLive(baseUrl);
} else {
  console.log("skip  live checks (set SMOKE_BASE_URL to enable)");
}

if (process.exitCode) {
  console.error("\nSmoke failed.");
  process.exit(process.exitCode);
}

console.log("\nSmoke passed.");
