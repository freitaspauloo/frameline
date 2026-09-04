import gsap from "gsap";

export type SupportTintEls = {
  pink: HTMLElement;
  cyan: HTMLElement;
  lime: HTMLElement;
};

export function querySupportTints(root: HTMLElement): SupportTintEls | null {
  const pink = root.querySelector<HTMLElement>("[data-sh-tint-pink]");
  const cyan = root.querySelector<HTMLElement>("[data-sh-tint-cyan]");
  const lime = root.querySelector<HTMLElement>("[data-sh-tint-lime]");
  if (!pink || !cyan || !lime) return null;
  return { pink, cyan, lime };
}

export function setSupportTintsStatic(tints: SupportTintEls) {
  gsap.set(tints.pink, { autoAlpha: 1, scale: 1, x: 0, y: 0, clearProps: "transform" });
  gsap.set(tints.cyan, { autoAlpha: 0, clearProps: "transform" });
  gsap.set(tints.lime, { autoAlpha: 0, clearProps: "transform" });
}

export function initSupportTintEntrance(tints: SupportTintEls) {
  gsap.set(tints.pink, { autoAlpha: 0, scale: 1.14, y: "3%", transformOrigin: "50% 42%" });
  gsap.set(tints.cyan, { autoAlpha: 0, scale: 1.1, x: "-4%", transformOrigin: "62% 48%" });
  gsap.set(tints.lime, { autoAlpha: 0, scale: 1.12, x: "4%", y: "-2%", transformOrigin: "38% 52%" });
}

export function addSupportTintEntranceToTimeline(
  tl: gsap.core.Timeline,
  tints: SupportTintEls,
  at = 0.06,
) {
  tl.to(
    tints.pink,
    { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 1.2, ease: "expo.out" },
    at,
  )
    .to(
      tints.cyan,
      { autoAlpha: 0.32, scale: 1, x: 0, y: 0, duration: 1.15, ease: "power2.out" },
      at + 0.1,
    )
    .to(
      tints.lime,
      { autoAlpha: 0.26, scale: 1, x: 0, y: 0, duration: 1.15, ease: "power2.out" },
      at + 0.16,
    );
}

export function createSupportTintLoop(tints: SupportTintEls) {
  gsap.set(tints.pink, { autoAlpha: 1 });
  gsap.set(tints.cyan, { autoAlpha: 0.24 });
  gsap.set(tints.lime, { autoAlpha: 0.2 });

  const cycle = gsap.timeline({
    repeat: -1,
    defaults: { ease: "power2.inOut", duration: 3.4 },
  });

  cycle
    .to(tints.pink, { autoAlpha: 0.18 }, 0)
    .to(tints.cyan, { autoAlpha: 1 }, 0)
    .to(tints.lime, { autoAlpha: 0.28 }, 0)
    .to(tints.cyan, { autoAlpha: 0.16 }, 3.4)
    .to(tints.lime, { autoAlpha: 1 }, 3.4)
    .to(tints.pink, { autoAlpha: 0.22 }, 3.4)
    .to(tints.lime, { autoAlpha: 0.18 }, 6.8)
    .to(tints.pink, { autoAlpha: 1 }, 6.8)
    .to(tints.cyan, { autoAlpha: 0.26 }, 6.8);

  gsap.to(tints.pink, {
    scale: 1.07,
    y: "-2.5%",
    duration: 7.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(tints.cyan, {
    scale: 1.06,
    x: "2.5%",
    y: "1.5%",
    duration: 9.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 1.1,
  });
  gsap.to(tints.lime, {
    scale: 1.08,
    x: "-2%",
    y: "-1%",
    duration: 8.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 0.5,
  });

  return cycle;
}
