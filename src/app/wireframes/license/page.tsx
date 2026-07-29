import {
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default function WireframeLicensePage() {
  return (
    <WireframeShell flow="Shared" route="/wireframes/license" title="License">
      <div className="mx-auto max-w-2xl space-y-4">
        <WfTitle>License</WfTitle>
        <WfMuted>
          Full commercial terms — plain language first, legal text second.
        </WfMuted>
        <div className="space-y-3 rounded-relay-lg border border-relay-border bg-relay-white p-6 text-sm leading-relaxed text-relay-secondary">
          <p>
            Free materials: use in personal and commercial projects with
            attribution optional.
          </p>
          <p>
            Personal / Team: source ownership for entitled SKUs, client-work
            rights on Team, no resale of the catalog itself.
          </p>
          <p className="font-mono text-[11px] text-relay-tertiary">
            Wireframe placeholder — final terms TBD.
          </p>
        </div>
      </div>
    </WireframeShell>
  );
}
