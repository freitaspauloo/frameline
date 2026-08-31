"use client";

import {
  RiCheckLine,
  RiCloseLine,
  RiFileTextLine,
  RiSearchLine,
  RiTimeLine,
} from "@remixicon/react";
import type { ToolUIPart } from "ai";
import { useCallback, useState } from "react";

import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentTools,
  AgentTool,
} from "@/components/ai-elements/agent";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan";
import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@/components/ai-elements/queue";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from "@/components/ai-elements/task";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Button } from "@/components/ui/button";

import {
  MOCK_AGENT_TOOLS,
  MOCK_PLAN_STEPS,
  MOCK_QUEUE,
  MOCK_REASONING,
  MOCK_TASK_STEPS,
  MOCK_TOOL_INPUT,
  MOCK_TOOL_OUTPUT,
  MOCK_USAGE,
} from "../../_lib/mock-data";
import { KitBlock, KitSection } from "../kit-block";

const CONTEXT_MAX_TOKENS = 200_000;

/** `approval-requested` etc. are not in the published union yet. */
const asToolState = (state: string) => state as ToolUIPart["state"];

const TOOL_STATES: {
  key: string;
  label: string;
  state: ToolUIPart["state"];
  showInput: boolean;
  output?: string;
  errorText?: string;
}[] = [
  {
    key: "pending",
    label: "Pending — input still streaming",
    showInput: false,
    state: "input-streaming",
  },
  {
    key: "running",
    label: "Running — input settled, no output yet",
    showInput: true,
    state: "input-available",
  },
  {
    key: "result",
    label: "Result",
    output: MOCK_TOOL_OUTPUT,
    showInput: true,
    state: "output-available",
  },
  {
    errorText: "Connection timeout: unable to reach the index",
    key: "error",
    label: "Error",
    showInput: true,
    state: "output-error",
  },
];

function ToolStateStack() {
  return (
    <div className="flex flex-col gap-3">
      {TOOL_STATES.map((entry) => (
        <div className="flex flex-col gap-1.5" key={entry.key}>
          <p className="font-mono text-[11px] text-muted-foreground">
            {entry.label}
          </p>
          <Tool defaultOpen={entry.key === "result"}>
            <ToolHeader
              state={entry.state}
              title="search_repo"
              type="tool-search_repo"
            />
            <ToolContent>
              <ToolInput input={entry.showInput ? MOCK_TOOL_INPUT : {}} />
              {entry.output || entry.errorText ? (
                <ToolOutput
                  errorText={entry.errorText}
                  output={entry.output}
                />
              ) : null}
            </ToolContent>
          </Tool>
        </div>
      ))}
    </div>
  );
}

function ApprovalTool() {
  const [decision, setDecision] = useState<"pending" | "accepted" | "rejected">(
    "pending",
  );

  const accept = useCallback(() => setDecision("accepted"), []);
  const reject = useCallback(() => setDecision("rejected"), []);

  const state =
    decision === "pending"
      ? asToolState("approval-requested")
      : asToolState(decision === "accepted" ? "output-available" : "output-denied");

  return (
    <Tool defaultOpen>
      <ToolHeader state={state} title="capture_poster" type="tool-capture_poster" />
      <ToolContent>
        <ToolInput input={{ slug: "hero-dither", viewport: "1920x1080" }} />
        <Confirmation
          approval={
            decision === "pending"
              ? { id: "apr_1" }
              : { approved: decision === "accepted", id: "apr_1" }
          }
          state={
            decision === "pending"
              ? "approval-requested"
              : decision === "accepted"
                ? "output-available"
                : "output-denied"
          }
        >
          <ConfirmationTitle>
            <ConfirmationRequest>
              This will overwrite public/screens/hero-dither/poster.png.
            </ConfirmationRequest>
            <ConfirmationAccepted>
              <RiCheckLine className="size-4 text-emerald-400" />
              <span>Approved</span>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <RiCloseLine className="size-4 text-destructive" />
              <span>Denied</span>
            </ConfirmationRejected>
          </ConfirmationTitle>
          <ConfirmationActions>
            <ConfirmationAction onClick={reject} variant="outline">
              Deny
            </ConfirmationAction>
            <ConfirmationAction onClick={accept} variant="default">
              Approve
            </ConfirmationAction>
          </ConfirmationActions>
        </Confirmation>
        {decision === "accepted" ? (
          <ToolOutput
            errorText={undefined}
            output={"Captured `public/screens/hero-dither/poster.png` at 1920×1080."}
          />
        ) : null}
      </ToolContent>
    </Tool>
  );
}

function StreamingReasoning() {
  const [streaming, setStreaming] = useState(false);
  const toggle = useCallback(() => setStreaming((prev) => !prev), []);

  return (
    <div className="flex flex-col gap-3">
      <Reasoning defaultOpen isStreaming={streaming}>
        <ReasoningTrigger />
        <ReasoningContent>{MOCK_REASONING}</ReasoningContent>
      </Reasoning>
      <div className="flex items-center gap-3">
        <Button onClick={toggle} size="sm" variant="outline">
          {streaming ? "Stop streaming" : "Simulate streaming"}
        </Button>
        {streaming ? <Shimmer>Thinking…</Shimmer> : null}
      </div>
    </div>
  );
}

export function AgentBlocks() {
  return (
    <KitSection
      description="Agent-session furniture: reasoning, chain of thought, tool cards in every state, human-in-the-loop approval, task lists, plans, the queue and the context meter."
      eyebrow="ai-elements"
      id="agents"
      title="Agents, reasoning & tools"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <KitBlock
          note="Trigger label swaps to a shimmer while isStreaming is true."
          source="ai-elements/reasoning"
          title="Reasoning"
        >
          <StreamingReasoning />
        </KitBlock>

        <KitBlock
          source="ai-elements/chain-of-thought"
          title="Chain of thought"
        >
          <ChainOfThought defaultOpen>
            <ChainOfThoughtHeader>Worked through 4 steps</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              <ChainOfThoughtStep
                label="Read the stage plate contract"
                status="complete"
              />
              <ChainOfThoughtStep
                description="SCREEN_STAGE_WIDTH / SCREEN_STAGE_HEIGHT"
                label="Confirmed 1920×1080 is locked"
                status="complete"
              >
                <ChainOfThoughtSearchResults>
                  <ChainOfThoughtSearchResult>
                    src/screens/stage.tsx
                  </ChainOfThoughtSearchResult>
                  <ChainOfThoughtSearchResult>
                    scripts/capture-posters.mjs
                  </ChainOfThoughtSearchResult>
                </ChainOfThoughtSearchResults>
              </ChainOfThoughtStep>
              <ChainOfThoughtStep
                label="Mapped the token ramp"
                status="active"
              />
              <ChainOfThoughtStep
                label="Draft the reduced-motion fallback"
                status="pending"
              />
            </ChainOfThoughtContent>
          </ChainOfThought>
        </KitBlock>

        <KitBlock
          className="lg:col-span-2"
          note="Pending, running, result and error — plus a live approval card you can accept or deny."
          source="ai-elements/tool · ai-elements/confirmation"
          title="Tool cards"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ToolStateStack />
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[11px] text-muted-foreground">
                Awaiting approval — interactive
              </p>
              <ApprovalTool />
            </div>
          </div>
        </KitBlock>

        <KitBlock source="ai-elements/task" title="Task list">
          <Task defaultOpen>
            <TaskTrigger title="Read 4 files, 52 scanned" />
            <TaskContent>
              {MOCK_TASK_STEPS.map((step) => (
                <TaskItem key={step}>{step}</TaskItem>
              ))}
              <TaskItem>
                <span className="inline-flex items-center gap-1">
                  Read
                  <TaskItemFile>
                    <RiFileTextLine className="size-3.5" />
                    <span>stage.tsx</span>
                  </TaskItemFile>
                </span>
              </TaskItem>
            </TaskContent>
          </Task>
        </KitBlock>

        <KitBlock source="ai-elements/plan" title="Plan">
          <Plan defaultOpen>
            <PlanHeader>
              <PlanTitle>Ship the dithered hero plate</PlanTitle>
              <PlanDescription>
                Four steps, two already landed.
              </PlanDescription>
              <PlanAction>
                <PlanTrigger />
              </PlanAction>
            </PlanHeader>
            <PlanContent>
              <ol className="flex flex-col gap-2">
                {MOCK_PLAN_STEPS.map((step) => (
                  <li className="flex items-start gap-2 text-sm" key={step.label}>
                    <span
                      className={
                        step.status === "complete"
                          ? "mt-1 size-1.5 shrink-0 rounded-full bg-emerald-400"
                          : step.status === "active"
                            ? "mt-1 size-1.5 shrink-0 rounded-full bg-amber-400"
                            : "mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground/40"
                      }
                    />
                    <span className="min-w-0">
                      <span className="block">{step.label}</span>
                      <span className="block text-muted-foreground text-xs">
                        {step.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </PlanContent>
          </Plan>
        </KitBlock>

        <KitBlock source="ai-elements/queue" title="Queue">
          <Queue>
            <QueueSection defaultOpen>
              <QueueSectionTrigger>
                <QueueSectionLabel
                  count={MOCK_QUEUE.length}
                  icon={<RiTimeLine className="size-3.5" />}
                  label="Queued"
                />
              </QueueSectionTrigger>
              <QueueSectionContent>
                <QueueList>
                  {MOCK_QUEUE.map((item, index) => (
                    <QueueItem key={item}>
                      <QueueItemContent>
                        <QueueItemIndicator completed={index === 0} />
                        {item}
                      </QueueItemContent>
                    </QueueItem>
                  ))}
                </QueueList>
              </QueueSectionContent>
            </QueueSection>
          </Queue>
        </KitBlock>

        <KitBlock
          note="Token math only — no model id is passed, so no pricing lookup runs."
          source="ai-elements/context"
          title="Context meter"
        >
          <Context
            maxTokens={CONTEXT_MAX_TOKENS}
            usage={MOCK_USAGE}
            usedTokens={MOCK_USAGE.totalTokens ?? 0}
          >
            <ContextTrigger />
            <ContextContent>
              <ContextContentHeader />
              <ContextContentBody>
                <div className="flex flex-col gap-1">
                  <ContextInputUsage />
                  <ContextOutputUsage />
                  <ContextReasoningUsage />
                  <ContextCacheUsage />
                </div>
              </ContextContentBody>
              <ContextContentFooter />
            </ContextContent>
          </Context>
        </KitBlock>

        <KitBlock
          className="lg:col-span-2"
          note="Instructions plus the tool schemas the agent is allowed to call."
          source="ai-elements/agent"
          title="Agent card"
        >
          <Agent>
            <AgentHeader model="surface-large" name="Surface" />
            <AgentContent>
              <AgentInstructions>
                You are a design engineer for Frameline. Read from the semantic
                token layer, never hardcode a hex, and keep every stage plate at
                1920×1080.
              </AgentInstructions>
              <AgentTools>
                {MOCK_AGENT_TOOLS.map((entry) => (
                  <AgentTool
                    key={entry.key}
                    tool={entry.tool}
                    value={entry.key}
                  />
                ))}
              </AgentTools>
            </AgentContent>
          </Agent>
          <p className="mt-3 flex items-center gap-1.5 text-muted-foreground text-xs">
            <RiSearchLine className="size-3.5" />
            Schemas render through the shared CodeBlock, so highlighting is the
            same as the code section below.
          </p>
        </KitBlock>
      </div>
    </KitSection>
  );
}
