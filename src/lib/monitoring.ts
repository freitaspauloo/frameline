/**
 * Sentry-shaped monitoring stub.
 * Logs in development; no-ops in production unless SENTRY_DSN is set
 * (still stubbed — wire @sentry/* when ready).
 */

const hasSentryDsn = Boolean(process.env.SENTRY_DSN?.trim());
const isDev = process.env.NODE_ENV === "development";

function shouldLog() {
  return isDev || hasSentryDsn;
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!shouldLog()) return;
  if (context) {
    console.error("[monitoring] exception", error, context);
  } else {
    console.error("[monitoring] exception", error);
  }
  // When SENTRY_DSN is set, replace this stub with Sentry.captureException.
}

export function captureMessage(
  message: string,
  context?: Record<string, unknown>,
): void {
  if (!shouldLog()) return;
  if (context) {
    console.error("[monitoring] message", message, context);
  } else {
    console.error("[monitoring] message", message);
  }
  // When SENTRY_DSN is set, replace this stub with Sentry.captureMessage.
}
