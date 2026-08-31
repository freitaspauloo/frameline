"use client";

// ArtifactAction types its `icon` prop as LucideIcon, so this block stays on
// lucide rather than being forced onto remixicon.
import { CopyIcon, RefreshCcwIcon, XIcon } from "lucide-react";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { Image as GeneratedImage } from "@/components/ai-elements/image";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "@/components/ai-elements/inline-citation";
import { MessageResponse } from "@/components/ai-elements/message";
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInLabel,
  OpenInSeparator,
  OpenInTrigger,
  OpenInv0,
} from "@/components/ai-elements/open-in-chat";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";

import {
  MOCK_CONSOLE_LOGS,
  MOCK_IMAGE_BASE64,
  MOCK_SOURCES,
} from "../../_lib/mock-data";
import { KitBlock, KitSection } from "../kit-block";

/** The trigger parses each entry with `new URL`, so it wants full hrefs. */
const CITED_URLS = MOCK_SOURCES.map((source) => source.href);

export function KnowledgeBlocks() {
  return (
    <KitSection
      description="How an answer shows its work: the collapsible source list, inline citations with a hover carousel, artifacts, generated images and a sandboxed web preview."
      eyebrow="ai-elements"
      id="knowledge"
      title="Sources, citations & artifacts"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <KitBlock source="ai-elements/sources" title="Source list">
          <Sources>
            <SourcesTrigger count={MOCK_SOURCES.length} />
            <SourcesContent>
              {MOCK_SOURCES.map((source) => (
                <Source
                  href={source.href}
                  key={source.href}
                  title={source.title}
                />
              ))}
            </SourcesContent>
          </Sources>
        </KitBlock>

        <KitBlock
          note="Hover the badge to page through the cited passages."
          source="ai-elements/inline-citation"
          title="Inline citation"
        >
          <p className="text-sm leading-relaxed">
            Stage plates are locked to 1920×1080 so the catalog thumbnail and the
            captured poster never disagree{" "}
            <InlineCitation>
              <InlineCitationText> </InlineCitationText>
              <InlineCitationCard>
                <InlineCitationCardTrigger sources={CITED_URLS} />
                <InlineCitationCardBody>
                  <InlineCitationCarousel>
                    <InlineCitationCarouselHeader>
                      <InlineCitationCarouselPrev />
                      <InlineCitationCarouselIndex />
                      <InlineCitationCarouselNext />
                    </InlineCitationCarouselHeader>
                    <InlineCitationCarouselContent>
                      {MOCK_SOURCES.map((source) => (
                        <InlineCitationCarouselItem key={source.href}>
                          <InlineCitationSource
                            description={source.title}
                            title={new URL(source.href).host}
                            url={source.href}
                          />
                          <InlineCitationQuote>
                            {source.quote}
                          </InlineCitationQuote>
                        </InlineCitationCarouselItem>
                      ))}
                    </InlineCitationCarouselContent>
                  </InlineCitationCarousel>
                </InlineCitationCardBody>
              </InlineCitationCard>
            </InlineCitation>
            , and every colour resolves through the semantic token layer.
          </p>
        </KitBlock>

        <KitBlock
          bodyClassName="p-0"
          note="Side panel for a generated document. Streamdown renders the body."
          source="ai-elements/artifact"
          title="Artifact panel"
        >
          <Artifact className="border-0">
            <ArtifactHeader>
              <div className="min-w-0">
                <ArtifactTitle>stage-plate-contract.md</ArtifactTitle>
                <ArtifactDescription>
                  Draft · 2 revisions · not saved
                </ArtifactDescription>
              </div>
              <ArtifactActions>
                <ArtifactAction
                  icon={RefreshCcwIcon}
                  label="Regenerate"
                  tooltip="Regenerate"
                />
                <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy" />
                <ArtifactAction icon={XIcon} label="Close" tooltip="Close" />
              </ArtifactActions>
            </ArtifactHeader>
            <ArtifactContent>
              <MessageResponse>
                {`## Stage plate contract

- Plates render at **1920×1080**. No exceptions.
- Avoid \`100dvh\` on the root when \`embed\` — use \`h-full min-h-0\`.
- Catalog tiles use \`aspect-[16/9]\` with \`object-cover\`.
- Posters live at \`public/screens/<slug>/poster.png\`.`}
              </MessageResponse>
            </ArtifactContent>
          </Artifact>
        </KitBlock>

        <KitBlock
          note="Inline base64, so nothing is fetched."
          source="ai-elements/image"
          title="Generated image"
        >
          <div className="flex items-center gap-4">
            <GeneratedImage
              alt="Checker swatch stand-in for a generated plate"
              base64={MOCK_IMAGE_BASE64}
              className="size-24 border border-border"
              mediaType="image/svg+xml"
              uint8Array={new Uint8Array()}
            />
            <p className="text-muted-foreground text-xs">
              The block takes an{" "}
              <code className="font-mono">Experimental_GeneratedImage</code> and
              turns it into a data URL.
            </p>
          </div>
        </KitBlock>

        <KitBlock
          bodyClassName="p-0"
          note="The iframe is pinned to about:blank — the URL bar is decoration."
          source="ai-elements/web-preview"
          title="Web preview + console"
        >
          <WebPreview
            className="h-96 border-0"
            defaultUrl="https://frameline.ai/screens/hero-dither"
          >
            <WebPreviewNavigation>
              <WebPreviewUrl />
            </WebPreviewNavigation>
            <WebPreviewBody src="about:blank" />
            <WebPreviewConsole logs={MOCK_CONSOLE_LOGS} />
          </WebPreview>
        </KitBlock>

        <KitBlock
          note="Deep links only — clicking opens a third-party chat in a new tab."
          source="ai-elements/open-in-chat"
          title="Open in…"
        >
          <OpenIn query="Explain the Frameline stage plate contract">
            <OpenInTrigger />
            <OpenInContent>
              <OpenInLabel>Continue elsewhere</OpenInLabel>
              <OpenInChatGPT />
              <OpenInClaude />
              <OpenInSeparator />
              <OpenInv0 />
              <OpenInCursor />
            </OpenInContent>
          </OpenIn>
        </KitBlock>
      </div>
    </KitSection>
  );
}
