"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistSans } from "geist/font/sans";
import type { CSSProperties } from "react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ReticleMark } from "@/screens/reticle-mark";
import { ScreenStage } from "@/screens/stage";

export const RETICLE_LOGIN_ART = "/screens/miracle-login/cover.png";

export const RETICLE_MAGENTA = "#D600BF";

/**
 * Reticle sign-in — split panel, magenta-tinted art, GSAP entrance.
 */
export function ReticleLoginPage({
  className,
  embed = false,
}: {
  className?: string;
  embed?: boolean;
}) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [artReady, setArtReady] = useState(false);

  const handleArtLoad = useCallback(() => {
    setArtReady(true);
  }, []);

  useEffect(() => {
    if (reduced) {
      setArtReady(true);
      return;
    }
    const fallback = window.setTimeout(() => setArtReady(true), 600);
    return () => window.clearTimeout(fallback);
  }, [reduced]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !artReady) return;

      if (reduced) {
        gsap.set(
          [
            ".rl-brand-mark",
            ".rl-brand-name",
            ".rl-headline",
            ".rl-copy",
            ".rl-form-shell",
            ".rl-form-input",
            ".rl-form-submit",
            ".rl-form-note",
            ".rl-divider-line",
            ".rl-divider-label",
            ".rl-social-btn",
            ".rl-footer-link",
            ".rl-art-panel",
            ".rl-art-frame",
            ".rl-art-img",
            ".rl-content",
          ],
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotate: 0,
            clipPath: "none",
            filter: "none",
            clearProps: "transform",
          },
        );
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(".rl-art-panel", { x: 48, autoAlpha: 0 });
        gsap.set(".rl-art-frame", { clipPath: "inset(8% 8% 8% 8% round 5px)" });
        gsap.set(".rl-art-img", { scale: 1.14, x: -12 });
        gsap.set(".rl-brand-mark", { autoAlpha: 0, scale: 0.55, rotate: -28 });
        gsap.set(".rl-brand-name", { autoAlpha: 0, x: -10, filter: "blur(6px)" });
        gsap.set(".rl-content", { autoAlpha: 0, y: 22 });
        gsap.set(".rl-headline", { clipPath: "inset(100% 0 0 0)", y: 8 });
        gsap.set(".rl-copy", { autoAlpha: 0, y: 14, filter: "blur(8px)" });
        gsap.set(".rl-form-shell", { autoAlpha: 0, y: 18 });
        gsap.set(".rl-form-input", { clipPath: "inset(0 100% 0 0)" });
        gsap.set(".rl-form-submit", { autoAlpha: 0, scale: 0.88, x: 8 });
        gsap.set(".rl-form-note", { autoAlpha: 0, y: 10 });
        gsap.set(".rl-divider-line", { scaleX: 0, autoAlpha: 0, transformOrigin: "center" });
        gsap.set(".rl-divider-label", { autoAlpha: 0, scale: 0.82 });
        gsap.set(".rl-social-btn", { autoAlpha: 0, y: 16, scale: 0.97, filter: "blur(4px)" });
        gsap.set(".rl-footer-link", { autoAlpha: 0, y: 10 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(".rl-art-panel", { x: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out" }, 0)
          .to(
            ".rl-art-frame",
            { clipPath: "inset(0% 0% 0% 0% round 5px)", duration: 1.15, ease: "power4.inOut" },
            0.04,
          )
          .to(".rl-art-img", { scale: 1, x: 0, duration: 1.65, ease: "power2.out" }, 0)
          .to(".rl-brand-mark", { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.72, ease: "back.out(1.6)" }, 0.18)
          .to(".rl-brand-name", { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.55 }, 0.32)
          .to(".rl-content", { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.28)
          .to(
            ".rl-headline",
            { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.82, ease: "power4.inOut" },
            0.36,
          )
          .to(".rl-copy", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.62 }, 0.48)
          .to(".rl-form-shell", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.54)
          .to(
            ".rl-form-input",
            { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power4.inOut" },
            0.58,
          )
          .to(
            ".rl-form-submit",
            { autoAlpha: 1, scale: 1, x: 0, duration: 0.48, ease: "back.out(2)" },
            0.72,
          )
          .to(".rl-form-note", { autoAlpha: 1, y: 0, duration: 0.42 }, 0.78)
          .to(".rl-divider-line", { scaleX: 1, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: "power2.inOut" }, 0.82)
          .to(".rl-divider-label", { autoAlpha: 1, scale: 1, duration: 0.38, ease: "back.out(1.4)" }, 0.9)
          .to(
            ".rl-social-btn",
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.52,
              stagger: 0.09,
              ease: "power2.out",
            },
            0.94,
          )
          .to(".rl-footer-link", { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 }, 1.08)
          .eventCallback("onComplete", () => {
            gsap.set(".rl-headline", { clearProps: "clipPath,y" });
            gsap.set(".rl-art-frame", { clearProps: "clipPath" });
            gsap.set([".rl-brand-name", ".rl-copy", ".rl-social-btn"], { clearProps: "filter" });
          });
      }, root);

      return () => ctx.revert();
    },
    { scope, dependencies: [artReady, reduced] },
  );

  return (
    <ScreenStage embed={embed} background="#10121c" className={className}>
      <section
        ref={scope}
        className={cn(
          GeistSans.className,
          "flex h-full w-full bg-[#10121c] font-normal text-white antialiased",
        )}
      >
      <div className="relative flex h-full w-full items-stretch overflow-hidden bg-[#10121c]">
        {/* Left — form */}
        <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col md:w-1/2 md:flex-none lg:w-1/2">
          <div className="rl-brand flex shrink-0 justify-center bg-black pt-8 sm:pt-10 lg:pt-[62px]">
            <div className="flex items-center gap-2">
              <ReticleMark className="rl-brand-mark size-6 sm:size-[26px]" />
              <span className="rl-brand-name text-[16px] font-normal tracking-[-0.03em] text-white sm:text-[17px]">
                Reticle
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center bg-black px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
            <div className="rl-content w-full max-w-[340px]">
              <div className="flex flex-col items-center text-center">
                <h1 className="rl-headline text-[1.85rem] font-normal leading-none tracking-[-0.035em] text-white sm:text-[2rem] lg:text-[2.125rem]">
                  Sign in
                </h1>
                <p className="rl-copy mt-3 max-w-[300px] text-[13px] leading-relaxed text-white/55">
                  Access your inspection workspace, yield dashboards, and defect
                  models.
                </p>
              </div>

              <form
                className="mt-9"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="rl-form-shell flex h-12 items-center rounded-[5px] border border-[rgba(214,0,191,0.22)] bg-[#0a0b12] p-1 pl-4">
                  <div className="rl-form-input min-w-0 flex-1 overflow-hidden">
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Work email"
                      className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rl-form-submit inline-flex h-10 shrink-0 items-center justify-center rounded-[5px] bg-white px-5 text-[13px] font-normal text-[#10121c] transition-colors hover:bg-[#D600BF] hover:text-white"
                  >
                    Continue
                  </button>
                </div>

                <p className="rl-form-note mt-3.5 text-center text-[12.5px] text-white/45">
                  Need fab access?{" "}
                  <a
                    href="#request"
                    className="font-normal text-white underline underline-offset-[3px] transition-colors hover:text-[#D600BF]"
                  >
                    Request onboarding
                  </a>
                </p>
              </form>

              <div className="rl-divider my-7 flex items-center gap-3">
                <span className="rl-divider-line h-px flex-1 bg-white/10" aria-hidden />
                <span className="rl-divider-label text-[11px] font-normal tracking-[0.08em] text-white/35">
                  OR
                </span>
                <span className="rl-divider-line h-px flex-1 bg-white/10" aria-hidden />
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  className="rl-social-btn inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[5px] border border-[rgba(214,0,191,0.22)] bg-[#0a0b12] text-[13.5px] font-normal text-white/70 transition-colors hover:border-[rgba(214,0,191,0.35)]"
                >
                  <GoogleMark />
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="rl-social-btn inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[5px] border border-[rgba(214,0,191,0.22)] bg-[#0a0b12] text-[13.5px] font-normal text-white/70 transition-colors hover:border-[rgba(214,0,191,0.35)]"
                >
                  <SsoMark />
                  Continue with SSO
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-black px-7 pb-6 pt-2 sm:px-10 lg:px-12">
            <a
              href="#terms"
              className="rl-footer-link text-[11.5px] text-white/35 transition-colors hover:text-white/55"
            >
              Terms of Service
            </a>
            <a
              href="#privacy"
              className="rl-footer-link text-[11.5px] text-white/35 transition-colors hover:text-white/55"
            >
              Privacy policy
            </a>
          </div>
        </div>

        {/* Right — art with magenta color blend */}
        <div className="rl-art-panel relative hidden w-1/2 shrink-0 box-border self-stretch bg-black pt-2.5 pr-2.5 pb-2.5 md:block lg:pt-[15px] lg:pr-[15px] lg:pb-[15px]">
          <div className="rl-art-frame relative h-full w-full overflow-hidden rounded-[5px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- fit-to-panel without next/image fill crop */}
            <img
              src={RETICLE_LOGIN_ART}
              alt=""
              onLoad={handleArtLoad}
              className="rl-art-img absolute inset-0 size-full rounded-[5px] object-cover object-center"
            />
            <div
              className="rl-art-tint pointer-events-none absolute inset-0 rounded-[5px]"
              style={{ background: RETICLE_MAGENTA, mixBlendMode: "color" }}
              aria-hidden
            />
          </div>
        </div>
      </div>
      </section>
    </ScreenStage>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        d="M17.64 9.2c0-.74-.06-1.44-.19-2.12H9v4.01h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.25h2.9c1.7-1.56 2.69-3.87 2.69-6.84z"
      />
      <path
        fill="currentColor"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.32C2.44 15.98 5.48 18 9 18z"
      />
      <path
        fill="currentColor"
        d="M3.95 10.71A5.41 5.41 0 0 1 3.64 9c0-.6.1-1.17.28-1.71V4.97H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.03l2.99-2.32z"
      />
      <path
        fill="currentColor"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l2.99 2.32C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

function SsoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10h10M7 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
