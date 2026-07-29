"use client";

import { Thread } from "@/components/thread";
import {
  LogoMark,
  RelayButton,
} from "@/components/relay-ui";
import {
  AssistantRuntimeProvider,
  type ChatModelAdapter,
  useLocalRuntime,
} from "@assistant-ui/react";
import { useMemo } from "react";

const relayAdapter: ChatModelAdapter = {
  async *run({ messages }) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const last = messages.at(-1);
    let prompt = "";

    if (last?.role === "user") {
      for (const part of last.content) {
        if (part.type === "text") prompt += part.text;
      }
    }

    yield {
      content: [
        {
          type: "text",
          text: prompt
            ? `Got it. I'll turn that into an agent you can read and run.\n\nNext I'll map: trigger → AI step → condition → action. Want me to start building it on the canvas?`
            : "Describe what you want Relay to do.",
        },
      ],
    };
  },
};

function RelayWelcome() {
  return (
    <div className="relay-fade-up flex flex-col items-center px-4 text-center">
      <h1 className="text-[64px] font-semibold tracking-[-0.02em] text-relay-ink">
        Relay
      </h1>
    </div>
  );
}

export function RelayChatApp() {
  const runtime = useLocalRuntime(relayAdapter);

  const threadComponents = useMemo(
    () => ({
      Welcome: RelayWelcome,
    }),
    [],
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex min-h-screen flex-col bg-relay-canvas text-relay-ink">
        <header className="flex h-16 shrink-0 items-center bg-relay-white px-8">
          <LogoMark />
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <RelayButton variant="nav-ghost">Log in</RelayButton>
            <RelayButton variant="nav-cta">Sign up for free</RelayButton>
          </div>
        </header>

        <main className="relative flex min-h-0 flex-1 flex-col">
          <Thread components={threadComponents} />
        </main>

        <footer className="flex shrink-0 flex-col items-center gap-3 pb-7 text-center">
          <nav className="flex items-center gap-6 text-[13px] text-relay-tertiary">
            <a className="transition-colors hover:text-relay-secondary" href="#">
              Docs
            </a>
            <a className="transition-colors hover:text-relay-secondary" href="#">
              Enterprise
            </a>
            <a className="transition-colors hover:text-relay-secondary" href="#">
              Pricing
            </a>
          </nav>
          <p className="max-w-lg text-xs text-relay-tertiary">
            By using Relay, you agree to our Terms and Privacy Policy.
          </p>
        </footer>
      </div>
    </AssistantRuntimeProvider>
  );
}
