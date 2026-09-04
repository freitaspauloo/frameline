import gsap from "gsap";

export function shouldRunMotion() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap };
