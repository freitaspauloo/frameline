"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  DemoEmailSignInForm,
  FirebaseSignInForm,
  type AuthSessionUser,
} from "@/components/firebase-sign-in-form";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { MaterialPreview } from "@/components/material-preview";
import {
  MarketingPageHeader,
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDemoSession } from "@/lib/auth-client";
import { isFirebaseClientConfigured } from "@/lib/firebase-client";
import { recordInstallIntent } from "@/lib/install-intent";
import type { MaterialCatalogEntry } from "@/materials";
import { cn } from "@/lib/utils";

function FreeMaterialInstall({ entry }: { entry: MaterialCatalogEntry }) {
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<AuthSessionUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const emailRef = useRef<string | null>(null);
  const firebaseReady = isFirebaseClientConfigured();
  const cli = `npx shadcn@latest add @frameline/${entry.slug}`;

  useEffect(() => {
    const session = getDemoSession();
    setUser(session);
    emailRef.current = session?.email ?? null;
  }, []);

  async function performCopyCli() {
    try {
      await navigator.clipboard.writeText(cli);
      recordInstallIntent({
        slug: entry.slug,
        source: "free",
        path: "cli",
      });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function copyCli() {
    if (!user?.email && !emailRef.current) {
      setAuthOpen(true);
      return;
    }
    await performCopyCli();
  }

  function onAuthSuccess(next: AuthSessionUser) {
    setUser(next);
    emailRef.current = next.email;
    setAuthOpen(false);
    void performCopyCli();
  }

  return (
    <>
      <div className="space-y-4 border-t border-border p-6 sm:p-8 lg:p-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Link
              className="font-heading text-base font-medium tracking-tight text-foreground hover:text-muted-foreground"
              href={`/materials/${entry.slug}`}
            >
              {entry.title}
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
          </div>
          <span className="shrink-0 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Free
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Install
          </p>
          <div className="flex items-start gap-2">
            <pre className="min-w-0 flex-1 overflow-x-auto bg-foreground p-3 font-mono text-[11px] leading-relaxed text-background">
              {cli}
            </pre>
            <Button
              aria-label={`Copy install command for ${entry.title}`}
              size="sm"
              type="button"
              variant="outline"
              onClick={copyCli}
            >
              {copied ? "Copied" : user?.email || emailRef.current ? "Copy" : "Sign in · Copy"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            nativeButton={false}
            render={<Link href={`/docs/installation?material=${entry.slug}`} />}
            size="sm"
          >
            Installation docs
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/materials/${entry.slug}`} />}
            size="sm"
            variant="outline"
          >
            Open material
          </Button>
        </div>
      </div>

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to copy</DialogTitle>
            <DialogDescription>
              Create a free account or sign in — then you can copy the install
              command for {entry.title}.
            </DialogDescription>
          </DialogHeader>
          {firebaseReady ? (
            <FirebaseSignInForm onSuccess={onAuthSuccess} />
          ) : (
            <DemoEmailSignInForm onSuccess={onAuthSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function FreeFunnelPage({
  materials,
}: {
  materials: MaterialCatalogEntry[];
}) {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <p className="font-mono text-[11px] text-muted-foreground">
              {materials.length} free{" "}
              {materials.length === 1 ? "material" : "materials"}
            </p>
          }
          description="Same craft bar as paid — sign in, then CLI or copy-paste into your repo. Install under 60 seconds."
          eyebrow="Free"
          title="Start with free materials"
        >
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              nativeButton={false}
              render={<Link href="/docs/installation" />}
              size="lg"
            >
              Installation guide
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/materials?tier=free" />}
              size="lg"
              variant="outline"
            >
              Browse in catalog
            </Button>
          </div>
        </MarketingPageHeader>

        <MarketingRuledGrid>
          {materials.map((entry) => (
            <MarketingRuledCell
              key={entry.slug}
              className="p-0 sm:p-0 lg:p-0"
            >
              <div className={cn("group block")}>
                <Link
                  className="block transition-colors hover:bg-muted/40"
                  href={`/materials/${entry.slug}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
                    <MaterialPreview entry={entry} />
                  </div>
                </Link>
                <FreeMaterialInstall entry={entry} />
              </div>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
