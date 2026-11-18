#!/usr/bin/env node
/**
 * Lightweight smoke checks — no Playwright, no server required for unit path.
 *
 * Optional live checks when SMOKE_BASE_URL is set:
 *   SMOKE_BASE_URL=http://localhost:3000 pnpm smoke
 */

import { runAuthSmoke } from "./smoke-auth.mjs";
import { runCatalogSmoke } from "./smoke-catalog.mjs";
import { runEmailSmoke } from "./smoke-emails.mjs";
import { runSignupSmoke } from "./smoke-signup.mjs";

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

  console.log("— unit (nurture emails) —");
  try {
    const summary = runEmailSmoke();
    ok(`nurture issues=${summary.issues} cadence=${summary.days}d`);
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  console.log("— unit (signup welcome claim) —");
  try {
    const summary = await runSignupSmoke();
    ok(`signup claim once=${summary.claimedOnce}`);
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  console.log("— unit (session cookies) —");
  try {
    const summary = runAuthSmoke();
    ok(`session parse cases=${summary.cases}`);
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

  await check("POST /api/checkout without session → 401", async () => {
    const res = await fetch(`${root}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: "screen",
        email: "anon@frameline.test",
        material: "spaceman-moon",
      }),
    });
    if (res.status !== 401) {
      throw new Error(`expected 401, got ${res.status}`);
    }
    const data = await res.json();
    if (data.ok !== false) {
      throw new Error(`anonymous checkout should fail: ${JSON.stringify(data)}`);
    }
  });

  // /api/checkout takes the real Stripe path whenever the server has a
  // STRIPE_SECRET_KEY, which on a live key means this check creates live
  // Checkout Sessions. Opt in explicitly rather than doing that by accident.
  // The session cookie is required; a bare email is not a login.
  if (process.env.SMOKE_ALLOW_CHECKOUT === "1") {
    await check("POST /api/checkout after magic-link → 200", async () => {
      const email = "smoke@frameline.test";
      const auth = await fetch(`${root}/api/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (auth.status !== 200) {
        throw new Error(`magic-link expected 200, got ${auth.status}`);
      }
      const setCookies =
        typeof auth.headers.getSetCookie === "function"
          ? auth.headers.getSetCookie()
          : [];
      const cookie = setCookies
        .map((entry) => entry.split(";")[0])
        .filter(Boolean)
        .join("; ");
      if (!cookie.includes("fl_demo_email=")) {
        throw new Error("magic-link did not set a session cookie");
      }
      const res = await fetch(`${root}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify({
          plan: "screen",
          email,
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
  } else {
    console.log(
      "skip  POST /api/checkout (set SMOKE_ALLOW_CHECKOUT=1 — hits Stripe for real when a secret key is configured)",
    );
  }

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

  await check("auth session cookies persist after magic-link", async () => {
    const email = `smoke-auth-${Date.now()}@frameline.test`;
    const signIn = await fetch(`${root}/api/auth/magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (signIn.status !== 200) {
      throw new Error(`magic-link expected 200, got ${signIn.status}`);
    }
    const setCookie =
      typeof signIn.headers.getSetCookie === "function"
        ? signIn.headers.getSetCookie()
        : [signIn.headers.get("set-cookie")].filter(Boolean);
    const cookieHeader = setCookie
      .flatMap((value) => String(value).split(/,(?=\s*[A-Za-z0-9_-]+=)/))
      .map((part) => part.split(";")[0].trim())
      .filter(Boolean)
      .join("; ");
    if (!cookieHeader.includes("fl_demo_email=")) {
      throw new Error(`missing fl_demo_email Set-Cookie: ${cookieHeader}`);
    }
    if (!cookieHeader.includes("fl_session=")) {
      throw new Error(`missing fl_session Set-Cookie: ${cookieHeader}`);
    }

    const me = await fetch(`${root}/api/auth/me`, {
      headers: { cookie: cookieHeader },
    });
    if (me.status !== 200) {
      throw new Error(`/api/auth/me expected 200, got ${me.status}`);
    }
    const meData = await me.json();
    if (meData.user?.email !== email) {
      throw new Error(`expected signed-in ${email}, got ${JSON.stringify(meData)}`);
    }

    const account = await fetch(`${root}/account`, {
      headers: { cookie: cookieHeader },
    });
    if (account.status !== 200) {
      throw new Error(`/account expected 200, got ${account.status}`);
    }
    const html = await account.text();
    if (!html.includes(email)) {
      throw new Error("account page did not render the signed-in email");
    }
    if (html.includes("Not signed in")) {
      throw new Error("account page still shows Not signed in after magic-link");
    }

    const signOut = await fetch(`${root}/api/auth/sign-out`, {
      method: "POST",
      headers: { cookie: cookieHeader },
    });
    if (signOut.status !== 200) {
      throw new Error(`sign-out expected 200, got ${signOut.status}`);
    }
  });

  await check("DELETE /api/account removes the user and expires cookies", async () => {
    const email = `smoke-del-${Date.now()}@frameline.test`;
    const signIn = await fetch(`${root}/api/auth/magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (signIn.status !== 200) {
      throw new Error(`magic-link expected 200, got ${signIn.status}`);
    }
    const setCookie =
      typeof signIn.headers.getSetCookie === "function"
        ? signIn.headers.getSetCookie()
        : [signIn.headers.get("set-cookie")].filter(Boolean);
    const cookieHeader = setCookie
      .flatMap((value) => String(value).split(/,(?=\s*[A-Za-z0-9_-]+=)/))
      .map((part) => part.split(";")[0].trim())
      .filter(Boolean)
      .join("; ");

    const del = await fetch(`${root}/api/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({ confirmEmail: email }),
    });
    const delData = await del.json();
    if (del.status !== 200 || !delData.ok) {
      throw new Error(
        `delete expected 200 ok, got ${del.status} ${JSON.stringify(delData)}`,
      );
    }
    const expired =
      typeof del.headers.getSetCookie === "function"
        ? del.headers.getSetCookie()
        : [del.headers.get("set-cookie")].filter(Boolean);
    const expiredBlob = expired.join("\n");
    if (!/fl_demo_email=/.test(expiredBlob) || !/fl_session=/.test(expiredBlob)) {
      throw new Error(`delete did not expire session cookies: ${expiredBlob}`);
    }

    const me = await fetch(`${root}/api/auth/me`);
    const meData = await me.json();
    if (meData.user) {
      throw new Error(
        `session still present after delete: ${JSON.stringify(meData)}`,
      );
    }

    const leftover = await fetch(`${root}/api/auth/me`, {
      headers: { cookie: cookieHeader },
    });
    const leftoverData = await leftover.json();
    if (leftoverData.user) {
      throw new Error(
        `deleted account still signed in via leftover cookies: ${JSON.stringify(leftoverData)}`,
      );
    }

    const account = await fetch(`${root}/account`, {
      headers: { cookie: cookieHeader },
    });
    if (account.status !== 200) {
      throw new Error(`/account expected 200, got ${account.status}`);
    }
    const html = await account.text();
    if (html.includes(email)) {
      throw new Error("account page still renders the deleted email");
    }
    if (!html.includes("Not signed in")) {
      throw new Error("account page did not return to the signed-out state");
    }
  });

  await check("copy → manifest URL carries a copy id", async () => {
    const res = await fetch(`${root}/api/screens/copy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "spaceman-moon", path: "code" }),
    });
    const data = await res.json();
    // A used-up weekly quota or signed-out gate is a valid outcome.
    if (data.reason === "pay" || data.reason === "auth") return;
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
