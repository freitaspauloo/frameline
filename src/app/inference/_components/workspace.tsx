"use client";

import {
  RiAddLine,
  RiAttachment2,
  RiBookmarkLine,
  RiBrainLine,
  RiChat3Line,
  RiFileTextLine,
  RiGlobalLine,
  RiImageLine,
  RiLayoutLeftLine,
  RiRobot2Line,
  RiSearchLine,
  RiSettings3Line,
  RiSparkling2Line,
  RiTerminalBoxLine,
} from "@remixicon/react";
import type { ChatStatus } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { MessageResponse } from "@/components/ai-elements/message";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/components/ai-elements/task";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Marker, MarkerContent } from "@/components/ui/marker";
import {
  Message,
  MessageContent,
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
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import {
  MOCK_AGENTS,
  MOCK_ASSISTANT_REPLY,
  MOCK_MODELS,
  MOCK_PROMPTS,
  MOCK_REASONING,
  MOCK_SOURCES,
  MOCK_SUGGESTIONS,
  MOCK_TASK_STEPS,
  MOCK_THREADS,
  MOCK_TOOL_INPUT,
  MOCK_TOOL_OUTPUT,
  MOCK_USER_PROMPT,
} from "../_lib/mock-data";

const STREAM_TICK_MS = 24;
const STREAM_CHUNK = 6;
const SUBMIT_DELAY_MS = 260;

interface Turn {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Only the seeded assistant turn carries the full agent-session trimmings. */
  rich?: boolean;
  attachments?: { kind: "image" | "file"; name: string; meta: string }[];
}

const SEEDED_TURNS: Turn[] = [
  {
    attachments: [
      { kind: "image", meta: "PNG · 1920×1080", name: "hero-current.png" },
      { kind: "file", meta: "CSS · 12 KB", name: "globals.css" },
    ],
    id: "turn_user_1",
    role: "user",
    text: MOCK_USER_PROMPT,
  },
  {
    id: "turn_assistant_1",
    rich: true,
    role: "assistant",
    text: MOCK_ASSISTANT_REPLY,
  },
];

function ThreadList() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarGroupAction title="New conversation">
        <RiAddLine />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {MOCK_THREADS.map((thread) => (
            <SidebarMenuItem key={thread.id}>
              <SidebarMenuButton
                className="h-auto flex-col items-start gap-0.5 py-2"
                isActive={thread.active}
                tooltip={thread.title}
              >
                <span className="flex w-full items-center gap-2">
                  <RiChat3Line className="size-3.5 shrink-0 opacity-70" />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {thread.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {thread.updated}
                  </span>
                </span>
                <span className="w-full truncate pl-[1.375rem] text-[11px] text-muted-foreground">
                  {thread.preview}
                </span>
              </SidebarMenuButton>
              {thread.unread ? (
                <SidebarMenuBadge>{thread.unread}</SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AgentList() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Agents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {MOCK_AGENTS.map((agent) => (
            <SidebarMenuItem key={agent.id}>
              <SidebarMenuButton className="h-auto py-2" tooltip={agent.name}>
                <Avatar className="size-5 rounded-none">
                  <AvatarFallback className="rounded-none bg-muted text-[9px]">
                    {agent.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate">{agent.name}</span>
                <span
                  aria-label={agent.status}
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    agent.status === "online" && "bg-emerald-400",
                    agent.status === "busy" && "bg-amber-400",
                    agent.status === "idle" && "bg-muted-foreground/40",
                  )}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function PromptLibrary() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Prompt library</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {MOCK_PROMPTS.map((prompt) => (
            <SidebarMenuItem key={prompt.id}>
              <SidebarMenuButton tooltip={prompt.label}>
                <RiBookmarkLine className="size-3.5 opacity-70" />
                <span className="min-w-0 flex-1 truncate">{prompt.label}</span>
                {prompt.shortcut ? (
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {prompt.shortcut}
                  </span>
                ) : null}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const SETTINGS_STUBS = [
  { icon: RiBrainLine, label: "Model defaults" },
  { icon: RiTerminalBoxLine, label: "Tool permissions" },
  { icon: RiSettings3Line, label: "Workspace" },
];

function SettingsStubs() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {SETTINGS_STUBS.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton tooltip={item.label}>
                <item.icon className="size-3.5 opacity-70" />
                <span>{item.label}</span>
                <Badge
                  className="ml-auto font-mono text-[9px]"
                  variant="outline"
                >
                  stub
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function UserAttachments({ turn }: { turn: Turn }) {
  if (!turn.attachments?.length) {
    return null;
  }

  return (
    <AttachmentGroup className="justify-end">
      {turn.attachments.map((attachment) => (
        <Attachment key={attachment.name} size="sm">
          <AttachmentMedia>
            {attachment.kind === "image" ? (
              <RiImageLine />
            ) : (
              <RiFileTextLine />
            )}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{attachment.name}</AttachmentTitle>
            <AttachmentDescription>{attachment.meta}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}

function AgentTrimmings() {
  return (
    <div className="flex flex-col gap-3">
      <Reasoning defaultOpen>
        <ReasoningTrigger />
        <ReasoningContent>{MOCK_REASONING}</ReasoningContent>
      </Reasoning>

      <Task defaultOpen>
        <TaskTrigger title="Read 4 files, 52 scanned" />
        <TaskContent>
          {MOCK_TASK_STEPS.map((step) => (
            <TaskItem key={step}>{step}</TaskItem>
          ))}
        </TaskContent>
      </Task>

      <Tool defaultOpen>
        <ToolHeader state="output-available" type="tool-search_repo" />
        <ToolContent>
          <ToolInput input={MOCK_TOOL_INPUT} />
          <ToolOutput errorText={undefined} output={MOCK_TOOL_OUTPUT} />
        </ToolContent>
      </Tool>
    </div>
  );
}

function ConversationTurn({ turn }: { turn: Turn }) {
  if (turn.role === "user") {
    return (
      <Message align="end">
        <MessageContent>
          <UserAttachments turn={turn} />
          <Bubble align="end" variant="tinted">
            <BubbleContent>{turn.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    );
  }

  return (
    <Message>
      <MessageContent>
        <MessageHeader className="px-0">
          <RiSparkling2Line className="mr-1.5 size-3.5" />
          Surface · surface-large
        </MessageHeader>
        {turn.rich ? <AgentTrimmings /> : null}
        <Bubble variant="ghost">
          <BubbleContent>
            <MessageResponse>{turn.text}</MessageResponse>
          </BubbleContent>
        </Bubble>
        {turn.rich ? (
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
        ) : null}
      </MessageContent>
    </Message>
  );
}

export function InferenceWorkspace() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [turns, setTurns] = useState<Turn[]>(SEEDED_TURNS);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [model, setModel] = useState(MOCK_MODELS[0]?.id ?? "surface-large");
  const [webSearch, setWebSearch] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const streamTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) {
      clearTimeout(timer);
    }
    timers.current = [];
    if (streamTimer.current) {
      clearInterval(streamTimer.current);
      streamTimer.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /**
   * Fake stream: appends slices of a canned reply on an interval. No fetch, no
   * model, no gateway — the composer just has to *feel* wired up.
   */
  const streamReply = useCallback((replyId: string) => {
    let cursor = 0;
    setStatus("streaming");
    streamTimer.current = setInterval(() => {
      cursor += STREAM_CHUNK;
      const slice = MOCK_ASSISTANT_REPLY.slice(0, cursor);
      setTurns((prev) =>
        prev.map((turn) =>
          turn.id === replyId ? { ...turn, text: slice } : turn,
        ),
      );

      if (cursor >= MOCK_ASSISTANT_REPLY.length) {
        if (streamTimer.current) {
          clearInterval(streamTimer.current);
          streamTimer.current = null;
        }
        setStatus("ready");
      }
    }, STREAM_TICK_MS);
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status !== "ready") {
        return;
      }

      const stamp = Date.now();
      const replyId = `turn_assistant_${stamp}`;
      setTurns((prev) => [
        ...prev,
        { id: `turn_user_${stamp}`, role: "user", text: trimmed },
        { id: replyId, role: "assistant", text: "" },
      ]);
      setStatus("submitted");

      timers.current.push(
        setTimeout(() => streamReply(replyId), SUBMIT_DELAY_MS),
      );
    },
    [status, streamReply],
  );

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => send(message.text),
    [send],
  );

  const handleStop = useCallback(() => {
    clearTimers();
    setStatus("ready");
  }, [clearTimers]);

  const handleToggleWebSearch = useCallback(
    () => setWebSearch((prev) => !prev),
    [],
  );

  const handleModelChange = useCallback((value: unknown) => {
    setModel(String(value));
  }, []);

  const selectedModel = useMemo(
    () => MOCK_MODELS.find((entry) => entry.id === model),
    [model],
  );

  return (
    <SidebarProvider
      className="h-full min-h-0"
      onOpenChange={setPanelOpen}
      open={panelOpen}
    >
      <Sidebar
        className={cn("border-border border-r", !panelOpen && "hidden")}
        collapsible="none"
      >
        <SidebarHeader className="gap-2 border-border border-b">
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="flex size-6 items-center justify-center bg-foreground text-background">
              <RiRobot2Line className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1 truncate font-medium text-sm">
              Inference
            </span>
            <Badge className="font-mono text-[9px]" variant="outline">
              mock
            </Badge>
          </div>
          <Button
            className="w-full justify-start gap-2 text-muted-foreground"
            size="sm"
            variant="outline"
          >
            <RiSearchLine className="size-3.5" />
            Search conversations
            <span className="ml-auto font-mono text-[10px]">⌘K</span>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <ThreadList />
          <AgentList />
          <PromptLibrary />
          <SettingsStubs />
        </SidebarContent>
        <SidebarFooter className="border-border border-t">
          <div className="flex items-center gap-2 px-1 py-1">
            <Avatar className="size-6 rounded-none">
              <AvatarFallback className="rounded-none bg-muted text-[9px]">
                PF
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs">Paulo Freitas</p>
              <p className="truncate text-[10px] text-muted-foreground">
                Design engineer
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-0 min-w-0">
        <div className="flex h-full min-h-0 flex-col">
          <header className="flex shrink-0 items-center gap-2 border-border border-b px-4 py-2">
            <Button
              aria-label="Toggle conversation panel"
              onClick={() => setPanelOpen((prev) => !prev)}
              size="icon-sm"
              variant="ghost"
            >
              <RiLayoutLeftLine />
            </Button>
            <Separator className="h-4" orientation="vertical" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">
                Dither the hero plate
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {selectedModel?.name} · {selectedModel?.context} context ·
                static transcript
              </p>
            </div>
            <Badge className="font-mono text-[10px]" variant="secondary">
              {status}
            </Badge>
          </header>

          {/* Opens on the top of the seeded session so the reasoning, task and
              tool blocks are the first thing you see. */}
          <MessageScrollerProvider autoScroll defaultScrollPosition="start">
            <MessageScroller className="min-h-0 flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
                  <Marker variant="separator">
                    <MarkerContent>Today</MarkerContent>
                  </Marker>
                  {turns.map((turn, index) => (
                    <MessageScrollerItem
                      key={turn.id}
                      messageId={turn.id}
                      scrollAnchor={index === turns.length - 1}
                    >
                      <ConversationTurn turn={turn} />
                    </MessageScrollerItem>
                  ))}
                  <Marker variant="separator">
                    <MarkerContent>
                      Checkpoint · plate-dither@4f2a1c
                    </MarkerContent>
                  </Marker>
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          <div className="shrink-0 border-border border-t bg-background">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4">
              <Suggestions>
                {MOCK_SUGGESTIONS.map((suggestion) => (
                  <Suggestion
                    key={suggestion}
                    onClick={send}
                    suggestion={suggestion}
                  />
                ))}
              </Suggestions>

              <PromptInputProvider>
                <PromptInput globalDrop multiple onSubmit={handleSubmit}>
                  <PromptInputBody>
                    <PromptInputTextarea placeholder="Ask the kit something. Nothing leaves the browser." />
                  </PromptInputBody>
                  <PromptInputFooter>
                    <PromptInputTools>
                      <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger />
                        <PromptInputActionMenuContent>
                          <PromptInputActionAddAttachments />
                        </PromptInputActionMenuContent>
                      </PromptInputActionMenu>
                      <PromptInputButton
                        onClick={handleToggleWebSearch}
                        variant={webSearch ? "secondary" : "ghost"}
                      >
                        <RiGlobalLine className="size-4" />
                        <span>Search</span>
                      </PromptInputButton>
                      <PromptInputButton tooltip="Attach a file">
                        <RiAttachment2 className="size-4" />
                      </PromptInputButton>
                      <PromptInputSelect
                        onValueChange={handleModelChange}
                        value={model}
                      >
                        <PromptInputSelectTrigger className="h-8">
                          <PromptInputSelectValue />
                        </PromptInputSelectTrigger>
                        <PromptInputSelectContent>
                          {MOCK_MODELS.map((entry) => (
                            <PromptInputSelectItem
                              key={entry.id}
                              value={entry.id}
                            >
                              {entry.name}
                            </PromptInputSelectItem>
                          ))}
                        </PromptInputSelectContent>
                      </PromptInputSelect>
                    </PromptInputTools>
                    <PromptInputSubmit onStop={handleStop} status={status} />
                  </PromptInputFooter>
                </PromptInput>
              </PromptInputProvider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
