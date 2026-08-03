"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm({
  className,
  source = "waitlist",
}: {
  className?: string;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong");
        return;
      }

      setStatus("success");
      setMessage("You’re on the list — we’ll write when it matters.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error — try again");
    }
  }

  if (status === "success") {
    return (
      <p
        className={cn(
          "text-sm leading-relaxed text-foreground",
          className,
        )}
        role="status"
      >
        {message}
      </p>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end", className)}
      onSubmit={onSubmit}
    >
      <label className="min-w-0 flex-1 space-y-2">
        <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Email
        </span>
        <Input
          autoComplete="email"
          className="border border-border border-b-border px-3 focus-visible:border-foreground"
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
      <Button disabled={status === "loading"} size="lg" type="submit">
        {status === "loading" ? "Joining…" : "Join waitlist"}
      </Button>
      {message && status === "error" ? (
        <p className="w-full text-sm text-destructive sm:basis-full" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
