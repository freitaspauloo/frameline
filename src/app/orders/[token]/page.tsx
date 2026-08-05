import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";
import { findDemoOrder } from "@/lib/fulfillment";
import { getLicensePlan } from "@/lib/license-plans";
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

  let stored = await findDemoOrder({
    id: lookupId,
    email: emailParam,
    plan: planParam,
    paymentProviderRef: sessionId,
  });

  let freshRegistryToken: string | null = tokenParam?.trim() || null;

  if (sessionId && (!stored || !freshRegistryToken)) {
    try {
      const fulfilled = await fulfillStripeSessionId(sessionId);
      if (fulfilled) {
        stored = fulfilled.order;
        if (fulfilled.created || fulfilled.registryToken) {
          freshRegistryToken = fulfilled.registryToken || freshRegistryToken;
        }
      }
    } catch {
      // Webhook may still be in flight; page still renders with whatever we have.
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
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <div className="space-y-6 rounded-relay-lg border border-relay-border bg-relay-panel p-6 shadow-relay-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-relay-blue text-sm font-medium text-relay-white">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              You&apos;re in
            </h1>
            <p className="text-sm leading-relaxed text-relay-secondary">
              {planLabel} license confirmed
              {email ? (
                <>
                  {" "}
                  for{" "}
                  <span className="font-mono text-relay-ink">{email}</span>
                </>
              ) : null}
              . Install below — save your registry token; it is shown once.
            </p>
          </div>

          <pre className="overflow-x-auto rounded-relay-md bg-relay-ink p-4 font-mono text-[12px] leading-relaxed text-relay-white">
            {`npx shadcn@latest add @frameline/${material}\n# order ${orderRef}`}
          </pre>

          {registryToken ? (
            <div className="space-y-2">
              <p className="text-[0.625rem] font-semibold tracking-widest text-relay-secondary uppercase">
                Registry token
              </p>
              <pre className="overflow-x-auto rounded-relay-md border border-relay-border bg-relay-white p-4 font-mono text-[12px] leading-relaxed text-relay-ink">
                {registryToken}
              </pre>
              <p className="text-xs text-relay-secondary">
                Pass as{" "}
                <span className="font-mono">Authorization: Bearer …</span> for
                paid registry reads. Copy it now — we only store a hash.
              </p>
            </div>
          ) : (
            <p className="text-xs text-relay-secondary">
              {sessionId
                ? "Payment received — if your token is not here yet, refresh in a moment (webhook may still be landing)."
                : "No registry token on this confirmation. Run checkout again or open the link from your receipt."}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <RelayButton
              nativeButton={false}
              render={
                <Link href={`/docs/installation?material=${material}`} />
              }
            >
              Open install docs
            </RelayButton>
            <RelayButton
              nativeButton={false}
              render={<Link href="/account" />}
              variant="secondary"
            >
              Go to account
            </RelayButton>
          </div>
        </div>
      </main>
    </div>
  );
}
