/**
 * Env-only Firebase Admin readiness checks.
 * Kept free of `firebase-admin` imports so status routes never crash if the
 * Admin SDK fails to load in a serverless bundle.
 */

export function hasFirebaseAdminEnv(): boolean {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) return true;
  return Boolean(
    process.env.FIREBASE_PROJECT_ID?.trim() &&
      process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_PRIVATE_KEY?.trim(),
  );
}

/** Normalize PEM from Vercel/Cursor secrets (`\n`, quoted, or real newlines). */
export function readFirebasePrivateKey(): string | undefined {
  let raw = process.env.FIREBASE_PRIVATE_KEY?.trim();
  if (!raw) return undefined;

  // Vercel / dotenv sometimes wraps the whole PEM in quotes.
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1);
  }

  return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
}

export function firebaseAdminEnvSnapshot() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || null;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() || null;
  const privateKey = readFirebasePrivateKey();

  return {
    projectId,
    hasProjectId: Boolean(projectId),
    hasClientEmail: Boolean(clientEmail),
    hasPrivateKey: Boolean(privateKey),
    privateKeyLooksPem: Boolean(
      privateKey?.includes("BEGIN PRIVATE KEY") &&
        privateKey?.includes("END PRIVATE KEY"),
    ),
    hasApplicationDefaultCredentials: Boolean(
      process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim(),
    ),
    configured: hasFirebaseAdminEnv(),
  };
}
