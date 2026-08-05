#!/usr/bin/env node
/**
 * Materialize .secrets/firebase-adminsdk.json from env vars.
 * Run on cloud-agent boot / locally when the JSON file is missing.
 *
 * Required env:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY   (literal \n newlines ok)
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, ".secrets");
const outFile = path.join(outDir, "firebase-adminsdk.json");

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

if (!projectId || !clientEmail || !privateKey) {
  console.log(
    "[sync-firebase-secrets] skip — set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY",
  );
  process.exit(0);
}

if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
  privateKey = privateKey.slice(1, -1);
}
privateKey = privateKey.replace(/\\n/g, "\n");

const sa = {
  type: "service_account",
  project_id: projectId,
  private_key: privateKey,
  client_email: clientEmail,
  token_uri: "https://oauth2.googleapis.com/token",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  universe_domain: "googleapis.com",
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(sa, null, 2)}\n`, { mode: 0o600 });
try {
  fs.chmodSync(outFile, 0o600);
} catch {
  /* ignore on platforms without chmod */
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // Hint for shells that source this after
  console.log(
    `[sync-firebase-secrets] wrote ${outFile} (set GOOGLE_APPLICATION_CREDENTIALS=${outFile})`,
  );
} else {
  console.log(`[sync-firebase-secrets] wrote ${outFile}`);
}
