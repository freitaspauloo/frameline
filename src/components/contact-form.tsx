"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setFeedback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setFeedback(data.error ?? "Something went wrong");
        return;
      }

      setStatus("success");
      setFeedback(
        data.message ??
          "Saved to the demo inbox. This is not a live support channel yet.",
      );
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Network error — try again");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("space-y-3", className)} role="status">
        <p className="text-sm leading-relaxed text-foreground">{feedback}</p>
        <button
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onClick={() => {
            setStatus("idle");
            setFeedback(null);
          }}
          type="button"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className={cn("space-y-6", className)} onSubmit={onSubmit}>
      <label className="block space-y-2">
        <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Name
        </span>
        <Input
          autoComplete="name"
          className="border border-border px-3 focus-visible:border-foreground"
          name="name"
          onChange={(e) => {
            setName(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Alex"
          required
          type="text"
          value={name}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Email
        </span>
        <Input
          autoComplete="email"
          className="border border-border px-3 focus-visible:border-foreground"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@studio.dev"
          required
          type="email"
          value={email}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Message
        </span>
        <textarea
          className="min-h-32 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
          name="message"
          onChange={(e) => {
            setMessage(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="What are you building?"
          required
          value={message}
        />
      </label>

      <Button disabled={status === "loading"} size="lg" type="submit">
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>

      {feedback && status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
