/**
 * Signup welcome is claimed once — parallel session posts cannot double-fire
 * the Resend `user.signed_up` event.
 */

import {
  claimSignupNotification,
  releaseSignupNotification,
  upsertUser,
} from "../src/lib/users.ts";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runSignupSmoke() {
  const previousDb = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const stamp = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const email = `signup-claim-${stamp}@frameline.test`;

    const first = await upsertUser({ email, displayName: "Claim Once" });
    assert(first.created, "first upsert must create the user");
    const second = await upsertUser({ email, displayName: "Claim Once" });
    assert(!second.created, "second upsert must not report created");

    const [a, b] = await Promise.all([
      claimSignupNotification(email),
      claimSignupNotification(email),
    ]);
    assert(
      Number(a) + Number(b) === 1,
      `exactly one parallel claim should win (got ${a}, ${b})`,
    );
    assert(
      !(await claimSignupNotification(email)),
      "third claim after a win must skip",
    );

    await releaseSignupNotification(email);
    assert(
      await claimSignupNotification(email),
      "release must allow a retry claim",
    );

    const missing = await claimSignupNotification(
      `missing-${stamp}@frameline.test`,
    );
    assert(!missing, "claim on a missing user must fail closed");

    return { claimedOnce: true };
  } finally {
    if (previousDb === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDb;
  }
}
