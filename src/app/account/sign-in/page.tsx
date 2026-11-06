"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useOptionalAuthSession } from "@/components/auth-session-provider";
import {
  DemoEmailSignInForm,
  FirebaseSignInForm,
} from "@/components/firebase-sign-in-form";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
} from "@/components/marketing-shell";
import { isFirebaseClientConfigured } from "@/lib/firebase-client";

export default function SignInPage() {
  const firebaseReady = isFirebaseClientConfigured();
  const router = useRouter();
  const session = useOptionalAuthSession();

  React.useEffect(() => {
    if (session?.user) router.replace("/account");
  }, [router, session?.user]);

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description={
            firebaseReady
              ? "Sign in with Google or email — create an account or log in."
              : "Firebase web config missing. Demo email sign-in is available, or add the web app keys for Google/email."
          }
          eyebrow="Account"
          title="Sign in"
        />
        <div className={marketingPad}>
          <div className="mx-auto max-w-md space-y-8">
            {firebaseReady ? (
              <FirebaseSignInForm />
            ) : (
              <>
                <DemoEmailSignInForm />
                <div className="border-t border-border pt-8">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Or configure Firebase web keys to enable Google and
                    password auth:
                  </p>
                  <FirebaseSignInForm />
                </div>
              </>
            )}
            <p className="text-center text-sm text-muted-foreground">
              <Link
                className="underline underline-offset-4 hover:text-foreground"
                href="/account"
              >
                Back to account
              </Link>
            </p>
          </div>
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
