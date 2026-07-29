import {
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default function WireframeAboutPage() {
  return (
    <WireframeShell flow="Shared" route="/wireframes/about" title="About">
      <div className="mx-auto max-w-2xl space-y-4">
        <WfTitle>About Frameline</WfTitle>
        <WfMuted className="text-base">
          A commercial surface & materials system for design engineers —
          production-ready animated materials delivered as typed React
          components.
        </WfMuted>
        <div className="rounded-relay-lg border border-relay-border bg-relay-white p-6 space-y-3">
          <p className="text-sm leading-relaxed text-relay-secondary">
            Craft is the product. Free materials meet the same quality bar as
            paid — paid unlocks depth, signature work, and commercial clarity.
          </p>
        </div>
      </div>
    </WireframeShell>
  );
}
