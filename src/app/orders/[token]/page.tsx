import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { Button } from "@/components/ui/button";
import { findDemoOrder } from "@/lib/fulfillment";
import { getLicensePlan } from "@/lib/license-plans";
import { captureException } from "@/lib/monitoring";
import { fulfillStripeSessionId } from "@/lib/stripe-fulfillment";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{
    plan?: string;
    material?: string;
    email?: string;
    orderId?: string;
    session_id?: string;
    token?: string;
  }>;
}) {
  const { token } = await params;
  const {
    plan: planParam,
    material: materialParam,
    email: emailParam,
    orderId: orderIdParam,
    session_id: sessionIdParam,
    token: tokenParam,
  } = await searchParams;

  const sessionId =
    sessionIdParam?.trim() ||
    (token.startsWith("cs_") ? token : undefined) ||
    undefined;

  const lookupId =
    orderIdParam?.trim() ||
    (token !== "demo" && !token.startsWith("cs_") ? token : undefined) ||
    undefined;

  let stored: Awaited<ReturnType<typeof findDemoOrder>>;
  let freshRegistryToken: string | null = tokenParam?.trim() || null;
  let loadError: string | null = null;

  try {
    stored = await findDemoOrder({
      id: lookupId,
      email: emailParam,
      plan: planParam,
      paymentProviderRef: sessionId,
    });
  } catch (err) {
    captureException(err, { route: "orders/[token]", phase: "lookup" });
    stored = undefined;
    loadError = "Could not load order from the database yet.";
  }

  if (sessionId && (!stored || !freshRegistryToken)) {
    try {
      const fulfilled = await fulfillStripeSessionId(sessionId);
      if (fulfilled) {
        stored = fulfilled.order;
        if (fulfilled.created || fulfilled.registryToken) {
          freshRegistryToken = fulfilled.registryToken || freshRegistryToken;
        }
        loadError = null;
      }
    } catch (err) {
      captureException(err, { route: "orders/[token]", phase: "fulfill" });
      loadError =
        loadError ||
        "Payment received — order fulfillment is still catching up. Refresh in a moment.";
    }
  }

  const plan = stored?.planKey ?? planParam ?? "personal";
  const material = stored?.materialSlug ?? materialParam ?? "ink-dither";
  const license = getLicensePlan(plan);
  const planLabel = license?.name ?? (plan === "team" ? "Team" : "Personal");
  const orderRef = stored?.id ?? token;
  const registryToken = freshRegistryToken || stored?.registryToken || null;
  const email = stored?.email ?? emailParam ?? null;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <MarketingNavbar />
      <main className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <div className="space-y-6 border border-border p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="font-instrument text-3xl font-normal tracking-tight">
              You&apos;re in
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {planLabel} license confirmed
              {email ? (
                <>
                  {" "}
                  for <span className="font-mono text-foreground">{email}</span>
                </>
              ) : null}
              . Install below — save your registry token; it is shown once.
            </p>
          </div>

          {loadError ? (
            <p className="text-sm text-muted-foreground" role="status">
              {loadError}
            </p>
          ) : null}

          <pre className="overflow-x-auto bg-foreground p-4 font-mono text-[12px] leading-relaxed text-background">
            {`npx shadcn@latest add @frameline/${material}\n# order ${orderRef}`}
          </pre>

          {registryToken ? (
            <div className="space-y-2">
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Registry token
              </p>
              <pre className="overflow-x-auto border border-border bg-background p-4 font-mono text-[12px] leading-relaxed text-foreground">
                {registryToken}
              </pre>
              <p className="text-xs text-muted-foreground">
                Pass as{" "}
                <span className="font-mono">Authorization: Bearer …</span> for
                paid registry reads. Copy it now — we only store a hash.
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {sessionId
                ? "Payment received — if your token is not here yet, refresh in a moment (webhook may still be landing)."
                : "No registry token on this confirmation. Run checkout again or open the link from your receipt."}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button nativeButton={false} render={<Link href={`/docs/installation?material=${material}`} />}>
              Open install docs
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/account" />}
              variant="outline"
            >
              Go to account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
