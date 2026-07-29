import {
  WfBlock,
  WfBtn,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default function WireframeInstallDocsPage() {
  return (
    <WireframeShell
      flow="Docs"
      nextHref="/wireframes/materials"
      nextLabel="Back to catalog"
      route="/wireframes/docs/installation"
      title="Install"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <WfTitle>Installation</WfTitle>
          <WfMuted>
            CLI or copy-paste. Source lands in your repo — you own it.
          </WfMuted>
        </div>

        <WfBlock className="space-y-3 border-0 p-5 font-mono text-[13px] leading-relaxed" dark>
          <p className="text-relay-tertiary"># shadcn-compatible registry</p>
          <p>npx shadcn@latest add @frameline/aurora-mesh</p>
          <p className="text-relay-tertiary"># or copy the component from docs</p>
        </WfBlock>

        <div className="rounded-relay-lg border border-relay-border bg-relay-white p-5 space-y-3">
          <p className="text-sm font-medium text-relay-ink">Then import</p>
          <WfBlock className="border-0 p-4 font-mono text-[12px]" dark>
            {`import { AuroraMesh } from "@/components/ui/aurora-mesh"`}
          </WfBlock>
          <div className="flex flex-wrap gap-3 pt-2">
            <WfBtn href="/wireframes/docs">Docs hub</WfBtn>
            <WfBtn href="/wireframes/materials" variant="secondary">
              Browse more
            </WfBtn>
          </div>
        </div>
      </div>
    </WireframeShell>
  );
}
