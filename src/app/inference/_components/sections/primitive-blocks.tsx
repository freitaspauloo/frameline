"use client";

import {
  RiCheckLine,
  RiChat3Line,
  RiCloseLine,
  RiFileTextLine,
  RiImageLine,
  RiRobot2Line,
  RiSettings3Line,
  RiTerminalBoxLine,
} from "@remixicon/react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Spinner } from "@/components/ui/spinner";
import { SidebarLight, type NavItem } from "@/components/infsh/sidebar-light";
import { Step, Steps } from "@/components/infsh/steps";

import { KitBlock, KitSection } from "../kit-block";

const BUBBLE_VARIANTS = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
] as const;

const SCROLLER_TURNS = Array.from({ length: 12 }, (_, index) => ({
  align: index % 2 === 0 ? ("end" as const) : ("start" as const),
  id: `sc_${index}`,
  text:
    index % 2 === 0
      ? `Turn ${index + 1} — user asks about the plate contract.`
      : `Turn ${index + 1} — assistant answers with the token ramp and the poster path.`,
}));

const INFSH_NAV: NavItem[] = [
  {
    href: "#",
    icon: RiRobot2Line,
    items: [
      { href: "#conversation", title: "Conversation" },
      { href: "#composer", title: "Composers" },
      { href: "#agents", title: "Agents & tools" },
    ],
    title: "Kit",
  },
  {
    href: "#",
    icon: RiTerminalBoxLine,
    items: [
      { href: "#dev", title: "Code & shells" },
      { href: "#knowledge", title: "Sources" },
    ],
    title: "Signals",
  },
  { href: "#primitives", icon: RiSettings3Line, title: "Primitives" },
];

export function PrimitiveBlocks() {
  return (
    <KitSection
      description="The June 2026 shadcn chat components — bubbles, markers, attachments, the virtualised message scroller — plus the two zero-dependency blocks pulled from the inference.sh registry."
      eyebrow="shadcn/ui · @inferencesh"
      id="primitives"
      title="Chat primitives"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <KitBlock
          note="Seven variants. Alignment follows the parent message."
          source="components/ui/bubble"
          title="Bubble variants"
        >
          <BubbleGroup>
            {BUBBLE_VARIANTS.map((variant) => (
              <Bubble key={variant} variant={variant}>
                <BubbleContent>
                  <span className="font-mono text-xs opacity-70">
                    variant=&quot;{variant}&quot;
                  </span>
                </BubbleContent>
              </Bubble>
            ))}
            <Bubble align="end" variant="tinted">
              <BubbleContent>
                Reactions dock to the bubble edge.
              </BubbleContent>
              <BubbleReactions align="end" side="bottom">
                <span>👍 2</span>
                <span>🔥 1</span>
              </BubbleReactions>
            </Bubble>
          </BubbleGroup>
        </KitBlock>

        <KitBlock
          note="Group, header, content and footer, with both alignments."
          source="components/ui/message"
          title="Message layout"
        >
          <MessageGroup className="gap-4">
            <Message align="end">
              <MessageContent>
                <MessageHeader>You · 09:12</MessageHeader>
                <Bubble align="end" variant="tinted">
                  <BubbleContent>
                    Which token drives the ramp?
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
            <Message>
              <MessageContent>
                <MessageHeader>Surface · 09:12</MessageHeader>
                <Bubble variant="muted">
                  <BubbleContent>
                    <code className="font-mono text-xs">--muted</code>, with{" "}
                    <code className="font-mono text-xs">--background</code> as
                    the first stop.
                  </BubbleContent>
                </Bubble>
                <MessageFooter>
                  <RiCheckLine className="mr-1 size-3" />
                  Delivered
                </MessageFooter>
              </MessageContent>
            </Message>
          </MessageGroup>
        </KitBlock>

        <KitBlock
          note="Default, separator and border variants."
          source="components/ui/marker"
          title="Markers"
        >
          <div className="flex flex-col gap-4">
            <Marker>
              <MarkerIcon>
                <RiChat3Line />
              </MarkerIcon>
              <MarkerContent>New conversation</MarkerContent>
            </Marker>
            <Marker variant="separator">
              <MarkerContent>Yesterday</MarkerContent>
            </Marker>
            <Marker variant="border">
              <MarkerContent>Context trimmed · 12 turns dropped</MarkerContent>
            </Marker>
          </div>
        </KitBlock>

        <KitBlock
          note="Idle, uploading, processing, error and done."
          source="components/ui/attachment"
          title="Attachment states"
        >
          <AttachmentGroup>
            <Attachment size="sm" state="done">
              <AttachmentMedia>
                <RiImageLine />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>hero-current.png</AttachmentTitle>
                <AttachmentDescription>PNG · 1920×1080</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label="Remove attachment">
                  <RiCloseLine />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
            <Attachment size="sm" state="uploading">
              <AttachmentMedia>
                <Spinner />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>plate-capture.mp4</AttachmentTitle>
                <AttachmentDescription>Uploading · 62%</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment size="sm" state="error">
              <AttachmentMedia>
                <RiFileTextLine />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>tokens.json</AttachmentTitle>
                <AttachmentDescription>Rejected · 24 MB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment orientation="vertical" size="sm" state="idle">
              <AttachmentMedia>
                <RiImageLine />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>Drop a file</AttachmentTitle>
              </AttachmentContent>
            </Attachment>
          </AttachmentGroup>
        </KitBlock>

        <KitBlock
          bodyClassName="p-0"
          className="lg:col-span-2"
          note="Content-visibility virtualisation with a scroll-to-end button."
          source="components/ui/message-scroller"
          title="Message scroller"
        >
          <MessageScrollerProvider autoScroll defaultScrollPosition="end">
            <MessageScroller className="h-72">
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-3 p-4">
                  {SCROLLER_TURNS.map((turn, index) => (
                    <MessageScrollerItem
                      key={turn.id}
                      messageId={turn.id}
                      scrollAnchor={index === SCROLLER_TURNS.length - 1}
                    >
                      <Message align={turn.align}>
                        <MessageContent>
                          <Bubble
                            align={turn.align}
                            variant={turn.align === "end" ? "tinted" : "muted"}
                          >
                            <BubbleContent>{turn.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </KitBlock>

        <KitBlock
          note="Zero-dependency nav block. The SDK-backed chat/agent/tools blocks were skipped."
          source="components/infsh/sidebar-light"
          title="inference.sh · sidebar-light"
        >
          <SidebarLight
            className="max-w-xs"
            items={INFSH_NAV}
            pathname="#primitives"
          />
        </KitBlock>

        <KitBlock
          source="components/infsh/steps"
          title="inference.sh · steps"
        >
          <Steps titleSize="p">
            <Step title="Vendor the kit">
              <p className="text-muted-foreground text-sm">
                <code className="font-mono">npx shadcn@latest add</code> against
                the AI Elements registry.
              </p>
            </Step>
            <Step title="Reconcile the primitives">
              <p className="text-muted-foreground text-sm">
                Base UI replaces Radix here, so hover delays and{" "}
                <code className="font-mono">render</code> props need a pass.
              </p>
            </Step>
            <Step title="Compose">
              <p className="text-muted-foreground text-sm">
                Wire the blocks into a workspace with static state.
              </p>
            </Step>
          </Steps>
        </KitBlock>
      </div>
    </KitSection>
  );
}
