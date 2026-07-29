import {
  WfBlock,
  WfBtn,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default async function WireframeOrderPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <WireframeShell
      flow="Paid"
      nextHref="/wireframes/account"
      nextLabel="Account"
      route={`/wireframes/orders/${token}`}
      title="Confirmation"
    >
      <div className="mx-auto max-w-xl space-y-6 rounded-relay-lg border border-relay-border bg-relay-white p-6 shadow-relay-sm">
        <div className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-relay-blue text-sm font-medium text-relay-white">
            ✓
          </div>
          <WfTitle className="text-2xl sm:text-3xl">You&apos;re in</WfTitle>
          <WfMuted>
            Install command above the fold. Account holds this license for
            reinstalls.
          </WfMuted>
        </div>

        <WfBlock
          className="space-y-2 border-0 p-4 font-mono text-[12px] leading-relaxed"
          dark
        >
          <p>npx shadcn@latest add @frameline/ink-dither</p>
          <p className="text-relay-tertiary"># registry token minted for {token}</p>
        </WfBlock>

        <div className="flex flex-wrap gap-3">
          <WfBtn href="/wireframes/docs/installation">Open install docs</WfBtn>
          <WfBtn href="/wireframes/account" variant="secondary">
            Go to account
          </WfBtn>
        </div>
      </div>
    </WireframeShell>
  );
}
