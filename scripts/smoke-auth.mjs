/**
 * Session cookie parse / serialize integrity checks.
 */

import {
  parseSessionCookieValue,
  serializeSessionCookieValue,
  sessionUserFromFields,
} from "../src/lib/session.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function runAuthSmoke() {
  const raw = serializeSessionCookieValue({
    email: "buyer@frameline.ai",
    role: "buyer",
  });
  assert(
    parseSessionCookieValue(raw)?.email === "buyer@frameline.ai",
    "raw JSON session cookie should parse",
  );

  const encoded = encodeURIComponent(raw);
  assert(
    parseSessionCookieValue(encoded)?.email === "buyer@frameline.ai",
    "URL-encoded JSON session cookie should parse",
  );

  const quoted = `"${raw.replace(/"/g, '\\"')}"`;
  assert(
    parseSessionCookieValue(quoted)?.email === "buyer@frameline.ai",
    "quoted JSON session cookie should parse",
  );

  const doubleEncoded = encodeURIComponent(encoded);
  assert(
    parseSessionCookieValue(doubleEncoded)?.email === "buyer@frameline.ai",
    "double-encoded JSON session cookie should parse",
  );

  assert(
    parseSessionCookieValue("alice@studio.dev")?.email === "alice@studio.dev",
    "plain email session cookie should parse",
  );
  assert(
    parseSessionCookieValue("admin@frameline.ai|admin")?.role === "admin",
    "email|role session cookie should parse",
  );

  const extra = serializeSessionCookieValue(
    { email: "uid@frameline.ai", role: "buyer" },
    { uid: "abc123" },
  );
  assert(
    parseSessionCookieValue(extra)?.email === "uid@frameline.ai",
    "session JSON with extra fields should still parse",
  );

  assert(
    parseSessionCookieValue("") === null &&
      parseSessionCookieValue("not-json") === null &&
      parseSessionCookieValue("{}") === null,
    "invalid session cookies should be null",
  );

  const fields = sessionUserFromFields("  MixEd@Frameline.AI ");
  assert(
    fields?.email === "mixed@frameline.ai" && fields.role === "buyer",
    "sessionUserFromFields should normalize email",
  );

  return { cases: 8 };
}
