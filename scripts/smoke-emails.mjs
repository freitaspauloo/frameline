/**
 * Biweekly nurture template + cadence checks.
 * Run via: node --experimental-strip-types --import ./scripts/smoke-register.mjs scripts/smoke.mjs
 */

import {
  isNurtureDue,
  NURTURE_INTERVAL_DAYS,
  NURTURE_ISSUES,
  listDueNurture,
  nurtureIssueAt,
  nurtureUnsubscribeToken,
  nurtureUnsubscribeUrl,
  renderNurtureEmail,
  verifyNurtureToken,
} from "../src/lib/nurture.ts";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runEmailSmoke() {
  assert(NURTURE_ISSUES.length === 4, "expected 4 rotating nurture issues");
  assert(NURTURE_INTERVAL_DAYS === 15, "cadence must be 15 days");

  const ids = NURTURE_ISSUES.map((issue) => issue.id);
  assert(
    JSON.stringify(ids) ===
      JSON.stringify(["materials", "screens", "craft", "shipping"]),
    `unexpected issue ids: ${ids.join(",")}`,
  );

  const email = "preview@frameline.ai";
  const unsubscribeUrl = nurtureUnsubscribeUrl(email, "https://frameline.ai");

  for (const [index, issue] of NURTURE_ISSUES.entries()) {
    assert(nurtureIssueAt(index).id === issue.id, `index ${index} mismatch`);
    assert(
      nurtureIssueAt(index + NURTURE_ISSUES.length).id === issue.id,
      "sequence must loop",
    );

    const rendered = renderNurtureEmail(issue, {
      email,
      unsubscribeUrl,
      baseUrl: "https://frameline.ai",
    });

    assert(rendered.subject.startsWith("Frameline ·"), rendered.subject);
    assert(
      rendered.html.includes("<!DOCTYPE html>"),
      `${issue.id} missing doctype`,
    );
    assert(
      rendered.html.includes("frameline.ai"),
      `${issue.id} missing frameline.ai`,
    );
    assert(
      !rendered.html.includes("frameline.vercel.app"),
      `${issue.id} leaked vercel.app`,
    );
    assert(
      rendered.html.includes("Unsubscribe"),
      `${issue.id} missing unsubscribe`,
    );
    assert(
      rendered.html.includes("/unsubscribe") &&
        (rendered.html.includes("preview@frameline.ai") ||
          rendered.html.includes("preview%40frameline.ai")),
      `${issue.id} unsubscribe URL not in HTML`,
    );
    assert(
      rendered.html.includes(issue.ctaLabel),
      `${issue.id} missing CTA label`,
    );
    assert(
      rendered.ctaHref.startsWith("https://frameline.ai"),
      `${issue.id} CTA must be on frameline.ai`,
    );
    assert(
      rendered.text.includes("Unsubscribe:"),
      `${issue.id} missing text unsubscribe`,
    );
    for (const feature of issue.features) {
      assert(
        rendered.html.includes(feature.title),
        `${issue.id} missing feature ${feature.title}`,
      );
    }
  }

  const token = nurtureUnsubscribeToken(email);
  assert(token.length === 64, "expected sha256 hex token");
  assert(verifyNurtureToken(email, token), "token should verify");
  assert(!verifyNurtureToken(email, "0".repeat(64)), "wrong token must fail");
  assert(
    unsubscribeUrl.startsWith("https://frameline.ai/unsubscribe"),
    unsubscribeUrl,
  );

  const now = new Date("2026-11-06T14:00:00.000Z");
  const enrolled = new Date("2026-10-20T14:00:00.000Z"); // 17 days earlier
  const recent = new Date("2026-11-01T14:00:00.000Z"); // 5 days earlier

  assert(
    isNurtureDue({
      enrolledAt: enrolled,
      lastSentAt: null,
      unsubscribedAt: null,
      now,
    }),
    "17 days after enroll should be due",
  );
  assert(
    !isNurtureDue({
      enrolledAt: recent,
      lastSentAt: null,
      unsubscribedAt: null,
      now,
    }),
    "5 days after enroll should not be due",
  );
  assert(
    !isNurtureDue({
      enrolledAt: enrolled,
      lastSentAt: null,
      unsubscribedAt: now,
      now,
    }),
    "unsubscribed must never be due",
  );
  assert(
    isNurtureDue({
      enrolledAt: enrolled,
      lastSentAt: new Date("2026-10-21T14:00:00.000Z"),
      unsubscribedAt: null,
      now,
    }),
    "16 days after last send should be due",
  );

  const due = listDueNurture(
    [
      {
        id: "1",
        email: "due@frameline.ai",
        source: "account",
        issueIndex: 0,
        enrolledAt: enrolled.toISOString(),
        lastSentAt: null,
        lastIssueId: null,
        unsubscribedAt: null,
      },
      {
        id: "2",
        email: "fresh@frameline.ai",
        source: "waitlist",
        issueIndex: 0,
        enrolledAt: recent.toISOString(),
        lastSentAt: null,
        lastIssueId: null,
        unsubscribedAt: null,
      },
    ],
    now,
  );
  assert(due.length === 1 && due[0].email === "due@frameline.ai", "due filter");

  return {
    issues: NURTURE_ISSUES.length,
    days: NURTURE_INTERVAL_DAYS,
  };
}
