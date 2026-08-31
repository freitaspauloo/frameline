"use client";

import {
  RiChat3Line,
  RiFileCopyLine,
  RiRefreshLine,
  RiThumbDownLine,
  RiThumbUpLine,
} from "@remixicon/react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";
import { Checkpoint, CheckpointTrigger } from "@/components/ai-elements/checkpoint";

import { KitBlock, KitSection } from "../kit-block";

const SHORT_TURNS = [
  { from: "user" as const, id: "c1", text: "Which screens are missing a poster?" },
  {
    from: "assistant" as const,
    id: "c2",
    text: "Two: `hero-dither` and `token-atlas`. Run `pnpm posters hero-dither token-atlas` and commit the PNGs under `public/screens/<slug>/`.",
  },
  { from: "user" as const, id: "c3", text: "Does that touch the catalog order?" },
  {
    from: "assistant" as const,
    id: "c4",
    text: "No. Poster capture is independent of `SCREENS_CATALOG` order — but new screens still get **prepended**, never appended.",
  },
];

const BRANCHES = [
  "Prepend the screen to `SCREENS_CATALOG` so it lands at the top of the grid.",
  "Add it to `SCREENS_CATALOG` — the array order is the display order, so index 0 is the newest.",
  "`SCREENS_CATALOG[0]` is what the homepage rotation strip reads first, so put it there.",
];

export function ConversationBlocks() {
  return (
    <KitSection
      description="The stacked conversation view from AI Elements, plus its empty state, branch selector and per-message action toolbar. Every turn below is a literal in this file."
      eyebrow="ai-elements"
      id="conversation"
      title="Conversation & messages"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <KitBlock
          bodyClassName="p-0"
          source="ai-elements/conversation"
          title="Conversation, stick-to-bottom"
        >
          <Conversation className="relative h-80">
            <ConversationContent>
              {SHORT_TURNS.map((turn) => (
                <Message from={turn.from} key={turn.id}>
                  <MessageContent>
                    <MessageResponse>{turn.text}</MessageResponse>
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </KitBlock>

        <KitBlock
          bodyClassName="p-0"
          source="ai-elements/conversation"
          title="Empty state"
        >
          <Conversation className="relative h-80">
            <ConversationContent>
              <ConversationEmptyState
                description="Pick a prompt from the library or start typing. Nothing here calls a model."
                icon={<RiChat3Line className="size-6" />}
                title="No turns yet"
              />
            </ConversationContent>
          </Conversation>
        </KitBlock>

        <KitBlock
          className="lg:col-span-2"
          note="Three canned regenerations behind the branch pager."
          source="ai-elements/message"
          title="Branches + message actions"
        >
          <Message from="assistant">
            <MessageBranch defaultBranch={0}>
              <MessageBranchContent>
                {BRANCHES.map((branch) => (
                  <MessageContent key={branch}>
                    <MessageResponse>{branch}</MessageResponse>
                  </MessageContent>
                ))}
              </MessageBranchContent>
              <MessageToolbar>
                <MessageBranchSelector>
                  <MessageBranchPrevious />
                  <MessageBranchPage />
                  <MessageBranchNext />
                </MessageBranchSelector>
                <MessageActions>
                  <MessageAction label="Retry" tooltip="Regenerate">
                    <RiRefreshLine className="size-4" />
                  </MessageAction>
                  <MessageAction label="Like" tooltip="Good answer">
                    <RiThumbUpLine className="size-4" />
                  </MessageAction>
                  <MessageAction label="Dislike" tooltip="Bad answer">
                    <RiThumbDownLine className="size-4" />
                  </MessageAction>
                  <MessageAction label="Copy" tooltip="Copy to clipboard">
                    <RiFileCopyLine className="size-4" />
                  </MessageAction>
                </MessageActions>
              </MessageToolbar>
            </MessageBranch>
          </Message>
        </KitBlock>

        <KitBlock
          className="lg:col-span-2"
          note="Marks a restorable point mid-session."
          source="ai-elements/checkpoint"
          title="Checkpoint"
        >
          <Checkpoint>
            <CheckpointTrigger tooltip="Restore to this checkpoint">
              Restore · plate-dither@4f2a1c
            </CheckpointTrigger>
          </Checkpoint>
        </KitBlock>
      </div>
    </KitSection>
  );
}
