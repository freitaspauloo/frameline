"use client";

import { RiCheckLine, RiGlobalLine, RiImageLine, RiMicLine } from "@remixicon/react";
import type { ChatStatus } from "ai";
import { useCallback, useState } from "react";

import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MOCK_MODELS, MOCK_SUGGESTIONS } from "../../_lib/mock-data";
import { KitBlock, KitSection } from "../kit-block";

const STATIC_ATTACHMENTS = [
  {
    filename: "hero-current.png",
    id: "att_1",
    mediaType: "image/png",
    type: "file" as const,
    url: "",
  },
  {
    filename: "globals.css",
    id: "att_2",
    mediaType: "text/css",
    type: "file" as const,
    url: "",
  },
  {
    filename: "stage-contract.pdf",
    id: "att_3",
    mediaType: "application/pdf",
    type: "file" as const,
    url: "",
  },
];

const STATUSES: ChatStatus[] = ["ready", "submitted", "streaming", "error"];

const noop = () => {
  // Static demo — the composer never dispatches anything.
};

function StatusComposer({ status }: { status: ChatStatus }) {
  return (
    <PromptInputProvider initialInput={`status="${status}"`}>
      <PromptInput onSubmit={noop}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <PromptInputSubmit onStop={noop} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}

export function ComposerBlocks() {
  const [model, setModel] = useState(MOCK_MODELS[0]?.id ?? "surface-large");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [transcript, setTranscript] = useState("");

  const selected = MOCK_MODELS.find((entry) => entry.id === model);

  const handlePick = useCallback((id: string) => {
    setModel(id);
    setPickerOpen(false);
  }, []);

  return (
    <KitSection
      description="Every composer surface the kit ships: the bare input, the attachment tray, the four submit states, the command-palette model picker and the suggestion rail."
      eyebrow="ai-elements"
      id="composer"
      title="Text composers"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <KitBlock
          note="Attachment tray, action menu, web toggle, dictation, submit."
          source="ai-elements/prompt-input"
          title="Full composer"
        >
          <PromptInputProvider>
            <PromptInput globalDrop multiple onSubmit={noop}>
              <PromptInputHeader>
                <Attachments variant="inline">
                  {STATIC_ATTACHMENTS.map((attachment) => (
                    <Attachment data={attachment} key={attachment.id}>
                      <AttachmentPreview />
                      <AttachmentInfo />
                      <AttachmentRemove />
                    </Attachment>
                  ))}
                </Attachments>
              </PromptInputHeader>
              <PromptInputBody>
                <PromptInputTextarea placeholder="Describe the surface you want…" />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <PromptInputButton variant="secondary">
                    <RiGlobalLine className="size-4" />
                    <span>Search</span>
                  </PromptInputButton>
                  <PromptInputButton tooltip="Attach an image">
                    <RiImageLine className="size-4" />
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit status="ready" />
              </PromptInputFooter>
            </PromptInput>
          </PromptInputProvider>
        </KitBlock>

        <KitBlock
          note="Command palette over the model list. Logos are skipped so the block stays offline."
          source="ai-elements/model-selector"
          title="Model picker"
        >
          <div className="flex flex-col gap-3">
            <ModelSelector onOpenChange={setPickerOpen} open={pickerOpen}>
              <ModelSelectorTrigger
                render={<Button className="w-fit" variant="outline" />}
              >
                {selected?.name ?? "Pick a model"}
              </ModelSelectorTrigger>
              <ModelSelectorContent>
                <ModelSelectorInput placeholder="Search models…" />
                <ModelSelectorList>
                  <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                  {["Frameline", "Atlas", "Quartz"].map((vendor) => (
                    <ModelSelectorGroup key={vendor}>
                      {MOCK_MODELS.filter(
                        (entry) => entry.vendor === vendor,
                      ).map((entry) => (
                        <ModelSelectorItem
                          key={entry.id}
                          onClick={() => handlePick(entry.id)}
                          value={entry.id}
                        >
                          <ModelSelectorName>{entry.name}</ModelSelectorName>
                          <span className="text-muted-foreground text-xs">
                            {entry.context}
                          </span>
                          {model === entry.id ? (
                            <RiCheckLine className="ml-auto size-4" />
                          ) : (
                            <span className="ml-auto size-4" />
                          )}
                        </ModelSelectorItem>
                      ))}
                    </ModelSelectorGroup>
                  ))}
                </ModelSelectorList>
              </ModelSelectorContent>
            </ModelSelector>
            <p className="text-muted-foreground text-xs">
              Selected: <code className="font-mono">{model}</code> ·{" "}
              {selected?.note}
            </p>
          </div>
        </KitBlock>

        <KitBlock
          className="lg:col-span-2"
          note="ChatStatus drives the submit affordance — spinner, stop square, error cross."
          source="ai-elements/prompt-input"
          title="Submit states"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STATUSES.map((status) => (
              <StatusComposer key={status} status={status} />
            ))}
          </div>
        </KitBlock>

        <KitBlock
          source="ai-elements/suggestion"
          title="Suggestion rail"
        >
          <Suggestions>
            {MOCK_SUGGESTIONS.map((suggestion) => (
              <Suggestion key={suggestion} suggestion={suggestion} />
            ))}
          </Suggestions>
        </KitBlock>

        <KitBlock
          note="Web Speech API when the browser has it, MediaRecorder otherwise. No transcription service is wired up."
          source="ai-elements/speech-input"
          title="Dictation + empty composer"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <SpeechInput onTranscriptionChange={setTranscript} />
              <span className="text-muted-foreground text-xs">
                {transcript || "Nothing captured yet."}
              </span>
            </div>
            <Empty className="border border-border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <RiMicLine />
                </EmptyMedia>
                <EmptyTitle>Composer is empty</EmptyTitle>
                <EmptyDescription>
                  Drop a file, dictate, or pick a prompt from the library.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" variant="outline">
                  Open prompt library
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </KitBlock>
      </div>
    </KitSection>
  );
}
