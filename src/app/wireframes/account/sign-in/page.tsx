import {
  WfBtn,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default function WireframeSignInPage() {
  return (
    <WireframeShell
      flow="Account"
      nextHref="/wireframes/account"
      nextLabel="Licenses"
      route="/wireframes/account/sign-in"
      title="Sign in"
    >
      <div className="mx-auto max-w-md rounded-relay-lg border border-relay-border bg-relay-white p-6 shadow-relay-sm">
        <WfTitle className="text-2xl sm:text-3xl">Recover access</WfTitle>
        <WfMuted className="mt-2">
          Enter the email used at purchase. Magic link — no password.
        </WfMuted>

        <div className="mt-6 space-y-3">
          <label className="block space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-relay-secondary">
              Email
            </span>
            <input
              className="h-11 w-full rounded-relay-md border border-relay-border bg-relay-panel px-3 text-sm outline-none focus:border-relay-blue focus:ring-3 focus:ring-ring"
              placeholder="you@studio.dev"
              type="email"
            />
          </label>
          <WfBtn className="w-full" href="/wireframes/account">
            Send magic link
          </WfBtn>
        </div>
      </div>
    </WireframeShell>
  );
}
