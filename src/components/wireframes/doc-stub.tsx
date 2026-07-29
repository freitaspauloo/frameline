import {
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default function WireframeDocStub({
  title,
  route,
  blurb,
}: {
  title: string;
  route: string;
  blurb: string;
}) {
  return (
    <WireframeShell flow="Docs" route={route} title={title}>
      <div className="mx-auto max-w-2xl space-y-3">
        <WfTitle>{title}</WfTitle>
        <WfMuted>{blurb}</WfMuted>
        <div className="mt-8 space-y-3 rounded-relay-lg border border-relay-border bg-relay-white p-6">
          <div className="h-3 w-40 rounded-relay-sm bg-relay-border" />
          <div className="h-3 w-full rounded-relay-sm bg-relay-muted" />
          <div className="h-3 w-5/6 rounded-relay-sm bg-relay-muted" />
          <div className="h-3 w-4/5 rounded-relay-sm bg-relay-muted" />
          <div className="mt-4 h-32 rounded-relay-md bg-relay-panel" />
        </div>
      </div>
    </WireframeShell>
  );
}
