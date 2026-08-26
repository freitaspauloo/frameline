import { InferenceHeader } from "./_components/header";
import { AgentBlocks } from "./_components/sections/agent-blocks";
import { ComposerBlocks } from "./_components/sections/composer-blocks";
import { ConversationBlocks } from "./_components/sections/conversation-blocks";
import { DevBlocks } from "./_components/sections/dev-blocks";
import { KnowledgeBlocks } from "./_components/sections/knowledge-blocks";
import { PrimitiveBlocks } from "./_components/sections/primitive-blocks";
import { InferenceWorkspace } from "./_components/workspace";

export default function InferencePage() {
  return (
    <>
      <InferenceHeader />

      <section
        className="h-[calc(100svh-3.25rem)] min-h-[40rem] border-border border-b"
        id="workspace"
      >
        <InferenceWorkspace />
      </section>

      <ConversationBlocks />
      <ComposerBlocks />
      <AgentBlocks />
      <KnowledgeBlocks />
      <DevBlocks />
      <PrimitiveBlocks />

      <footer className="border-border border-t">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <p className="text-muted-foreground text-xs">
            Blocks vendored from the shadcn chat registry, the Vercel AI Elements
            registry and the two zero-dependency inference.sh blocks. Nothing on
            this route calls a model, a gateway or an API.
          </p>
        </div>
      </footer>
    </>
  );
}
